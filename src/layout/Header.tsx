import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Moon,
  Sun,
  User,
  LogOut,
  Quote,
  LayoutDashboard,
  Plus,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/theme-provider";
import { Toggle } from "@/components/ui/toggle";

const Header: React.FC = () => {
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, setTheme } = useTheme();

  const navigationItems = [
    {
      path: "/",
      label: "Browse Quotes",
      icon: Quote,
      public: true,
    },
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      public: false,
    },
    {
      path: "/add-quote",
      label: "Add Quote",
      icon: Plus,
      public: false,
    },
  ];

  // กรองเมนูตาม authentication status
  const availableNavItems = navigationItems.filter(
    (item) => item.public || isAuthenticated
  );

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // เพิ่ม handler สำหรับ logout เพื่อป้องกัน navigation issues
  const handleLogout = () => {
    logout();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo and Navigation */}
        <div className="flex items-center space-x-8">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <Quote className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              QuoteHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {availableNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive(item.path) ? "default" : "ghost"}
                    size="sm"
                    className={`flex items-center space-x-2 cursor-pointer transition-all duration-200 ${
                      isActive(item.path)
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-3">
          {/* Dark Mode Toggle */}
          <Toggle
            pressed={theme === "dark"}
            onPressedChange={toggleTheme}
            aria-label="Toggle theme"
            className="cursor-pointer w-9 h-9 p-0 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-yellow-400" />
            ) : (
              <Moon className="h-5 w-5 text-gray-700" />
            )}
          </Toggle>

          {/* User Profile or Login/Signup */}
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 h-9 px-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <span className="hidden sm:inline text-sm font-medium">
                    {user.name}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center space-x-2 p-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{user.name}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {user.email}
                    </span>
                  </div>
                </div>
                <DropdownMenuSeparator />
                {/* ใช้ Link แบบปกติแทน DropdownMenuItem wrapper */}
                <DropdownMenuItem asChild>
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 cursor-pointer w-full"
                  >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center space-x-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                >
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <nav className="flex items-center justify-around p-2">
          {availableNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive(item.path) ? "default" : "ghost"}
                  size="sm"
                  className={`flex flex-col items-center space-y-1 h-auto py-2 px-3 ${
                    isActive(item.path)
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                      : ""
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs">{item.label}</span>
                </Button>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default Header;
