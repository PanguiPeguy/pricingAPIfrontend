
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";

interface ProductsHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddProduct: () => void;
}

export const ProductsHeader = ({ searchTerm, onSearchChange, onAddProduct }: ProductsHeaderProps) => {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold">Produits & Services</h2>
          <p className="text-muted-foreground">
            Gérez votre catalogue de produits et calculez les prix optimaux
          </p>
        </div>
        <Button onClick={onAddProduct} className="bg-blue-gradient">
          <Plus className="mr-2 h-4 w-4" /> Nouveau produit/service
        </Button>
      </div>

      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <Input
          placeholder="Rechercher un produit..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
    </>
  );
};
