import api from "./api";

export interface Product {
  id: string;
  name: string;
  description: string;
  prixDesConcurrents: number;
  coutDeProduction: number;
  category: string;
  type: "produit" | "service";
  desiredMargin: number;
  stock: number;
  dateLancement?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductData {
  name: string;
  description: string;
  prixDesConcurrents: number;
  coutDeProduction: number;
  category: string;
  type: "produit" | "service";
  dateLancement?: string;
  desiredMargin: number;
  stock: number;
}

export interface OptimalPriceResult {
  id: string;
  productId: string;
  productName: string;
  prixDesConcurrents: number;
  optimalPrice: number;
  potentialRevenue: number;
  margin: number;
  userId: string;
  calculatedAt: string;
}

export interface TarificationResult {
  id: string;
  productId: string;
  productName: string;
  prixDesConcurrents: number;
  tarificationPrice: number;
  potentialRevenue: number;
  margin: number;
  userId: string;
  calculatedAt: string;
  timeInMonths?: number;
}

export type TarificationMethod = "alignement" | "penetration" | "ecremage";

export const PRODUCT_CATEGORIES = [
  "Agriculture",
  "Bois",
  "Boisson",
  "Informatique",
  "Transport",
  "Telephonie",
  "Energie",
];

export const PRODUCT_TYPES = ["produit", "service"];

const productService = {
  getAllProducts: async (): Promise<Product[]> => {
    try {
      const response = await api.get("/produit/read");
      return response.data as Product[];
    } catch (error: any) {
      console.error(
        "Erreur lors de la récupération des produits:",
        error.response?.data?.message || error.message
      );
      throw new Error(
        error.response?.data?.message || "Échec de la récupération des produits"
      );
    }
  },

  getProductById: async (id: string): Promise<Product> => {
    try {
      const response = await api.get(`/produit/read/${id}`);
      return response.data as Product;
    } catch (error: any) {
      console.error(
        `Erreur lors de la récupération du produit ${id}:`,
        error.response?.data?.message || error.message
      );
      throw new Error(
        error.response?.data?.message ||
          `Échec de la récupération du produit ${id}`
      );
    }
  },

  createProduct: async (productData: CreateProductData): Promise<Product> => {
    try {
      const response = await api.post("/produit/create", {
        ...productData,
        prixDesConcurrents: Number(productData.prixDesConcurrents),
        coutDeProduction: Number(productData.coutDeProduction),
        desiredMargin: Number(productData.desiredMargin),
        stock: Number(productData.stock),
        dateLancement: productData.dateLancement || new Date().toISOString(),
      });
      return response.data as Product;
    } catch (error: any) {
      console.error(
        "Erreur lors de la création du produit:",
        error.response?.data?.message || error.message
      );
      throw new Error(
        error.response?.data?.message || "Échec de la création du produit"
      );
    }
  },

  updateProduct: async (
    id: string,
    productData: Partial<CreateProductData>
  ): Promise<Product> => {
    try {
      const response = await api.put(`/produit/update/${id}`, {
        ...productData,
        prixDesConcurrents: productData.prixDesConcurrents
          ? Number(productData.prixDesConcurrents)
          : undefined,
        coutDeProduction: productData.coutDeProduction
          ? Number(productData.coutDeProduction)
          : undefined,
        desiredMargin: productData.desiredMargin
          ? Number(productData.desiredMargin)
          : undefined,
        stock: productData.stock ? Number(productData.stock) : undefined,
      });
      return response.data as Product;
    } catch (error: any) {
      console.error(
        `Erreur lors de la mise à jour du produit ${id}:`,
        error.response?.data?.message || error.message
      );
      throw new Error(
        error.response?.data?.message ||
          `Échec de la mise à jour du produit ${id}`
      );
    }
  },

  deleteProduct: async (id: string): Promise<any> => {
    try {
      const response = await api.delete(`/produit/delete/${id}`);
      return response.data;
    } catch (error: any) {
      console.error(
        `Erreur lors de la suppression du produit ${id}:`,
        error.response?.data?.message || error.message
      );
      throw new Error(
        error.response?.data?.message ||
          `Échec de la suppression du produit ${id}`
      );
    }
  },

  calculateOptimalPrice: async (
    productId: string
  ): Promise<OptimalPriceResult> => {
    try {
      const response = await api.post(`/pricing/${productId}`);
      return response.data as OptimalPriceResult;
    } catch (error: any) {
      console.error(
        `Erreur lors du calcul du prix optimal pour ${productId}:`,
        error.response?.data?.message || error.message
      );
      throw new Error(
        error.response?.data?.message ||
          `Échec du calcul du prix optimal pour ${productId}`
      );
    }
  },

  calculateTarificationEcremage: async (
    productId: string,
    prixMax: number
  ): Promise<TarificationResult> => {
    try {
      const response = await api.post(
        `/tarification/ecremage/${prixMax}/${productId}`
      );
      return response.data as TarificationResult;
    } catch (error: any) {
      console.error(
        `Erreur lors du calcul de l'écrémage pour ${productId}:`,
        error.response?.data?.message || error.message
      );
      throw new Error(
        error.response?.data?.message ||
          `Échec du calcul de l'écrémage pour ${productId}`
      );
    }
  },

  calculateTarificationPenetration: async (
    productId: string,
    prixMin: number
  ): Promise<TarificationResult> => {
    try {
      const response = await api.post(
        `/tarification/penetration/${prixMin}/${productId}`
      );
      return response.data as TarificationResult;
    } catch (error: any) {
      console.error(
        `Erreur lors du calcul de la pénétration pour ${productId}:`,
        error.response?.data?.message || error.message
      );
      throw new Error(
        error.response?.data?.message ||
          `Échec du calcul de la pénétration pour ${productId}`
      );
    }
  },

  calculateTarificationAlignement: async (
    productId: string
  ): Promise<TarificationResult> => {
    try {
      const response = await api.post(`/tarification/alignement/${productId}`);
      return response.data as TarificationResult;
    } catch (error: any) {
      console.error(
        `Erreur lors du calcul de l'alignement pour ${productId}:`,
        error.response?.data?.message || error.message
      );
      throw new Error(
        error.response?.data?.message ||
          `Échec du calcul de l'alignement pour ${productId}`
      );
    }
  },

  calculateTimeInMonths: (launchDate: string): number => {
    if (!launchDate) return 0;
    const launch = new Date(launchDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - launch.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays / 30.44; // Approximation : 30.44 jours par mois
  },

  // Utilitaire pour formater l'affichage du temps
  formatTimeInMonths: (months: number): string => {
    if (months < 1) {
      const days = Math.round(months * 30.44);
      return `${days} jour${days > 1 ? "s" : ""}`;
    } else if (months < 12) {
      return `${months.toFixed(1)} mois`;
    } else {
      const years = Math.floor(months / 12);
      const remainingMonths = Math.round(months % 12);
      return `${years} an${years > 1 ? "s" : ""} ${
        remainingMonths > 0 ? `et ${remainingMonths} mois` : ""
      }`;
    }
  },

  getPricingHistory: async (): Promise<OptimalPriceResult[]> => {
    try {
      const response = await api.get("/pricing/history");
      return response.data as OptimalPriceResult[];
    } catch (error: any) {
      console.error(
        "Erreur lors de la récupération de l'historique des prix:",
        error.response?.data?.message || error.message
      );
      throw new Error(
        error.response?.data?.message ||
          "Échec de la récupération de l'historique des prix"
      );
    }
  },

  getTarificationHistory: async (): Promise<TarificationResult[]> => {
    try {
      const response = await api.get("/tarification/history");
      return response.data as TarificationResult[];
    } catch (error: any) {
      console.error(
        "Erreur lors de la récupération de l'historique des tarifications:",
        error.response?.data?.message || error.message
      );
      throw new Error(
        error.response?.data?.message ||
          "Échec de la récupération de l'historique des tarifications"
      );
    }
  },
};

export default productService;
