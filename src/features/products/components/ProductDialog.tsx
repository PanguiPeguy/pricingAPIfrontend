import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import productService, {
  CreateProductData,
  Product,
  PRODUCT_CATEGORIES,
  PRODUCT_TYPES,
} from "@/services/productService";

interface ProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentProduct: Product | null;
  onProductUpdated: () => void;
}

export const ProductDialog = ({
  isOpen,
  onClose,
  currentProduct,
  onProductUpdated,
}: ProductDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateProductData>({
    name: "",
    description: "",
    prixDesConcurrents: 0,
    coutDeProduction: 0,
    category: "",
    type: "produit",
    stock: 0,
    competitorPrice: 0,
    desiredMargin: 0,
  });

  // Pré-remplir le formulaire avec les données du produit existant
  useEffect(() => {
    if (currentProduct) {
      setFormData({
        name: currentProduct.name || "",
        description: currentProduct.description || "",
        prixDesConcurrents: currentProduct.prixDesConcurrents || 0,
        coutDeProduction: currentProduct.coutDeProduction || 0,
        category: currentProduct.category || "",
        type: currentProduct.type || "produit",
        stock: currentProduct.stock || 0,
        competitorPrice: currentProduct.competitorPrice || 0,
        desiredMargin: currentProduct.desiredMargin || 0,
      });
    } else {
      // Reset pour un nouveau produit
      resetForm();
    }
  }, [currentProduct]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "prixDesConcurrents" ||
        name === "coutDeProduction" ||
        name === "stock"
          ? Number(value)
          : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await productService.createProduct(formData);
      toast({
        title: "Succès",
        description: "Le produit a été créé avec succès",
      });
      onProductUpdated();
      onClose();
      resetForm();
    } catch (error) {
      console.error("Error creating product:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le produit",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct) return;

    try {
      setIsLoading(true);
      await productService.updateProduct(currentProduct.id, formData);
      toast({
        title: "Succès",
        description: "Le produit a été mis à jour avec succès",
      });
      onProductUpdated();
      onClose();
      resetForm();
    } catch (error) {
      console.error("Error updating product:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le produit",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      prixDesConcurrents: 0,
      coutDeProduction: 0,
      category: "",
      type: "produit",
      stock: 0,
      competitorPrice: 0,
      desiredMargin: 0,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            {currentProduct
              ? "Modifier le produit/service"
              : "Ajouter un produit/service"}
          </DialogTitle>
          <DialogDescription>
            {currentProduct
              ? "Modifiez les informations du produit/service ci-dessous"
              : "Remplissez les informations du nouveau produit/service"}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={currentProduct ? handleUpdateProduct : handleCreateProduct}
        >
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleSelectChange("type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRODUCT_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="category">Catégorie</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    handleSelectChange("category", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRODUCT_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="prixDesConcurrents">Prix des Concurrents</Label>
                <Input
                  id="prixDesConcurrents"
                  name="prixDesConcurrents"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.prixDesConcurrents}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="coutDeProduction">Coût de Production</Label>
                <Input
                  id="coutDeProduction"
                  name="coutDeProduction"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.coutDeProduction}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="desiredMargin">Marge désirée (%)</Label>
                <Input
                  id="desiredMargin"
                  name="desiredMargin"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.desiredMargin || 0}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-gradient"
            >
              {isLoading
                ? "Enregistrement..."
                : currentProduct
                ? "Mettre à jour"
                : "Créer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
