
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, Edit, Trash } from "lucide-react";
import { Product } from "@/services/productService";

interface ProductsListProps {
  products: Product[];
  isLoading: boolean;
  onCalculateOptimalPrice: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export const ProductsList = ({ products, isLoading, onCalculateOptimalPrice, onEdit, onDelete }: ProductsListProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XAF",
    }).format(value);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom</TableHead>
          <TableHead>Catégorie</TableHead>
          <TableHead className="text-right">Prix Concurrents</TableHead>
          <TableHead className="text-right">Coût Production</TableHead>
          <TableHead className="text-right">Stock</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8">
              Chargement...
            </TableCell>
          </TableRow>
        ) : products.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8">
              Aucun produit trouvé
            </TableCell>
          </TableRow>
        ) : (
          products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {product.description}
                  </p>
                </div>
              </TableCell>
              <TableCell>{product.category || "-"}</TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(product.prixDesConcurrents)}
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(product.coutDeProduction)}
              </TableCell>
              <TableCell className="text-right">
                {product.stock}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onCalculateOptimalPrice(product)}
                    title="Calculer le prix optimal"
                  >
                    <Calculator className="h-4 w-4" />
                  </Button>
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
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
