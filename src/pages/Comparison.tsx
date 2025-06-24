import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { toast } from "@/hooks/use-toast";
import productService, {
  TarificationResult,
  OptimalPriceResult,
} from "@/services/productService";

const Comparison = () => {
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [predictionData, setPredictionData] =
    useState<OptimalPriceResult | null>(null);
  const [ecremeageData, setEcremageData] = useState<TarificationResult | null>(
    null
  );
  const [penetrationData, setPenetrationData] =
    useState<TarificationResult | null>(null);
  const [alignementData, setAlignementData] =
    useState<TarificationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [prixMax, setPrixMax] = useState<string>("");
  const [prixMin, setPrixMin] = useState<string>("");

  const [selectedMethods, setSelectedMethods] = useState({
    prediction: true,
    ecremage: false,
    penetration: false,
    alignement: false,
  });

  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => productService.getAllProducts(),
  });

  const handleCompare = async () => {
    if (!selectedProductId) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un produit/service",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsCalculating(true);

      const results = await Promise.allSettled([
        // Récupérer les résultats selon les méthodes sélectionnées
        selectedMethods.prediction
          ? productService.calculateOptimalPrice(selectedProductId)
          : Promise.reject("Non sélectionné"),
        selectedMethods.ecremage && prixMax
          ? productService.calculateTarificationEcremage(
              selectedProductId,
              parseFloat(prixMax)
            )
          : Promise.reject("Non sélectionné"),
        selectedMethods.penetration && prixMin
          ? productService.calculateTarificationPenetration(
              selectedProductId,
              parseFloat(prixMin)
            )
          : Promise.reject("Non sélectionné"),
        selectedMethods.alignement
          ? productService.calculateTarificationAlignement(selectedProductId)
          : Promise.reject("Non sélectionné"),
      ]);

      // Récupérer les résultats qui ont réussi
      if (results[0].status === "fulfilled")
        setPredictionData(results[0].value);
      if (results[1].status === "fulfilled") setEcremageData(results[1].value);
      if (results[2].status === "fulfilled")
        setPenetrationData(results[2].value);
      if (results[3].status === "fulfilled")
        setAlignementData(results[3].value);

      toast({
        title: "Comparaison effectuée",
        description:
          "Les résultats des différentes méthodes ont été calculés avec succès",
      });
    } catch (error) {
      console.error("Erreur lors de la comparaison:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la comparaison",
        variant: "destructive",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XAF",
    }).format(value);
  };

  const prepareChartData = () => {
    const chartData: any[] = [];

    // Ajouter les résultats des différentes méthodes
    if (predictionData) {
      chartData.push({
        name: "Prédiction",
        value: predictionData.optimalPrice,
        type: "Prédiction du prix",
      });
    }

    if (ecremeageData) {
      chartData.push({
        name: "Écrémage",
        value: ecremeageData.tarificationPrice,
        type: "Écrémage",
      });
    }

    if (penetrationData) {
      chartData.push({
        name: "Pénétration",
        value: penetrationData.tarificationPrice,
        type: "Pénétration",
      });
    }

    if (alignementData) {
      chartData.push({
        name: "Alignement",
        value: alignementData.tarificationPrice,
        type: "Alignement",
      });
    }

    return chartData;
  };

  const prepareMarginData = () => {
    const marginData: any[] = [];

    if (predictionData) {
      marginData.push({
        name: "Prédiction",
        value: predictionData.margin,
        type: "Prédiction du prix",
      });
    }

    if (ecremeageData) {
      marginData.push({
        name: "Écrémage",
        value: ecremeageData.margin,
        type: "Écrémage",
      });
    }

    if (penetrationData) {
      marginData.push({
        name: "Pénétration",
        value: penetrationData.margin,
        type: "Pénétration",
      });
    }

    if (alignementData) {
      marginData.push({
        name: "Alignement",
        value: alignementData.margin,
        type: "Alignement",
      });
    }

    return marginData;
  };

  const prepareRevenueData = () => {
    const revenueData: any[] = [];

    if (predictionData) {
      revenueData.push({
        name: "Prédiction",
        value: predictionData.potentialRevenue,
        type: "Prédiction du prix",
      });
    }

    if (ecremeageData) {
      revenueData.push({
        name: "Écrémage",
        value: ecremeageData.potentialRevenue,
        type: "Écrémage",
      });
    }

    if (penetrationData) {
      revenueData.push({
        name: "Pénétration",
        value: penetrationData.potentialRevenue,
        type: "Pénétration",
      });
    }

    if (alignementData) {
      revenueData.push({
        name: "Alignement",
        value: alignementData.potentialRevenue,
        type: "Alignement",
      });
    }

    return revenueData;
  };

  const hasResults = Boolean(
    predictionData || ecremeageData || penetrationData || alignementData
  );

  return (
    <DashboardLayout title="Comparaison" currentPath="/comparison">
      <div className="animate-fade-in">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Comparaison</h2>
          <p className="text-muted-foreground">
            Comparez les résultats des différentes méthodes de calcul de prix
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Comparer les stratégies de prix</CardTitle>
            <CardDescription>
              Choisissez les méthodes à comparer et sélectionnez un
              produit/service
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <div className="space-y-2">
                  <Label htmlFor="product">Produit / Service</Label>
                  <Select
                    disabled={isLoading}
                    value={selectedProductId}
                    onValueChange={setSelectedProductId}
                  >
                    <SelectTrigger id="product">
                      <SelectValue placeholder="Sélectionner un produit/service" />
                    </SelectTrigger>
                    <SelectContent>
                      {products?.map((product: any) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-3">
                  Méthodes de calcul à comparer
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="prediction"
                      checked={selectedMethods.prediction}
                      onCheckedChange={(checked) =>
                        setSelectedMethods((prev) => ({
                          ...prev,
                          prediction: !!checked,
                        }))
                      }
                    />
                    <label
                      htmlFor="prediction"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Prédiction du prix
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="alignement"
                      checked={selectedMethods.alignement}
                      onCheckedChange={(checked) =>
                        setSelectedMethods((prev) => ({
                          ...prev,
                          alignement: !!checked,
                        }))
                      }
                    />
                    <label
                      htmlFor="alignement"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Alignement
                    </label>
                  </div>
                  <div className="space-y-2 sm:col-span-2 md:col-span-1">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="ecremage"
                        checked={selectedMethods.ecremage}
                        onCheckedChange={(checked) =>
                          setSelectedMethods((prev) => ({
                            ...prev,
                            ecremage: !!checked,
                          }))
                        }
                      />
                      <label
                        htmlFor="ecremage"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Écrémage
                      </label>
                    </div>
                    {selectedMethods.ecremage && (
                      <div className="pl-6">
                        <Label htmlFor="prixMax" className="text-xs">
                          Prix maximum
                        </Label>
                        <Input
                          id="prixMax"
                          type="number"
                          placeholder="Prix maximum"
                          value={prixMax}
                          onChange={(e) => setPrixMax(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    )}
                  </div>
                  <div className="space-y-2 sm:col-span-2 md:col-span-1">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="penetration"
                        checked={selectedMethods.penetration}
                        onCheckedChange={(checked) =>
                          setSelectedMethods((prev) => ({
                            ...prev,
                            penetration: !!checked,
                          }))
                        }
                      />
                      <label
                        htmlFor="penetration"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Pénétration
                      </label>
                    </div>
                    {selectedMethods.penetration && (
                      <div className="pl-6">
                        <Label htmlFor="prixMin" className="text-xs">
                          Prix minimum
                        </Label>
                        <Input
                          id="prixMin"
                          type="number"
                          placeholder="Prix minimum"
                          value={prixMin}
                          onChange={(e) => setPrixMin(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleCompare}
                  disabled={
                    !selectedProductId ||
                    isCalculating ||
                    (!selectedMethods.prediction &&
                      !selectedMethods.ecremage &&
                      !selectedMethods.penetration &&
                      !selectedMethods.alignement)
                  }
                  className="bg-blue-gradient"
                >
                  {isCalculating ? "Calcul en cours..." : "Comparer"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {hasResults ? (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Comparaison des prix</CardTitle>
                <CardDescription>
                  Analyse comparative des prix calculés selon différentes
                  méthodes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart
                    data={prepareChartData()}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number) => [formatCurrency(value), ""]}
                    />
                    <Legend />
                    <Bar
                      dataKey="value"
                      name="Prix"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Comparaison des marges</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={prepareMarginData()}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis unit="%" />
                      <Tooltip
                        formatter={(value: number) => [
                          `${value.toFixed(2)}%`,
                          "",
                        ]}
                      />
                      <Bar
                        dataKey="value"
                        name="Marge (%)"
                        fill="#10b981"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Comparaison des revenus potentiels</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={prepareRevenueData()}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip
                        formatter={(value: number) => [
                          formatCurrency(value),
                          "",
                        ]}
                      />
                      <Bar
                        dataKey="value"
                        name="Revenu potentiel"
                        fill="#8b5cf6"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Détail des résultats</CardTitle>
                <CardDescription>
                  Comparatif détaillé des différentes méthodes de calcul
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                  {predictionData && (
                    <Card className="overflow-hidden border-t-4 border-t-blue-500">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Prédiction</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Prix</p>
                          <p className="text-xl font-semibold">
                            {formatCurrency(predictionData.optimalPrice)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Marge</p>
                          <p>{predictionData.margin}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Revenu potentiel
                          </p>
                          <p>
                            {formatCurrency(predictionData.potentialRevenue)}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {ecremeageData && (
                    <Card className="overflow-hidden border-t-4 border-t-amber-500">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Écrémage</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Prix</p>
                          <p className="text-xl font-semibold">
                            {formatCurrency(ecremeageData.tarificationPrice)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Marge</p>
                          <p>{ecremeageData.margin}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Revenu potentiel
                          </p>
                          <p>
                            {formatCurrency(ecremeageData.potentialRevenue)}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {penetrationData && (
                    <Card className="overflow-hidden border-t-4 border-t-green-500">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Pénétration</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Prix</p>
                          <p className="text-xl font-semibold">
                            {formatCurrency(penetrationData.tarificationPrice)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Marge</p>
                          <p>{penetrationData.margin}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Revenu potentiel
                          </p>
                          <p>
                            {formatCurrency(penetrationData.potentialRevenue)}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {alignementData && (
                    <Card className="overflow-hidden border-t-4 border-t-red-500">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Alignement</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Prix</p>
                          <p className="text-xl font-semibold">
                            {formatCurrency(alignementData.tarificationPrice)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Marge</p>
                          <p>{alignementData.margin}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Revenu potentiel
                          </p>
                          <p>
                            {formatCurrency(alignementData.potentialRevenue)}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-12">
              <p className="text-muted-foreground mb-2">
                Aucune comparaison disponible
              </p>
              <p className="text-sm text-muted-foreground">
                Sélectionnez un produit/service et des méthodes à comparer pour
                voir les résultats
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Comparison;
