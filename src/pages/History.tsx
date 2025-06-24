
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import productService from "@/services/productService";
import { toast } from "@/hooks/use-toast";

const History = () => {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [tarificationChartData, setTarificationChartData] = useState<any[]>([]);
  const [products, setProducts] = useState<{ id: string; name: string; }[]>([]);
  const [selectedHistoryType, setSelectedHistoryType] = useState<"pricing" | "tarification" | "all">("all");

  const { data: historyData, isLoading: isPricingLoading } = useQuery({
    queryKey: ["pricing-history"],
    queryFn: () => productService.getPricingHistory(),
  });

  const { data: tarificationHistoryData, isLoading: isTarificationLoading } = useQuery({
    queryKey: ["tarification-history"],
    queryFn: () => productService.getTarificationHistory(),
  });

  useEffect(() => {
    if (historyData && tarificationHistoryData) {
      // Extraire la liste unique des produits en combinant les deux historiques
      const allHistoryItems = [...historyData, ...tarificationHistoryData];
      const uniqueProducts = Array.from(
        new Map(
          allHistoryItems.map((item: any) => [
            item.productId,
            { id: item.productId as string, name: item.productName }
          ])
        ).values()
      );
      
      setProducts(uniqueProducts as { id: string; name: string; }[]);
      
      if (uniqueProducts.length > 0 && !selectedProduct) {
        const firstProduct = uniqueProducts[0] as { id: string; name: string };
        setSelectedProduct(firstProduct.id);
      }
    }
  }, [historyData, tarificationHistoryData, selectedProduct]);

  useEffect(() => {
    if ((selectedHistoryType === "pricing" || selectedHistoryType === "all") && historyData && selectedProduct) {
      const filteredData = historyData
        .filter((item: any) => item.productId === selectedProduct)
        .map((item: any) => ({
          date: new Date(item.calculatedAt).toLocaleDateString(),
          timestamp: new Date(item.calculatedAt).getTime(),
          price: item.optimalPrice,
          basePrice: item.prixDesConcurrents,
          type: "Optimal"
        }))
        .sort((a: any, b: any) => a.timestamp - b.timestamp);

      setChartData(filteredData);
    }

    if ((selectedHistoryType === "tarification" || selectedHistoryType === "all") && tarificationHistoryData && selectedProduct) {
      const filteredData = tarificationHistoryData
        .filter((item: any) => item.productId === selectedProduct)
        .map((item: any) => ({
          date: new Date(item.calculatedAt).toLocaleDateString(),
          timestamp: new Date(item.calculatedAt).getTime(),
          price: item.tarificationPrice,
          basePrice: item.prixDesConcurrents,
          type: item.tarificationType || "Standard"
        }))
        .sort((a: any, b: any) => a.timestamp - b.timestamp);

      setTarificationChartData(filteredData);
    }
  }, [historyData, tarificationHistoryData, selectedProduct, selectedHistoryType]);

  function formatCurrency(value: number) {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XAF",
    }).format(value);
  }

  // Combiner les données pour l'affichage
  const combinedChartData = () => {
    if (selectedHistoryType === "pricing") return chartData;
    if (selectedHistoryType === "tarification") return tarificationChartData;
    
    // Combiner les deux ensembles de données
    const combined = [...chartData, ...tarificationChartData]
      .sort((a, b) => a.timestamp - b.timestamp);
    
    return combined;
  };

  const tableData = () => {
    if (selectedHistoryType === "pricing") return chartData;
    if (selectedHistoryType === "tarification") return tarificationChartData;
    return [...chartData, ...tarificationChartData]
      .sort((a, b) => b.timestamp - a.timestamp); // Tri par date décroissante
  };

  const handleProductChange = (productId: string) => {
    setSelectedProduct(productId);
  };

  const isLoading = isPricingLoading || isTarificationLoading;
  const hasData = (selectedHistoryType === "pricing" || selectedHistoryType === "all") && chartData.length > 0 || 
                 (selectedHistoryType === "tarification" || selectedHistoryType === "all") && tarificationChartData.length > 0;

  return (
    <DashboardLayout title="Historique" currentPath="/history">
      <div className="animate-fade-in">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Historique des prix</h2>
          <p className="text-muted-foreground">
            Suivez l'évolution des prix calculés pour vos produits/services
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filtres</CardTitle>
            <CardDescription>
              Sélectionnez un produit/service et le type d'historique à afficher
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-1/2">
                <label htmlFor="product-select" className="text-sm font-medium block mb-1">
                  Produit/Service
                </label>
                <Select
                  value={selectedProduct || ""}
                  onValueChange={handleProductChange}
                >
                  <SelectTrigger id="product-select">
                    <SelectValue placeholder="Sélectionner un produit" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full sm:w-1/2">
                <label htmlFor="history-type" className="text-sm font-medium block mb-1">
                  Type d'historique
                </label>
                <Select
                  value={selectedHistoryType}
                  onValueChange={(value: "pricing" | "tarification" | "all") => setSelectedHistoryType(value)}
                >
                  <SelectTrigger id="history-type">
                    <SelectValue placeholder="Type d'historique" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les historiques</SelectItem>
                    <SelectItem value="pricing">Prix optimaux</SelectItem>
                    <SelectItem value="tarification">Tarification</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="graph">
          <TabsList className="mb-4">
            <TabsTrigger value="graph">Graphique</TabsTrigger>
            <TabsTrigger value="table">Tableau</TabsTrigger>
          </TabsList>

          <TabsContent value="graph">
            <Card>
              <CardHeader>
                <CardTitle>Évolution des prix dans le temps</CardTitle>
                <CardDescription>
                  Visualisez comment les prix calculés ont évolué dans le temps pour ce produit/service
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center h-80">
                    <p>Chargement...</p>
                  </div>
                ) : hasData ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart
                      data={combinedChartData()}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        padding={{ left: 30, right: 30 }} 
                      />
                      <YAxis
                        tickFormatter={(value) =>
                          new Intl.NumberFormat("fr-FR", {
                            style: "currency",
                            currency: "EUR",
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }).format(value)
                        }
                      />
                      <Tooltip 
                        formatter={(value) => [formatCurrency(value as number), ""]}
                        labelFormatter={(label) => `Date: ${label}`}
                      />
                      <Legend />
                      {(selectedHistoryType === "pricing" || selectedHistoryType === "all") && (
                        <Line
                          type="monotone"
                          dataKey="price"
                          stroke="#82ca9d"
                          name="Prix optimal"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 8 }}
                        />
                      )}
                      {(selectedHistoryType === "tarification" || selectedHistoryType === "all") && (
                        <>
                          <Line
                            type="monotone"
                            dataKey="price"
                            stroke="#8884d8"
                            name="Prix tarifé"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 8 }}
                            connectNulls
                          />
                        </>
                      )}
                      <Line
                        type="monotone"
                        dataKey="basePrice"
                        stroke="#ffc658"
                        name="Prix de base"
                        strokeDasharray="5 5"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex justify-center items-center h-80">
                    <p className="text-muted-foreground">
                      Aucune donnée historique disponible pour ce produit/service
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="table">
            <Card>
              <CardHeader>
                <CardTitle>Historique détaillé</CardTitle>
                <CardDescription>
                  Historique complet des prix calculés pour ce produit/service
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center h-20">
                    <p>Chargement...</p>
                  </div>
                ) : hasData ? (
                  <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs uppercase bg-muted">
                        <tr>
                          <th className="px-6 py-3">Date</th>
                          <th className="px-6 py-3">Méthode</th>
                          <th className="px-6 py-3">Prix de base</th>
                          <th className="px-6 py-3">Prix calculé</th>
                          <th className="px-6 py-3">Différence</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableData().map((item, index) => (
                          <tr key={index} className="border-b">
                            <td className="px-6 py-4">{item.date}</td>
                            <td className="px-6 py-4">{item.type}</td>
                            <td className="px-6 py-4">{formatCurrency(item.basePrice)}</td>
                            <td className="px-6 py-4">{formatCurrency(item.price)}</td>
                            <td className="px-6 py-4">
                              <span
                                className={
                                  item.price > item.basePrice
                                    ? "text-green-500"
                                    : item.price < item.basePrice
                                    ? "text-red-500"
                                    : ""
                                }
                              >
                                {formatCurrency(item.price - item.basePrice)} (
                                {((item.price / item.basePrice - 1) * 100).toFixed(2)}%)
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="flex justify-center items-center h-20">
                    <p className="text-muted-foreground">
                      Aucune donnée historique disponible pour ce produit/service
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default History;