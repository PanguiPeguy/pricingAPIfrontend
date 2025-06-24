import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import DoughnutChart from "@/components/charts/DoughnutChart";
import { ArrowDown, ArrowUp, CircleDot, ShoppingBag } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import productService from "@/services/productService";

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

interface RecentActivity {
  id: string;
  type: "optimisation" | "ecremage" | "alignement" | "penetration";
  productName: string;
  date: string;
  price: number;
}

const Dashboard = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>(
    []
  );

  useEffect(() => {
    fetchProducts();
    generateRecentActivities();
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

  const generateRecentActivities = () => {
    // Simule des activités récentes pour la démonstration
    const types: (
      | "optimisation"
      | "ecremage"
      | "alignement"
      | "penetration"
    )[] = ["optimisation", "ecremage", "alignement", "penetration"];

    const activities: RecentActivity[] = Array.from({ length: 10 }, (_, i) => {
      const randomType = types[Math.floor(Math.random() * types.length)];
      const randomDate = new Date();
      randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 14));

      return {
        id: `act-${i}`,
        type: randomType,
        productName: `Produit ${i + 1}`,
        date: randomDate.toLocaleDateString("fr-FR"),
        price: Math.floor(Math.random() * 1000) + 50,
      };
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setRecentActivities(activities);
  };

  const totalProducts = products.length;

  const totalRevenue = products.reduce((sum, product) => {
    return (
      sum + product.prixDesConcurrents * parseInt(product.stock.toString())
    );
  }, 0);

  const averageCompetitorPrice =
    products.reduce((sum, product) => sum + product.prixDesConcurrents, 0) /
      totalProducts || 0;

  const averageProductionCost =
    products.reduce((sum, product) => sum + product.coutDeProduction, 0) /
      totalProducts || 0;

  const productsByCategory = products.reduce((acc: any, product) => {
    const category = product.category || "Non catégorisé";
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category]++;
    return acc;
  }, {});

  const categoryData: CategoryData[] = Object.keys(productsByCategory).map(
    (category) => ({
      name: category,
      value: productsByCategory[category],
      color: getRandomColor(),
    })
  );

  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XAF",
    }).format(value);
  };

  const calculateMargin = (product: any) => {
    return Math.round(
      ((product.prixDesConcurrents - product.coutDeProduction) /
        product.prixDesConcurrents) *
        100
    );
  };

  const topSellingProducts = [...products]
    .sort((a, b) => b.stock - a.stock)
    .slice(0, 5);

  const lowStockProducts = products.filter((product) => product.stock < 10);

  const calculateTotalStockValue = () => {
    return products.reduce((total, product) => {
      return total + product.prixDesConcurrents * product.stock;
    }, 0);
  };

  const totalStockValue = calculateTotalStockValue();

  const calculateAverageMargin = () => {
    if (products.length === 0) return 0;
    const totalMargin = products.reduce((sum, product) => {
      return sum + calculateMargin(product);
    }, 0);
    return Math.round(totalMargin / products.length);
  };

  const averageMargin = calculateAverageMargin();

  const revenueGrowth = 5.2; // Exemple pour la démonstration
  const costSavings = 3.7; // Exemple pour la démonstration

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "optimisation":
        return "⚡";
      case "ecremage":
        return "⬆️";
      case "alignement":
        return "⚖️";
      case "penetration":
        return "⬇️";
      default:
        return "🔄";
    }
  };

  const getActivityText = (type: string) => {
    switch (type) {
      case "optimisation":
        return "Optimisation de prix";
      case "ecremage":
        return "Tarification d'écrémage";
      case "alignement":
        return "Tarification d'alignement";
      case "penetration":
        return "Tarification de pénétration";
      default:
        return "Activité";
    }
  };

  return (
    <DashboardLayout title="Tableau de bord" currentPath="/dashboard">
      <div className="animate-fade-in">
        <div className="mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold">Tableau de bord</h2>
            <Badge variant="secondary">
              Dernière mise à jour: {new Date().toLocaleDateString()}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Aperçu global de votre activité et de vos produits
          </p>
        </div>

        {isLoading ? (
          <p>Chargement des données...</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Produits</CardTitle>
                <CardDescription>Nombre total de produits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalProducts}</div>
                <p className="text-sm text-muted-foreground">
                  <ShoppingBag className="mr-2 h-4 w-4 inline-block" />
                  {lowStockProducts.length} produits avec un stock faible
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Revenu total</CardTitle>
                <CardDescription>
                  Revenu brut de tous les produits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(totalRevenue)}
                </div>
                <p className="text-sm text-muted-foreground">
                  <ArrowUp className="mr-2 h-4 w-4 inline-block text-green-500" />
                  {revenueGrowth.toFixed(2)}% de croissance par rapport au mois
                  dernier
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Marge moyenne</CardTitle>
                <CardDescription>Marge bénéficiaire moyenne</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{averageMargin}%</div>
                <Progress value={averageMargin} className="h-2 mt-2 mb-1" />
                <p className="text-sm text-muted-foreground">Objectif: 45%</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Valeur du stock</CardTitle>
                <CardDescription>
                  Valeur totale des produits en stock
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(totalStockValue)}
                </div>
                <p className="text-sm text-muted-foreground">
                  <ArrowDown className="mr-2 h-4 w-4 inline-block text-red-500" />
                  {costSavings.toFixed(2)}% d'économies sur les coûts
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Prix et coûts moyens</CardTitle>
              <CardDescription>
                Prix concurrents vs. coûts de production
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Prix concurrents</p>
                      <p className="text-2xl font-bold">
                        {formatCurrency(averageCompetitorPrice)}
                      </p>
                    </div>
                    <Badge className="bg-blue-500">Marché</Badge>
                  </div>
                  <Progress value={85} className="h-2 mt-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Coût de production</p>
                      <p className="text-2xl font-bold">
                        {formatCurrency(averageProductionCost)}
                      </p>
                    </div>
                    <Badge className="bg-amber-500">Interne</Badge>
                  </div>
                  <Progress value={55} className="h-2 mt-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Marge potentielle</p>
                      <p className="text-2xl font-bold">
                        {formatCurrency(
                          averageCompetitorPrice - averageProductionCost
                        )}
                      </p>
                    </div>
                    <Badge className="bg-green-500">Profit</Badge>
                  </div>
                  <Progress value={40} className="h-2 mt-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Répartition par catégorie</CardTitle>
              <CardDescription>Distribution des produits</CardDescription>
            </CardHeader>
            <CardContent>
              {categoryData.length > 0 ? (
                <div className="h-[200px] w-full">
                  <DoughnutChart data={categoryData} />
                  <ul className="mt-4 space-y-2">
                    {categoryData.map((category, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-sm"
                      >
                        <CircleDot
                          className="h-5 w-5"
                          style={{ color: category.color }}
                        />
                        {category.name} ({category.value})
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p>Aucune donnée de catégorie disponible.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 mt-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Produits les plus vendus</CardTitle>
              <CardDescription>
                Les 5 produits avec le stock le plus élevé
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topSellingProducts.length > 0 ? (
                  topSellingProducts.map((product, index) => (
                    <div key={index} className="flex items-center">
                      <div className="font-medium w-6">{index + 1}.</div>
                      <div className="ml-2 flex-1">
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {product.stock} en stock
                        </div>
                      </div>
                      <div className="font-medium">
                        {formatCurrency(product.prixDesConcurrents)}
                      </div>
                    </div>
                  ))
                ) : (
                  <p>Aucun produit disponible.</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activités récentes</CardTitle>
              <CardDescription>
                Dernières tarifications et optimisations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.slice(0, 5).map((activity, index) => (
                  <div key={index} className="flex items-center">
                    <div className="font-medium w-6">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="ml-2 flex-1">
                      <div className="font-medium">{activity.productName}</div>
                      <div className="text-sm text-muted-foreground">
                        {getActivityText(activity.type)} • {activity.date}
                      </div>
                    </div>
                    <div className="font-medium">
                      {formatCurrency(activity.price)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
