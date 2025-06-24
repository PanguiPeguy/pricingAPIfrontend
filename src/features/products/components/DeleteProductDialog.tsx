
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import productService, { Product } from "@/services/productService";

interface DeleteProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onProductDeleted: () => void;
}

export const DeleteProductDialog = ({ isOpen, onClose, product, onProductDeleted }: DeleteProductDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteProduct = async () => {
    if (!product) return;
    
    try {
      setIsLoading(true);
      await productService.deleteProduct(product.id);
      toast({
        title: "Succès",
        description: "Le produit a été supprimé avec succès",
      });
      onProductDeleted();
      onClose();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le produit",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce produit?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est irréversible. Le produit/service "{product?.name}" sera définitivement supprimé.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteProduct}
            className="bg-red-500 text-white hover:bg-red-600"
            disabled={isLoading}
          >
            {isLoading ? "Suppression..." : "Supprimer"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
