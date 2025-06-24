
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, Edit, Trash } from "lucide-react";
import { Product } from "@/services/productService";

interface ProductsGridProps {
  products: Product[];
  isLoading: boolean;
  onCalculateOptimalPrice: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export const ProductsGrid = ({ products, isLoading, onCalculateOptimalPrice, onEdit, onDelete }: ProductsGridProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XAF",
    }).format(value);
  };

  if (isLoading) {
    return <p className="col-span-full text-center py-8">Chargement...</p>;
  }

  if (products.length === 0) {
    return <p className="col-span-full text-center py-8">Aucun produit trouvé</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex justify-between">
              <CardTitle>{product.name}</CardTitle>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {product.category || "Non catégorisé"}
              </span>
            </div>
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
                <p className="text-sm text-muted-foreground">Coût Production</p>
                <p className="font-medium">{formatCurrency(product.coutDeProduction)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Marge</p>
                <p className="font-medium">
                  {Math.round(((product.prixDesConcurrents - product.coutDeProduction) / product.prixDesConcurrents) * 100)}%
                </p>
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
  );
};
