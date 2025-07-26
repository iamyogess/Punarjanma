"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, LogOut, BookOpen, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import WidthWrapper from "@/components/WidthWrapper";
import { useAuth } from "@/contexts/auth-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
  };

  const desktopNavItems = [
    { name: "Home", href: "/", requiresAuth: false },
    { name: "Courses", href: "/courses", requiresAuth: false },
    { name: "About", href: "/about", requiresAuth: false },
    { name: "Pricing", href: "/#pricing", requiresAuth: false },
    { name: "Contact", href: "/contact", requiresAuth: false },
    { name: "Features", href: "/#features", requiresAuth: false },
    { name: "FAQ", href: "/#faq", requiresAuth: false },
  ];

  const mobileNavItems = [
    { name: "Home", href: "/", requiresAuth: false },
    { name: "Courses", href: "/courses", requiresAuth: false },
    // { name: "AI Features", href: "/ai-features", requiresAuth: false },
    { name: "About", href: "/about", requiresAuth: false },
    { name: "Pricing", href: "/#pricing", requiresAuth: false },
    { name: "Features", href: "/#features", requiresAuth: false },
    { name: "Contact", href: "/contact", requiresAuth: false },
    { name: "FAQ", href: "/#faq", requiresAuth: false },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <WidthWrapper className="h-20 flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/" className="flex items-center justify-center gap-x-2">
            <div className="h-14 w-14">
              <Image
                src="/logo.png"
                alt="E-Learning Platform Logo"
                width={400}
                height={400}
                className="h-full w-full object-cover"
              />
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block mt-3">
              Punarjanma
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {desktopNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm transition-colors font-medium ${
                  isActive
                    ? "font-semibold"
                    : "text-gray-600 "
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Desktop Auth Buttons / User Menu */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src="/placeholder-user.jpg"
                      alt="User Avatar"
                    />
                    <AvatarFallback>
                      {user.name
                        ? user.name.charAt(0).toUpperCase()
                        : user.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.name || "User"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/courses">
                    <BookOpen className="mr-2 h-4 w-4" />
                    <span>My Courses</span>
                  </Link>
                </DropdownMenuItem>
                {user && ( // Assuming admin access for any logged-in user for now
                  <DropdownMenuItem asChild>
                    <Link href="/admin">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      <span>Admin Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Register</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open main menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-4 mt-4">
                {mobileNavItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-foreground hover:text-primary px-3 py-2 rounded-md text-base font-medium transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                {user ? (
                  <>
                    <Link
                      href="/admin"
                      className="text-foreground hover:text-primary px-3 py-2 rounded-md text-base font-medium transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                    <div className="pt-4">
                      <Button onClick={handleLogout} className="w-full">
                        Log out
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="pt-4">
                      <Button asChild className="w-full">
                        <Link href="/login" onClick={() => setIsOpen(false)}>
                          Login
                        </Link>
                      </Button>
                    </div>
                    <div className="pt-2">
                      <Button
                        asChild
                        variant="outline"
                        className="w-full bg-transparent"
                      >
                        <Link href="/register" onClick={() => setIsOpen(false)}>
                          Register
                        </Link>
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </WidthWrapper>
    </nav>
  );
}
