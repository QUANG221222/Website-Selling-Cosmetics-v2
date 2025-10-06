'use client';
import { useState } from 'react';

import Link from 'next/link';
import Image from 'next/image';
import React from 'react'
import NavItems from '@/components/layout/NavItems';
import SearchBar from '@/components/layout/SearchBar';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu,
  X
} from 'lucide-react';
import { Input } from '@/components/ui/input';
interface HeaderProps {
  cartItemsCount: number;
  onNavigate: (page: string) => void;
  onSearch: (query: string) => void;
  currentPage: string;
}

const Header = ({ cartItemsCount, onNavigate, onSearch, currentPage }: HeaderProps) => {
const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <header className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
           <div className="flex flex-col">  
                <div className="flex items-center justify-between">
    
                    <div className="flex justitems-center justify-between">
                        <Link href='/'>
                                <Image  
                                    src="/product0.webp"
                                    alt="Signalist" 
                                    width={90} 
                                    height={30}
                                    className="cursor-pointer mr-10"
                                />
                        </Link> 
                        <nav className="hidden md:flex items-center space-x-8 mr-10"> 
                            <NavItems/>
                        </nav>
                        <SearchBar/>
                    </div>
                       {/* Action Buttons */}
                    <div className="flex items-center space-x-4">
                        {/* Mobile Search */}
                        <Button
                            variant="ghost"
                            size="icon"
                            // onClick={() => onNavigate('search')}
                            className="md:hidden"
                        >
                        <Search className="h-5 w-5" />
                        </Button>
    
                        {/* Cart */}
                        <Button
                            variant="ghost"
                            size="icon"
                            // onClick={() => onNavigate('cart')}
                            className="relative cursor-pointer"
                        >
                        <ShoppingCart className="h-5 w-5" />
                            {cartItemsCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-brand-deep-pink text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {cartItemsCount}
                                </span>
                            )}
                        </Button>
    
                        {/* User Account */}
                        <Button
                            variant="ghost"
                            size="icon"
                            // onClick={() => onNavigate('account')}
                            className="hidden md:flex cursor-pointer"
                        >
                            <User className="h-5 w-5" />
                        </Button>
    
                        {/* Mobile Menu Toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden cursor-pointer"
                        >
                            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>
                    </div>
                </div>
            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden mt-4 border-t border-border pt-4 ">
                    <div className="space-y-4">
                    {/* Mobile Search */}
                    
                        <form  className="flex items-center space-x-2">
                            <div className="relative flex-1">
                            <Input
                                type="text"
                                placeholder="Tìm kiếm sản phẩm..."
                                className="w-full pl-10 bg-input-background border-border"
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            </div>
                        </form>

                        {/* Mobile Navigation */}
                        <nav className="space-y-2">
                            <NavItems/>
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
  )
};

export default Header
