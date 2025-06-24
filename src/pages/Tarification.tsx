
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";
import productService, { TarificationMethod } from "@/services/productService";

const Tarification = () => {
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [tarificationMethod, setTarificationMethod] = useState<TarificationMethod>("alignement");
  const [prixMax, setPrixMax] = useState<string>("");
  const [prixMin, setPrixMin] = useState<string>("");
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);

  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => productService.getAllProducts(),
  });

  const handleCalculate = async () => {
    if (!selectedProductId) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un produit",
        variant: "destructive",
      });
      return;
    }

    if (tarificationMethod === "ecremage" && !prixMax) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un prix maximum pour l'écrémage",
        variant: "destructive",
      });
      return;
    }

    if (tarificationMethod === "penetration" && !prixMin) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un prix minimum pour la pénétration",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsCalculating(true);
      let result;

      switch (tarificationMethod) {
        case "ecremage":
          result = await productService.calculateTarificationEcremage(
            selectedProductId,
            parseInt(prixMax)
          );
          break;
        case "penetration":
          result = await productService.calculateTarificationPenetration(
            selectedProductId,
            parseInt(prixMin)
          );
          break;
        case "alignement":
        default:
          result = await productService.calculateTarificationAlignement(selectedProductId);
          break;
      }

      setResult(result);
      toast({
        title: "Calcul terminé",
        description: `La tarification par ${tarificationMethod} a été calculée avec succès`,
      });
    } catch (error) {
      console.error("Erreur lors du calcul de la tarification:", error);
      toast({
        title: "Erreur",
        description: "Impossible de calculer la tarification",
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

  return (
    <DashboardLayout title="Tarification" currentPath="/tarification">
      <div className="animate-fade-in">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Tarification</h2>
          <p className="text-muted-foreground">
            Calculez la tarification optimale pour vos produits et services
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Formulaire de calcul */}
          <Card>
            <CardHeader>
              <CardTitle>Calculer la tarification</CardTitle>
              <CardDescription>
                Sélectionnez un produit/service et une méthode de tarification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="product">Produit / Service</Label>
                  <Select
                    disabled={isLoading}
                    value={selectedProductId}
                    onValueChange={setSelectedProductId}
                  >
                    <SelectTrigger id="product" className="w-full">
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

                <div className="space-y-4">
                  <Label>Méthode de tarification</Label>
                  <RadioGroup 
                    value={tarificationMethod} 
                    onValueChange={(value) => setTarificationMethod(value as TarificationMethod)}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-secondary/20">
                      <RadioGroupItem value="alignement" id="alignement" />
                      <Label htmlFor="alignement" className="flex-1 cursor-pointer">
                        <div className="font-medium">Alignement</div>
                        <div className="text-sm text-muted-foreground">
                          Alignement sur le marché et la concurrence
                        </div>
                      </Label>
                    </div>
                    
                    <div className="flex items-start space-x-2 border rounded-md p-3 hover:bg-secondary/20">
                      <RadioGroupItem value="ecremage" id="ecremage" className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor="ecremage" className="cursor-pointer">
                          <div className="font-medium">Écrémage</div>
                          <div className="text-sm text-muted-foreground mb-2">
                            Tarification premium pour capturer la valeur maximale
                          </div>
                        </Label>
                        {tarificationMethod === "ecremage" && (
                          <div className="space-y-1">
                            <Label htmlFor="prixMax" className="text-sm">Prix maximal (FCFA)</Label>
                            <Input
                              id="prixMax"
                              type="number"
                              placeholder="Prix maximal"
                              value={prixMax}
                              onChange={(e) => setPrixMax(e.target.value)}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-2 border rounded-md p-3 hover:bg-secondary/20">
                      <RadioGroupItem value="penetration" id="penetration" className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor="penetration" className="cursor-pointer">
                          <div className="font-medium">Pénétration</div>
                          <div className="text-sm text-muted-foreground mb-2">
                            Prix compétitif pour gagner des parts de marché
                          </div>
                        </Label>
                        {tarificationMethod === "penetration" && (
                          <div className="space-y-1">
                            <Label htmlFor="prixMin" className="text-sm">Prix minimal (FCFA)</Label>
                            <Input
                              id="prixMin"
                              type="number"
                              placeholder="Prix minimal"
                              value={prixMin}
                              onChange={(e) => setPrixMin(e.target.value)}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <Button
                  onClick={handleCalculate}
                  className="w-full bg-blue-gradient"
                  disabled={isCalculating || !selectedProductId}
                >
                  {isCalculating
                    ? "Calcul en cours..."
                    : "Calculer la tarification"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Résultat */}
          <Card>
            <CardHeader>
              <CardTitle>Résultat de la tarification</CardTitle>
              <CardDescription>
                Découvrez la tarification optimale pour votre produit/service
              </CardDescription>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Produit / Service</p>
                      <p className="font-medium">{result.productName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Stratégie</p>
                      <p className="font-medium capitalize">{tarificationMethod}</p>
                    </div>
                  </div>

                  <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Tarification optimale</p>
                      <p className="text-2xl font-bold text-primary">
                        {formatCurrency(result.tarificationPrice)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Marge estimée</p>
                      <p className="font-medium">{result.margin}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Revenu potentiel</p>
                      <p className="font-medium">{formatCurrency(result.potentialRevenue)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Coût de production</p>
                      <p className="font-medium">{formatCurrency(result.coutDeProduction)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Prix des concurrents</p>
                      <p className="font-medium">{formatCurrency(result.prixDesConcurrents)}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                  <p>Aucun résultat disponible</p>
                  <p className="text-sm">Sélectionnez un produit/service et lancez un calcul</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Tarification;