import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import { toast } from "@/hooks/use-toast";

interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  updateProfile: (userId: string, userData: any) => Promise<void>;
  uploadProfilePicture: (userId: string, file: File) => Promise<void>;
  deleteAccount: (userId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = () => {
      const user = authService.getCurrentUser();
      setUser(user);
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const data = await authService.login({ email, password });
      setUser(data.user);
      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur Pricin API",
      });
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Erreur de connexion",
        description: error.response?.data?.message || "Une erreur est survenue",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any) => {
    try {
      setIsLoading(true);
      await authService.register(userData);
      toast({
        title: "Inscription réussie",
        description:
          "Votre compte a été créé avec succès. Veuillez vous connecter.",
      });
      navigate("/login");
    } catch (error: any) {
      toast({
        title: "Erreur d'inscription",
        description: error.response?.data?.message || "Une erreur est survenue",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    toast({
      title: "Déconnexion",
      description: "Vous avez été déconnecté avec succès.",
    });
    navigate("/login");
  };

  const updateProfile = async (userId: string, userData: any) => {
    try {
      setIsLoading(true);
      const updatedUser = await authService.updateProfile(userId, userData);
      setUser({ ...user, ...updatedUser });
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été mises à jour avec succès.",
      });
      return updatedUser;
    } catch (error: any) {
      toast({
        title: "Erreur de mise à jour",
        description: error.response?.data?.message || "Une erreur est survenue",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const uploadProfilePicture = async (userId: string, file: File) => {
    try {
      setIsLoading(true);
      const result = await authService.uploadProfilePicture(userId, file);

      // Vérifier que result et profilePicture existent
      if (result && result.profilePicture) {
        // Mettre à jour l'utilisateur avec la nouvelle URL de photo
        setUser((prevUser: any) => ({
          ...prevUser,
          profilePicture: result.profilePicture,
        }));

        toast({
          title: "Photo de profil mise à jour",
          description: "Votre photo de profil a été mise à jour avec succès.",
        });
      } else {
        console.error(
          "Réponse incorrecte lors de l'upload de la photo",
          result
        );
        toast({
          title: "Avertissement",
          description:
            "Photo téléchargée mais l'URL n'a pas été retournée correctement",
          variant: "warning",
        });
      }
      return result;
    } catch (error: any) {
      console.error("Error uploading profile picture:", error);
      toast({
        title: "Erreur de mise à jour",
        description: error.response?.data?.message || "Une erreur est survenue",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAccount = async (userId: string) => {
    try {
      setIsLoading(true);
      await authService.deleteAccount(userId);
      setUser(null);
      toast({
        title: "Compte supprimé",
        description: "Votre compte a été supprimé avec succès.",
      });
      navigate("/login");
    } catch (error: any) {
      toast({
        title: "Erreur de suppression",
        description: error.response?.data?.message || "Une erreur est survenue",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        uploadProfilePicture,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
