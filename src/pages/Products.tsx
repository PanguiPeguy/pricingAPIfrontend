import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Product } from "@/services/productService";

// Import components
import { ProductDialog } from "@/features/products/components/ProductDialog";
import { DeleteProductDialog } from "@/features/products/components/DeleteProductDialog";
import { ProductsList } from "@/features/products/components/ProductsList";
import { ProductsGrid } from "@/features/products/components/ProductsGrid";
import { ProductsByCategory } from "@/features/products/components/ProductsByCategory";
import { ProductsHeader } from "@/features/products/components/ProductsHeader";
import { useProducts } from "@/features/products/hooks/useProducts";

const Products = () => {
  const {
    filteredProducts,
    productsByCategory,
    isLoading,
    searchTerm,
    setSearchTerm,
    fetchProducts,
    calculateOptimalPrice,
  } = useProducts();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState("products");
  const [viewMode, setViewMode] = useState("list");

  // Séparation des produits et services
  const products = filteredProducts.filter((item) => item.type === "produit");
  const services = filteredProducts.filter((item) => item.type === "service");

  // Catégorisation par type
  const productsByType = {
    products: {
      items: products,
      byCategory: products.reduce((acc, product) => {
        const category = product.category || "Non catégorisé";
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(product);
        return acc;
      }, {} as Record<string, Product[]>),
    },
    services: {
      items: services,
      byCategory: services.reduce((acc, service) => {
        const category = service.category || "Non catégorisé";
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(service);
        return acc;
      }, {} as Record<string, Product[]>),
    },
  };

  const openCreateDialog = () => {
    setCurrentProduct(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setCurrentProduct(product);
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (product: Product) => {
    setCurrentProduct(product);
    setIsDeleteDialogOpen(true);
  };

  return (
    <DashboardLayout title="Gestion des produits" currentPath="/products">
      <div className="animate-fade-in">
        <ProductsHeader
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onAddProduct={openCreateDialog}
        />

        <Tabs
          defaultValue="products"
          className="mb-6"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList>
            <TabsTrigger value="products">Produits</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="mt-6">
            <Tabs
              defaultValue="list"
              value={viewMode}
              onValueChange={setViewMode}
            >
              <TabsList>
                <TabsTrigger value="list">Liste</TabsTrigger>
                <TabsTrigger value="grid">Grille</TabsTrigger>
                <TabsTrigger value="category">Catégories</TabsTrigger>
              </TabsList>

              <TabsContent value="list" className="mt-6">
                <Card>
                  <CardContent className="p-0">
                    <ProductsList
                      products={productsByType.products.items}
                      isLoading={isLoading}
                      onCalculateOptimalPrice={calculateOptimalPrice}
                      onEdit={openEditDialog}
                      onDelete={openDeleteDialog}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="grid" className="mt-6">
                <ProductsGrid
                  products={productsByType.products.items}
                  isLoading={isLoading}
                  onCalculateOptimalPrice={calculateOptimalPrice}
                  onEdit={openEditDialog}
                  onDelete={openDeleteDialog}
                />
              </TabsContent>

              <TabsContent value="category" className="mt-6">
                <ProductsByCategory
                  productsByCategory={productsByType.products.byCategory}
                  isLoading={isLoading}
                  onCalculateOptimalPrice={calculateOptimalPrice}
                  onEdit={openEditDialog}
                  onDelete={openDeleteDialog}
                />
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="services" className="mt-6">
            <Tabs
              defaultValue="list"
              value={viewMode}
              onValueChange={setViewMode}
            >
              <TabsList>
                <TabsTrigger value="list">Liste</TabsTrigger>
                <TabsTrigger value="grid">Grille</TabsTrigger>
                <TabsTrigger value="category">Catégories</TabsTrigger>
              </TabsList>

              <TabsContent value="list" className="mt-6">
                <Card>
                  <CardContent className="p-0">
                    <ProductsList
                      products={productsByType.services.items}
                      isLoading={isLoading}
                      onCalculateOptimalPrice={calculateOptimalPrice}
                      onEdit={openEditDialog}
                      onDelete={openDeleteDialog}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="grid" className="mt-6">
                <ProductsGrid
                  products={productsByType.services.items}
                  isLoading={isLoading}
                  onCalculateOptimalPrice={calculateOptimalPrice}
                  onEdit={openEditDialog}
                  onDelete={openDeleteDialog}
                />
              </TabsContent>

              <TabsContent value="category" className="mt-6">
                <ProductsByCategory
                  productsByCategory={productsByType.services.byCategory}
                  isLoading={isLoading}
                  onCalculateOptimalPrice={calculateOptimalPrice}
                  onEdit={openEditDialog}
                  onDelete={openDeleteDialog}
                />
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>

      {/* Product Dialog for Create/Edit */}
      <ProductDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        currentProduct={currentProduct}
        onProductUpdated={fetchProducts}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteProductDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        product={currentProduct}
        onProductDeleted={fetchProducts}
      />
    </DashboardLayout>
  );
};

export default Products;
