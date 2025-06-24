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
import { Mail, Key, Calculator } from "lucide-react";

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await login(credentials.email, credentials.password);
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4 dark:from-blue-900 dark:to-blue-950">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[500px] h-[500px] rounded-full bg-blue-100 blur-3xl opacity-60 dark:bg-blue-800" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-blue-200 blur-3xl opacity-60 dark:bg-blue-700" />
      </div>

      <Card className="w-full max-w-md glass-card animate-fade-in border-opacity-30">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center blue-glow">
              <Calculator size={32} className="text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Connexion
          </CardTitle>
          <CardDescription className="text-center">
            Connectez-vous à votre compte Pricing API
          </CardDescription>
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
                    value={credentials.email}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Link
                    to="/reset-password"
                    className="text-sm text-primary hover:underline"
                  >
                    Mot de passe oublié?
                  </Link>
                </div>
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
                    value={credentials.password}
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
                {isLoading ? "Connexion en cours..." : "Se connecter"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-center text-sm text-muted-foreground w-full">
            Vous n'avez pas de compte?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Inscrivez-vous
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
