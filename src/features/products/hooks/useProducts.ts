import { useState, useEffect } from "react";
import productService, { Product } from "@/services/productService";
import { toast } from "@/hooks/use-toast";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

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

  const calculateOptimalPrice = async (product: Product) => {
    try {
      const result = await productService.calculateOptimalPrice(product.id);
      toast({
        title: "Prix optimal calculé",
        description: `Prix optimal pour ${product.name}: ${formatCurrency(
          result.optimalPrice
        )}`,
      });
    } catch (error) {
      console.error("Error calculating optimal price:", error);
      toast({
        title: "Erreur",
        description: "Impossible de calculer le prix optimal",
        variant: "destructive",
      });
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Grouped products by category
  const productsByCategory = filteredProducts.reduce((acc, product) => {
    const category = product.category || "Non catégorisé";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XAF",
    }).format(value);
  };

  return {
    products,
    filteredProducts,
    productsByCategory,
    isLoading,
    searchTerm,
    setSearchTerm,
    fetchProducts,
    calculateOptimalPrice,
    formatCurrency,
  };
};
