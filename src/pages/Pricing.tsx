import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import productService, {
  Product,
  OptimalPriceResult,
} from "@/services/productService";
import { TrendingUp, Calculator, Zap } from "lucide-react";

const Pricing = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [pricingResult, setPricingResult] = useState<OptimalPriceResult | null>(
    null
  );

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedProductId) {
      const product = products.find((p) => p.id === selectedProductId);
      setSelectedProduct(product || null);
    } else {
      setSelectedProduct(null);
    }
    setPricingResult(null);
  }, [selectedProductId, products]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les produits",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCalculatePrice = async () => {
    if (!selectedProductId) {
      toast({
        title: "Attention",
        description: "Veuillez sélectionner un produit",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsCalculating(true);
      const result = await productService.calculateOptimalPrice(
        selectedProductId
      );
      setPricingResult(result);
      toast({
        title: "Prix optimal calculé",
        description: "Le prix optimal a été calculé avec succès",
      });
    } catch (error) {
      console.error("Error calculating optimal price:", error);
      toast({
        title: "Erreur",
        description: "Impossible de calculer le prix optimal",
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("fr-FR");
  };

  // Calculate improvement percentage
  const calculateImprovement = () => {
    if (!pricingResult || !selectedProduct) return 0;
    const originalMargin =
      selectedProduct.prixDesConcurrents - selectedProduct.coutDeProduction;
    const newMargin =
      pricingResult.optimalPrice - selectedProduct.coutDeProduction;
    return Math.round(((newMargin - originalMargin) / originalMargin) * 100);
  };

  return (
    <DashboardLayout title="Calcul des prix optimaux" currentPath="/pricing">
      <div className="animate-fade-in">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Optimisation des prix</h2>
          <p className="text-muted-foreground">
            Calculez le prix optimal pour maximiser vos revenus
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Sélectionner un produit</CardTitle>
              <CardDescription>
                Choisissez un produit pour calculer son prix optimal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Select
                  value={selectedProductId}
                  onValueChange={setSelectedProductId}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un produit" />
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

              {selectedProduct && (
                <div className="space-y-4 py-2 border-t border-b">
                  <div>
                    <p className="text-sm text-muted-foreground">Nom</p>
                    <p className="font-medium">{selectedProduct.name}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Prix des Concurrrents
                      </p>
                      <p className="font-medium">
                        {formatCurrency(selectedProduct.prixDesConcurrents)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Coût</p>
                      <p className="font-medium">
                        {formatCurrency(selectedProduct.coutDeProduction)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Marge</p>
                      <p className="font-medium">
                        {formatCurrency(
                          selectedProduct.prixDesConcurrents -
                            selectedProduct.coutDeProduction
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">
                        marge desiree
                      </p>
                      <p className="font-medium">
                        {Math.round(
                          ((selectedProduct.prixDesConcurrents -
                            selectedProduct.coutDeProduction) /
                            selectedProduct.prixDesConcurrents) *
                            100
                        )}
                        %
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <Button
                onClick={handleCalculatePrice}
                className="w-full bg-blue-gradient"
                disabled={!selectedProductId || isCalculating}
              >
                {isCalculating ? (
                  "Calcul en cours..."
                ) : (
                  <>
                    <Calculator className="mr-2 h-4 w-4" /> Calculer le prix
                    optimal
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Résultat d'optimisation</CardTitle>
              <CardDescription>
                {pricingResult
                  ? `Résultat du calcul pour ${pricingResult.productName}`
                  : "Sélectionnez un produit et lancez le calcul"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!pricingResult ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-blue-100 p-4 mb-4">
                    <Zap className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">
                    Pas encore de calcul
                  </h3>
                  <p className="text-muted-foreground max-w-md">
                    Sélectionnez un produit et lancez le calcul pour voir les
                    résultats d'optimisation de prix
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Price comparison */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-secondary/50">
                      <CardHeader className="pb-2">
                        <CardDescription>Prix actuel</CardDescription>
                        <CardTitle className="text-2xl">
                          {formatCurrency(pricingResult.prixDesConcurrents)}
                        </CardTitle>
                      </CardHeader>
                    </Card>

                    <Card className="bg-primary/10">
                      <CardHeader className="pb-2">
                        <CardDescription>Prix optimal</CardDescription>
                        <CardTitle className="text-2xl text-primary">
                          {formatCurrency(pricingResult.optimalPrice)}
                        </CardTitle>
                      </CardHeader>
                    </Card>
                  </div>

                  {/* Improvement stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Marge améliorée
                      </p>
                      <div className="flex items-center">
                        <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                        <span className="text-lg font-semibold text-green-600">
                          +{calculateImprovement()}%
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Marge estimée
                      </p>
                      <p className="text-lg font-semibold">
                        {formatCurrency(pricingResult.margin)}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Revenu potentiel
                      </p>
                      <p className="text-lg font-semibold">
                        {formatCurrency(pricingResult.potentialRevenue)}
                      </p>
                    </div>
                  </div>

                  {/* Price composition */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Composition du prix</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Coût</span>
                          <span>
                            {formatCurrency(
                              selectedProduct?.coutDeProduction || 0
                            )}
                          </span>
                        </div>
                        <Progress
                          value={
                            ((selectedProduct?.coutDeProduction || 0) /
                              pricingResult.optimalPrice) *
                            100
                          }
                          className="h-2"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Marge</span>
                          <span>{formatCurrency(pricingResult.margin)}</span>
                        </div>
                        <Progress
                          value={
                            (pricingResult.margin /
                              pricingResult.optimalPrice) *
                            100
                          }
                          className="h-2 bg-muted"
                        />
                      </div>

                      <div className="flex justify-between text-sm font-medium mt-2">
                        <span>Prix optimal</span>
                        <span>
                          {formatCurrency(pricingResult.optimalPrice)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Last calculation */}
                  <div className="mt-6 pt-4 border-t text-sm text-muted-foreground">
                    <p>
                      Calcul effectué le{" "}
                      {formatDate(pricingResult.calculatedAt)}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Pricing;
