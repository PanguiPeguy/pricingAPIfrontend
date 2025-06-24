
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, Edit, Trash } from "lucide-react";
import { Product } from "@/services/productService";

interface ProductsByCategoryProps {
  productsByCategory: Record<string, Product[]>;
  isLoading: boolean;
  onCalculateOptimalPrice: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export const ProductsByCategory = ({ 
  productsByCategory, 
  isLoading,
  onCalculateOptimalPrice, 
  onEdit, 
  onDelete 
}: ProductsByCategoryProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XAF",
    }).format(value);
  };

  if (isLoading) {
    return <p className="text-center py-8">Chargement...</p>;
  }

  if (Object.keys(productsByCategory).length === 0) {
    return <p className="text-center py-8">Aucun produit trouvé</p>;
  }

  return (
    <div className="space-y-8">
      {Object.entries(productsByCategory).map(([category, products]) => (
        <div key={category}>
          <h3 className="text-lg font-semibold mb-4">{category}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle>{product.name}</CardTitle>
                  <CardDescription className="mt-2 line-clamp-2">
                    {product.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Prix Concurrents</p>
                      <p className="font-medium">{formatCurrency(product.prixDesConcurrents)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Stock</p>
                      <p className="font-medium">{product.stock}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-3 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onCalculateOptimalPrice(product)}
                  >
                    <Calculator className="h-4 w-4 mr-2" />
                    Prix optimal
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onEdit(product)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onDelete(product)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
