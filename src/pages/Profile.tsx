import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { User, Key, Building, Mail, Camera, LogOut } from "lucide-react";

const Profile = () => {
  const { user, updateProfile, uploadProfilePicture, logout, deleteAccount } =
    useAuth();
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    companyName: user?.companyName || "",
    email: user?.email || "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [profilePictureUrl, setProfilePictureUrl] = useState(
    user?.profilePicture || ""
  );

  // Mettre à jour l'URL de la photo de profil quand l'utilisateur change
  useEffect(() => {
    if (user?.profilePicture) {
      setProfilePictureUrl(user.profilePicture);
    }
  }, [user?.profilePicture]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setIsProfileLoading(true);
      await updateProfile(user.id, {
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        companyName: profileForm.companyName,
      });
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été mises à jour avec succès",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le profil",
        variant: "destructive",
      });
    } finally {
      setIsProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Les mots de passe ne correspondent pas",
        description:
          "Le nouveau mot de passe et sa confirmation doivent être identiques",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsPasswordLoading(true);
      await updateProfile(user.id, {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast({
        title: "Mot de passe mis à jour",
        description: "Votre mot de passe a été modifié avec succès",
      });
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error updating password:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le mot de passe",
        variant: "destructive",
      });
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      setIsUploading(true);
      const result = await uploadProfilePicture(user.id, file);
      // Mettre à jour directement l'URL pour l'affichage immédiat
      if (result && result.profilePicture) {
        setProfilePictureUrl(result.profilePicture);
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la photo de profil",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    try {
      setIsDeleting(true);
      await deleteAccount(user.id);
    } catch (error) {
      console.error("Error deleting account:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le compte",
        variant: "destructive",
      });
      setIsDeleting(false);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <DashboardLayout title="Profil" currentPath="/profile">
      <div className="animate-fade-in">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Profil</h2>
          <p className="text-muted-foreground">
            Gérez votre profil et vos paramètres de compte
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Profile Card */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-4">
              <CardTitle>Photo de profil</CardTitle>
              <CardDescription>Modifiez votre photo de profil</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center pb-6">
              <div className="mb-6 relative">
                <Avatar className="h-32 w-32">
                  {profilePictureUrl ? (
                    <AvatarImage
                      src={profilePictureUrl}
                      alt={user?.companyName || "Profil utilisateur"}
                      onError={() => {
                        console.error("Erreur de chargement de l'image");
                        setProfilePictureUrl("");
                      }}
                    />
                  ) : null}
                  <AvatarFallback className="text-2xl">
                    {getInitials(user?.companyName)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -right-2 -bottom-2">
                  <label
                    htmlFor="picture"
                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-primary"
                  >
                    <Camera className="h-5 w-5 text-white" />
                    <input
                      type="file"
                      id="picture"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                    />
                  </label>
                </div>
              </div>

              <h3 className="text-xl font-bold">{user?.companyName}</h3>
              <p className="text-muted-foreground">{user?.email}</p>

              {user?.firstName && user?.lastName && (
                <p className="mt-2">
                  {user.firstName} {user.lastName}
                </p>
              )}
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    <LogOut className="mr-2 h-4 w-4" />
                    Se déconnecter
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Vous êtes sûr de vouloir vous déconnecter?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Vous devrez vous reconnecter pour accéder à votre compte.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={logout}>
                      Se déconnecter
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>

          {/* Settings */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Paramètres du compte</CardTitle>
              <CardDescription>
                Gérez vos informations personnelles et de sécurité
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="profile">
                <TabsList className="mb-6">
                  <TabsTrigger value="profile">Profil</TabsTrigger>
                  <TabsTrigger value="password">Mot de passe</TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                  <form onSubmit={handleProfileSubmit}>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">Prénom</Label>
                          <div className="relative">
                            <User
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                              size={18}
                            />
                            <Input
                              id="firstName"
                              name="firstName"
                              value={profileForm.firstName}
                              onChange={handleProfileChange}
                              className="pl-10"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="lastName">Nom</Label>
                          <div className="relative">
                            <User
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                              size={18}
                            />
                            <Input
                              id="lastName"
                              name="lastName"
                              value={profileForm.lastName}
                              onChange={handleProfileChange}
                              className="pl-10"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="companyName">Nom de l'entreprise</Label>
                        <div className="relative">
                          <Building
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            size={18}
                          />
                          <Input
                            id="companyName"
                            name="companyName"
                            value={profileForm.companyName}
                            onChange={handleProfileChange}
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <Mail
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            size={18}
                          />
                          <Input
                            id="email"
                            name="email"
                            value={profileForm.email}
                            onChange={handleProfileChange}
                            className="pl-10"
                            disabled
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Pour modifier votre email, veuillez contacter le
                          support
                        </p>
                      </div>

                      <div className="pt-4">
                        <Button
                          type="submit"
                          className="bg-blue-gradient"
                          disabled={isProfileLoading}
                        >
                          {isProfileLoading
                            ? "Enregistrement..."
                            : "Enregistrer les modifications"}
                        </Button>
                      </div>
                    </div>
                  </form>
                </TabsContent>

                <TabsContent value="password">
                  <form onSubmit={handlePasswordSubmit}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">
                          Mot de passe actuel
                        </Label>
                        <div className="relative">
                          <Key
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            size={18}
                          />
                          <Input
                            id="currentPassword"
                            name="currentPassword"
                            type="password"
                            value={passwordForm.currentPassword}
                            onChange={handlePasswordChange}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="newPassword">
                          Nouveau mot de passe
                        </Label>
                        <div className="relative">
                          <Key
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            size={18}
                          />
                          <Input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            value={passwordForm.newPassword}
                            onChange={handlePasswordChange}
                            className="pl-10"
                            required
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Le mot de passe doit contenir au moins 8 caractères
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">
                          Confirmer le mot de passe
                        </Label>
                        <div className="relative">
                          <Key
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            size={18}
                          />
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={passwordForm.confirmPassword}
                            onChange={handlePasswordChange}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="pt-4">
                        <Button
                          type="submit"
                          className="bg-blue-gradient"
                          disabled={isPasswordLoading}
                        >
                          {isPasswordLoading
                            ? "Mise à jour..."
                            : "Mettre à jour le mot de passe"}
                        </Button>
                      </div>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Danger Zone */}
        <Card className="mt-6 border-red-200">
          <CardHeader className="border-b border-red-200">
            <CardTitle className="text-red-600">Zone de danger</CardTitle>
            <CardDescription>
              Actions irréversibles pour votre compte
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Supprimer le compte</h4>
                <p className="text-sm text-muted-foreground">
                  Cette action est irréversible et supprimera toutes vos données
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Supprimer le compte</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Êtes-vous sûr de vouloir supprimer votre compte?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action est irréversible. Toutes vos données, y
                      compris votre profil, vos produits et vos calculs de prix,
                      seront définitivement supprimés.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      className="bg-red-500 text-white hover:bg-red-600"
                      disabled={isDeleting}
                    >
                      {isDeleting
                        ? "Suppression..."
                        : "Supprimer définitivement"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
