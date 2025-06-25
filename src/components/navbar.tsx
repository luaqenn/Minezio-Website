"use client";

import Link from "next/link";
import {
  Menu,
  ShoppingCart,
  MessageSquare,
  HelpCircle,
  LifeBuoy,
  Home,
  User,
  LogOut,
  LogIn,
  Wallet,
  CoinsIcon,
  BoxIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AuthContext } from "@/lib/context/auth.context";
import { useContext } from "react";
import { useRouter, usePathname } from "next/navigation";
import { WebsiteContext } from "@/lib/context/website.context";

export function Navbar() {
  const { isAuthenticated, user, signOut } = useContext(AuthContext);
  const router = useRouter();
  const pathname = usePathname();
  const { website } = useContext(WebsiteContext);

  const getLinkClassName = (path: string) => {
    const isActive = pathname === path;
    return `relative inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-blue-500 text-white shadow-md"
        : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
    }`;
  };

  const getMobileLinkClassName = (path: string) => {
    const isActive = pathname === path;
    return `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
      isActive
        ? "bg-blue-500 text-white"
        : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
    }`;
  };

  const navigationItems = [
    { href: "/", icon: Home, label: "Anasayfa" },
    { href: "/store", icon: ShoppingCart, label: "Mağaza" },
    { href: "/forum", icon: MessageSquare, label: "Forum" },
    { href: "/help", icon: HelpCircle, label: "Yardım" },
    { href: "/support", icon: LifeBuoy, label: "Destek" },
  ];

  const userMenuItems = [
    { href: "/profile", icon: User, label: "Profilim" },
    { href: "/wallet", icon: Wallet, label: "Cüzdanım" },
    { href: "/chest", icon: BoxIcon, label: "Sandığım" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Mobile Menu Button - Sol tarafta */}
          <div className="flex items-center lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menü</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-[280px] bg-white dark:bg-gray-900 pl-2 pr-5 pt-5"
              >
                <div className="flex flex-col h-full pt-6">
                  {/* Mobile Navigation */}
                  <nav className="flex flex-col gap-2 flex-1">
                    {navigationItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={getMobileLinkClassName(item.href)}
                        >
                          <Icon className="h-5 w-5" />
                          {item.label}
                        </Link>
                      );
                    })}
                  </nav>

                  {/* Mobile User Section */}
                  <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                    {isAuthenticated ? (
                      <div className="space-y-4">
                        {/* User Info */}
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                            <img
                              src={`https://minotar.net/avatar/${
                                user?.username || "steve"
                              }/100.png`}
                              alt={user?.username || "Player"}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src =
                                  "https://minotar.net/avatar/steve/100.png";
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                              {user?.username}
                            </p>
                            <p className="flex items-center gap-1 text-sm text-green-500 dark:text-green-400">
                              <CoinsIcon className="h-4 w-4" />
                              {user?.balance} {website?.currency}
                            </p>
                          </div>
                        </div>

                        {/* User Menu Items */}
                        <div className="space-y-1">
                          {userMenuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                              <Link
                                key={item.href}
                                href={item.href}
                                className={getMobileLinkClassName(item.href)}
                              >
                                <Icon className="h-5 w-5" />
                                {item.label}
                              </Link>
                            );
                          })}
                        </div>

                        {/* Logout Button */}
                        <Button
                          onClick={signOut}
                          variant="outline"
                          size="sm"
                          className="w-full text-red-600 border-red-200 hover:bg-red-50 dark:border-red-800 dark:text-red-400"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Çıkış Yap
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-4 px-5">
                        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto mb-3 overflow-hidden">
                          <img
                            src="https://minotar.net/avatar/steve/100.png"
                            alt="Steve"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                          Misafir
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                          Tıkla Giriş Yap!
                        </p>
                        <Button
                          onClick={() => router.push("/auth/sign-in")}
                          className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                          size="sm"
                        >
                          Giriş Yap
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Center Navigation - Desktop */}
          <div className="hidden lg:flex items-center justify-center flex-1 space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={getLinkClassName(item.href)}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right Section - User & Avatar */}
          <div className="flex items-center">
            {/* Desktop User Section */}
            <div className="hidden lg:flex items-center">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative flex-shrink-0 ml-8 pr-16 z-10"
                    >
                      <div className="my-2 flex flex-col justify-center text-right py-2 pr-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {user?.username}
                          </p>
                          <p className="flex gap-3 text-sm text-green-500 dark:text-green-400">
                            <CoinsIcon /> {user?.balance} {website?.currency}
                          </p>
                        </div>
                      </div>
                      <div
                        className="absolute w-16 h-22 bg-cover bg-top bottom-0 right-0 transform scale-x-reverse"
                        style={{
                          backgroundImage: `url('${`https://minotar.net/body/${
                            user?.username || "steve"
                          }/100.png`}')`,
                        }}
                      ></div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Hesabım</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <Link href={"/profile"}>
                      <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        Profil
                      </DropdownMenuItem>
                    </Link>

                    <Link href={"/wallet"}>
                      <DropdownMenuItem>
                        <Wallet className="mr-2 h-4 w-4" />
                        Cüzdan
                      </DropdownMenuItem>
                    </Link>

                    <Link href={"/chest"}>
                      <DropdownMenuItem>
                        <BoxIcon className="mr-2 h-4 w-4" />
                        Sandığım
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={signOut}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Çıkış Yap
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  href="/auth/sign-in"
                  className="relative flex-shrink-0 ml-8 pr-16 z-10"
                >
                  <div className="my-2 flex flex-col justify-center text-right py-2 pr-4">
                    <span className="text-gray-800 font-semibold dark:text-green-300">
                      Misafir
                    </span>
                    <span className="text-sm text-gray-400 font-medium dark:text-green-300/75">
                      Tıkla Giriş Yap!
                    </span>
                  </div>
                  <div
                    className="absolute w-16 h-22 bg-cover bg-top bottom-0 right-0 transform scale-x-reverse"
                    style={{
                      backgroundImage:
                        "url('https://minotar.net/body/steve/100.png')",
                    }}
                  ></div>
                </Link>
              )}
            </div>

            {/* Mobile Avatar */}
            <div className="lg:hidden">
              {isAuthenticated ? (
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                  <img
                    src={`https://minotar.net/avatar/${
                      user?.username || "steve"
                    }/100.png`}
                    alt={user?.username || "Player"}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://minotar.net/avatar/steve/100.png";
                    }}
                  />
                </div>
              ) : (
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                  <img
                    src="https://minotar.net/avatar/steve/100.png"
                    alt="Steve"
                    className="w-full h-full object-cover"
                    onClick={() => {
                      router.push("/auth/sign-in");
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
