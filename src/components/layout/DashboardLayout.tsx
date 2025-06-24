import { ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
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
import {
  LogOut,
  ChevronRight,
  LayoutDashboard,
  Package,
  User,
  History,
  Calculator,
  ChevronLeft,
  Menu,
  Sun,
  Moon,
  Scale,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  path: string;
  active?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
}

const SidebarItem = ({
  icon: Icon,
  label,
  path,
  active,
  collapsed,
  onClick,
}: SidebarItemProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(path);
    if (onClick) onClick();
  };

  return (
    <li className="mb-2">
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-white",
          active ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""
        )}
        onClick={handleClick}
      >
        <Icon size={20} className={cn(collapsed ? "mx-auto" : "")} />
        {!collapsed && <span>{label}</span>}
      </Button>
    </li>
  );
};

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  currentPath: string;
}

const DashboardLayout = ({
  children,
  title,
  currentPath,
}: DashboardLayoutProps) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sidebarItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/dashboard",
    },
    {
      icon: Package,
      label: "Produits/Services",
      path: "/products",
    },
    {
      icon: Calculator,
      label: "Prédiction du Prix",
      path: "/pricing",
    },
    {
      icon: Scale,
      label: "Tarification",
      path: "/tarification",
    },
    {
      icon: BarChart3,
      label: "Comparaison",
      path: "/comparison",
    },
    {
      icon: History,
      label: "Historique",
      path: "/history",
    },
    {
      icon: User,
      label: "Profil",
      path: "/profile",
    },
  ];

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
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
    <div className="flex min-h-screen bg-background">
      {/* Sidebar - Desktop */}
      <aside
        className={cn(
          "bg-sidebar fixed left-0 top-0 z-40 hidden h-full transition-all duration-300 md:block",
          collapsed ? "" : "w-64"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          {!collapsed && (
            <div className="text-lg font-bold justify-start">Pricing API</div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="text-sidebar-foreground"
            onClick={toggleSidebar}
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </Button>
        </div>
        <nav className="p-4">
          <ul>
            {sidebarItems.map((item) => (
              <SidebarItem
                key={item.path}
                icon={item.icon}
                label={item.label}
                path={item.path}
                active={currentPath === item.path}
                collapsed={collapsed}
              />
            ))}

            {/* Bouton pour changer de thème */}
            <li className="my-2">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-white"
                )}
                onClick={toggleTheme}
              >
                {theme === "light" ? (
                  <Moon size={20} className={cn(collapsed ? "mx-auto" : "")} />
                ) : (
                  <Sun size={20} className={cn(collapsed ? "mx-auto" : "")} />
                )}
                {!collapsed && (
                  <span>
                    {theme === "light" ? "Mode sombre" : "Mode clair"}
                  </span>
                )}
              </Button>
            </li>

            <li className="mt-8">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-white"
                    )}
                  >
                    <LogOut
                      size={20}
                      className={cn(collapsed ? "mx-auto" : "")}
                    />
                    {!collapsed && <span>Déconnexion</span>}
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
            </li>
          </ul>
        </nav>
      </aside>

      {/* Mobile Menu Button */}
      <div className="fixed left-0 top-0 z-50 block md:hidden">
        <Button
          variant="ghost"
          size="icon"
          className="m-2 bg-primary text-white"
          onClick={toggleMobileMenu}
        >
          <Menu size={24} />
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={toggleMobileMenu}
        >
          <div
            className="h-full w-64 bg-sidebar animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
              <div className="text-lg font-bold text-white">Pricing API</div>
              <Button
                variant="ghost"
                size="icon"
                className="text-sidebar-foreground"
                onClick={toggleMobileMenu}
              >
                <ChevronLeft size={20} />
              </Button>
            </div>
            <nav className="p-4">
              <ul>
                {sidebarItems.map((item) => (
                  <SidebarItem
                    key={item.path}
                    icon={item.icon}
                    label={item.label}
                    path={item.path}
                    active={currentPath === item.path}
                    onClick={toggleMobileMenu}
                  />
                ))}

                {/* Bouton pour changer de thème */}
                <li className="my-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
                    onClick={() => {
                      toggleTheme();
                      toggleMobileMenu();
                    }}
                  >
                    {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
                    <span>
                      {theme === "light" ? "Mode sombre" : "Mode clair"}
                    </span>
                  </Button>
                </li>

                <li className="mt-8">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
                    onClick={logout}
                  >
                    <LogOut size={20} />
                    <span>Déconnexion</span>
                  </Button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main
        className={cn(
          "flex-1 transition-all duration-300",
          collapsed ? "ml-16" : "ml-0 md:ml-64"
        )}
      >
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur">
          <h1 className="text-xl font-semibold">{title}</h1>
          <div className="flex items-center gap-4">
            <div className="hidden text-sm md:block">
              <div className="font-medium">{user?.companyName}</div>
              <div className="text-muted-foreground">{user?.email}</div>
            </div>
            <Avatar className="h-9 w-9">
              <AvatarImage src={user?.profilePicture} />
              <AvatarFallback>{getInitials(user?.companyName)}</AvatarFallback>
            </Avatar>
          </div>
        </header>
        <div className="p-4 md:p-6">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
