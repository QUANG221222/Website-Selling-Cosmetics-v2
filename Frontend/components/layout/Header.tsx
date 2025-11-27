"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import React from "react";
import NavItems from "@/components/layout/NavItems";
import SearchBar from "@/components/layout/SearchBar";
import { Button } from "@/components/ui/button";
import { Search, User, Menu, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import CartBadge from "@/components/cart/CartBadge";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/lib/redux/user/userSlice";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const currentUser = useSelector(selectCurrentUser);

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="text-2xl text-brand-deep-pink">
              Beautify
            </Link>

            {/* Navigation - Center */}
            <nav className="hidden md:flex items-center space-x-8 flex-1 justify-center mx-8">
              <NavItems />
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              {/* Cart */}
              <Link href="/cart">
                <CartBadge />
              </Link>

              {/* User Account */}
              <div className="flex items-center gap-4">
                {currentUser ? (
                  <Link href="/profile">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {currentUser.fullName?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden md:block">
                        {currentUser.fullName}
                      </span>
                    </div>
                  </Link>
                ) : (
                  <Link href="/users/login">
                    <Button variant="ghost">
                      <User className="h-5 w-5 mr-2" />
                      Đăng nhập
                    </Button>
                  </Link>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden cursor-pointer"
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 border-t border-border pt-4 ">
              <div className="space-y-4">
                {/* Mobile Navigation */}
                <nav className="space-y-2">
                  <NavItems />
                  <button
                    onClick={() => {
                      // onNavigate('account');
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 font-inter transition-colors hover:text-brand-deep-pink text-foreground cursor-pointer"
                  >
                    Tài Khoản
                  </button>
                </nav>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
