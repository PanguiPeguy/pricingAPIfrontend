import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, Key, Building, User, Calculator } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    firstName: "",
    lastName: "",
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProfileImage(file);

    // Créer un aperçu de l'image
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      setIsLoading(true);
      await register({
        email: formData.email,
        password: formData.password,
        companyName: formData.companyName,
        firstName: formData.firstName,
        lastName: formData.lastName,
        profileImage: profileImage,
      });
    } catch (error) {
      console.error("Erreur d'inscription:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4 dark:from-blue-900 dark:to-blue-950">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[500px] h-[500px] rounded-full bg-blue-100 blur-3xl opacity-60 dark:bg-blue-800" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-blue-200 blur-3xl opacity-60 dark:bg-blue-700" />
      </div>

      <Card className="w-full max-w-md glass-card animate-fade-in border-opacity-30">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center blue-glow">
              <Calculator size={24} className="text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Créer un compte
          </CardTitle>
          <CardDescription className="text-center">
            Rejoignez Pricing API pour optimiser vos prix
          </CardDescription>

          {/* Photo de profil */}
          <div className="flex flex-col items-center mt-4">
            <Avatar className="h-24 w-24 mb-2">
              {profilePreview ? (
                <AvatarImage src={profilePreview} alt="Profile preview" />
              ) : (
                <AvatarFallback className="text-xl bg-blue-200 dark:bg-blue-700">
                  {getInitials(formData.companyName || "P")}
                </AvatarFallback>
              )}
            </Avatar>
            <label
              htmlFor="profileImage"
              className="text-sm text-primary cursor-pointer hover:underline"
            >
              Choisir une photo de profil
            </label>
            <input
              id="profileImage"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
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
                    placeholder="email@exemple.com"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
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
                    placeholder="Votre entreprise"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

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
                      placeholder="Prénom"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Nom"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Key
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
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
                    placeholder="••••••••"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button
                className="w-full bg-blue-gradient hover:opacity-90"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Inscription en cours..." : "S'inscrire"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-center text-sm text-muted-foreground w-full">
            Vous avez déjà un compte?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Connectez-vous
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
