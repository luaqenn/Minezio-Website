"use client";

import Link from "next/link";
import { Menu, ShoppingCart, MessageSquare, HelpCircle, LifeBuoy, Home, User, LogOut, LogIn, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { AuthContext } from "@/lib/context/auth.context";
import { useContext } from "react";
import { useRouter, usePathname } from "next/navigation";

export function Navbar() {
  const { isAuthenticated, user, signOut } = useContext(AuthContext);
  const router = useRouter();
  const pathname = usePathname();

  const getLinkClassName = (path: string) => {
    const isActive = pathname === path;
    return `group relative inline-flex items-center justify-center rounded-2xl px-6 py-3 text-sm font-semibold transition-all duration-300 ease-out ${
      isActive
        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25 scale-105"
        : "text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-white/80 hover:shadow-md hover:scale-105 backdrop-blur-sm"
    }`;
  };

  const getMobileLinkClassName = (path: string) => {
    const isActive = pathname === path;
    return `group flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-2xl transition-all duration-300 ${
      isActive 
        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg" 
        : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
    }`;
  };

  const navigationItems = [
    { href: "/", icon: Home, label: "Anasayfa" },
    { href: "/store", icon: ShoppingCart, label: "Mağaza" },
    { href: "/forum", icon: MessageSquare, label: "Forum" },
    { href: "/help", icon: HelpCircle, label: "Yardım" },
    { href: "/support/tickets", icon: LifeBuoy, label: "Destek" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo/Brand Section */}
          <div className="flex items-center space-x-2">
            
          </div>

          {/* Center Navigation - Desktop */}
          <div className="hidden lg:flex items-center space-x-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className={getLinkClassName(item.href)}>
                  <Icon className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                  {item.label}
                  {pathname === item.href && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 opacity-20 blur-xl" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Section - User & Mobile Menu */}
          <div className="flex items-center space-x-4">
            
            {/* User Section - Desktop */}
            <div className="hidden md:flex items-center">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-auto p-2 rounded-2xl hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 hover:shadow-md">
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                              <Wallet className="w-3 h-3 mr-1" />
                              {user?.balance} ₺
                            </Badge>
                          </div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {user?.username}
                          </p>
                        </div>
                        <Avatar className="w-10 h-10 ring-2 ring-blue-500/20 transition-all duration-300 hover:ring-blue-500/40">
                          <AvatarImage 
                            src={`https://minotar.net/avatar/${user?.username}/100.png`} 
                            alt={user?.username} 
                          />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                            {user?.username?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50">
                    <DropdownMenuLabel className="font-semibold text-gray-900 dark:text-gray-100">
                      Hesabım
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
                      <User className="mr-2 h-4 w-4" />
                      Profil
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
                      <Wallet className="mr-2 h-4 w-4" />
                      Cüzdan ({user?.balance} ₺)
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="cursor-pointer text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={signOut}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Çıkış Yap
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button 
                  onClick={() => router.push("/auth/sign-in")}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-6 py-2 rounded-2xl shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Giriş Yap
                </Button>
              )}
            </div>

            {/* Mobile Menu */}
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="rounded-2xl hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 hover:scale-105"
                  >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Menü</span>
                  </Button>
                </SheetTrigger>
                <SheetContent 
                  side="right" 
                  className="w-[300px] sm:w-[350px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-l border-gray-200/50 dark:border-gray-700/50"
                >
                  <div className="flex flex-col h-full">
                    
                    {/* Mobile Header */}
                    <div className="flex items-center space-x-3 pb-6 border-b border-gray-200/50 dark:border-gray-700/50">
                      
                    </div>

                    {/* Mobile Navigation */}
                    <nav className="flex flex-col gap-2 py-6 flex-1">
                      {navigationItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link key={item.href} href={item.href} className={getMobileLinkClassName(item.href)}>
                            <Icon className="h-5 w-5 transition-transform group-hover:scale-110" />
                            {item.label}
                          </Link>
                        );
                      })}
                    </nav>

                    {/* Mobile User Section */}
                    <div className="pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
                      {isAuthenticated ? (
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                            <Avatar className="w-12 h-12">
                              <AvatarImage 
                                src={`https://minotar.net/avatar/${user?.username}/100.png`} 
                                alt={user?.username} 
                              />
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                {user?.username?.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900 dark:text-gray-100">
                                {user?.username}
                              </p>
                              <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                                <Wallet className="w-3 h-3 mr-1" />
                                {user?.balance} ₺
                              </Badge>
                            </div>
                          </div>
                          <Button 
                            onClick={signOut}
                            variant="outline"
                            className="w-full rounded-2xl border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                          >
                            <LogOut className="mr-2 h-4 w-4" />
                            Çıkış Yap
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          onClick={() => router.push("/auth/sign-in")}
                          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-lg"
                        >
                          <LogIn className="mr-2 h-4 w-4" />
                          Giriş Yap
                        </Button>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}