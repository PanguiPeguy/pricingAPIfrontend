import api from "./api";

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  companyName: string;
  firstName?: string;
  lastName?: string;
  profileImage?: File;
}

interface UserProfile {
  id: string;
  email: string;
  companyName: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
}

interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  companyName?: string;
  currentPassword?: string;
  newPassword?: string;
  profilePicture?: string;
}

const authService = {
  login: async (credentials: LoginCredentials): Promise<any> => {
    try {
      const response = await api.post("/auth/login", credentials);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: response.data.id,
            email: response.data.email,
            companyName: response.data.companyName,
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            profilePicture: response.data.profilePicture,
          })
        );
      }
      return response.data;
    } catch (error: any) {
      console.error(
        "Erreur lors de la connexion:",
        error.response?.data?.message || error.message
      );
      throw new Error(error.response?.data?.message || "Échec de la connexion");
    }
  },

  register: async (userData: RegisterData): Promise<any> => {
    try {
      const response = await api.post("/auth/register", {
        email: userData.email,
        password: userData.password,
        companyName: userData.companyName,
        firstName: userData.firstName,
        lastName: userData.lastName,
      });

      if (response.data) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: response.data.id,
            email: response.data.email,
            companyName: response.data.companyName,
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            profilePicture: response.data.profilePicture,
          })
        );
      }

      return response.data;
    } catch (error: any) {
      console.error(
        "Erreur lors de l'inscription:",
        error.response?.data?.message || error.message
      );
      throw new Error(
        error.response?.data?.message || "Échec de l'inscription"
      );
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser: (): UserProfile | null => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      return JSON.parse(userStr) as UserProfile;
    }
    return null;
  },

  updateProfile: async (
    userId: string,
    userData: UpdateUserData
  ): Promise<any> => {
    try {
      const userUpdate = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        companyName: userData.companyName,
        password: userData.newPassword,
      };

      const response = await api.put(`/auth/update/${userId}`, userUpdate);
      if (response.data) {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          const updatedUser = {
            ...currentUser,
            firstName: response.data.firstName || currentUser.firstName,
            lastName: response.data.lastName || currentUser.lastName,
            companyName: response.data.companyName || currentUser.companyName,
            profilePicture:
              response.data.profilePicture || currentUser.profilePicture,
            email: response.data.email || currentUser.email,
            id: response.data.id || currentUser.id,
          };
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      }
      return response.data;
    } catch (error: any) {
      console.error(
        "Erreur lors de la mise à jour du profil:",
        error.response?.data?.message || error.message
      );
      throw new Error(
        error.response?.data?.message || "Échec de la mise à jour du profil"
      );
    }
  },

  uploadProfilePicture: async (userId: string, file: File): Promise<any> => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post(
        `/auth/upload-profile-picture/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data && response.data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: response.data.user.id,
            email: response.data.user.email,
            companyName: response.data.user.companyName,
            firstName: response.data.user.firstName,
            lastName: response.data.user.lastName,
            profilePicture: response.data.user.profilePicture,
          })
        );
      }

      return response.data;
    } catch (error: any) {
      console.error(
        "Erreur lors de l'upload de la photo:",
        error.response?.data?.message || error.message
      );
      throw new Error(
        error.response?.data?.message || "Échec de l'upload de la photo"
      );
    }
  },

  deleteAccount: async (userId: string): Promise<any> => {
    try {
      const response = await api.delete(`/auth/delete/${userId}`);
      if (response.data) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
      return response.data;
    } catch (error: any) {
      console.error(
        "Erreur lors de la suppression du compte:",
        error.response?.data?.message || error.message
      );
      throw new Error(
        error.response?.data?.message || "Échec de la suppression du compte"
      );
    }
  },
};

export default authService;
