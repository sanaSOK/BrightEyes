'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Glasses,
  Search,
  ShoppingCart,
  FileText,
  User,
  ShieldCheck,
  Building2,
  Package,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { env } from '@/lib/config/env';

export interface HeaderProps {
  cartItemCount?: number;
  rfqItemCount?: number;
  userCompany?: { name: string; approved: boolean } | null;
}

export function Header({
  cartItemCount = 0,
  rfqItemCount = 0,
  userCompany = { name: 'OptiVision Wholesale Ltd.', approved: true },
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      {/* Top Banner */}
      <div className="bg-slate-900 border-b border-slate-800/60 px-4 py-1.5 text-xs text-slate-400">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="flex items-center text-cyan-400 font-medium">
              <ShieldCheck className="mr-1 h-3.5 w-3.5" />
              Verified B2B Wholesale Marketplace
            </span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:inline text-slate-400">
              Direct Factory Supply • Tiered Volume Discounts
            </span>
          </div>
          <div className="flex items-center space-x-3">
            {env.NEXT_PUBLIC_USE_MOCKS && (
              <Badge variant="warning" className="text-[10px] py-0">
                Mock API Enabled
              </Badge>
            )}
            <span className="text-slate-300">USD ($)</span>
            <span className="text-slate-400">EN</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        {/* Brand Logo */}
        <Link href="/products" className="flex items-center space-x-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-950/50 group-hover:scale-105 transition-transform">
            <Glasses className="h-6 w-6" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white group-hover:text-cyan-400 transition-colors">
              OptiTrade<span className="text-cyan-500">.b2b</span>
            </span>
            <span className="block text-[10px] font-medium uppercase tracking-widest text-slate-400">
              Optics Wholesale
            </span>
          </div>
        </Link>

        {/* Global Search Bar */}
        <form onSubmit={handleSearch} className="relative flex-1 max-w-lg hidden md:block">
          <Input
            type="text"
            placeholder="Search frames, high-index lenses, hinges, SKUs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 bg-slate-900/90 border-slate-800 text-slate-100 placeholder:text-slate-500 rounded-xl"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
        </form>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          {/* RFQ Quotes link */}
          <Link href="/rfq">
            <Button variant="ghost" size="sm" className="relative text-slate-300 hover:text-white">
              <FileText className="h-4 w-4 mr-1.5 text-amber-400" />
              <span className="hidden sm:inline">RFQs</span>
              {rfqItemCount > 0 && (
                <span className="ml-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-slate-950">
                  {rfqItemCount}
                </span>
              )}
            </Button>
          </Link>

          {/* Cart Link */}
          <Link href="/cart">
            <Button variant="outline" size="sm" className="relative border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-200">
              <ShoppingCart className="h-4 w-4 mr-1.5 text-cyan-400" />
              <span className="hidden sm:inline">Cart</span>
              {cartItemCount > 0 && (
                <span className="ml-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500 text-[10px] font-bold text-slate-950">
                  {cartItemCount}
                </span>
              )}
            </Button>
          </Link>

          {/* Orders Link */}
          <Link href="/orders">
            <Button variant="ghost" size="sm" className="hidden lg:flex text-slate-300 hover:text-white">
              <Package className="h-4 w-4 mr-1.5 text-indigo-400" />
              <span>Orders</span>
            </Button>
          </Link>

          {/* Account Profile menu */}
          {userCompany ? (
            <div className="flex items-center space-x-2 border-l border-slate-800 pl-3">
              <div className="hidden sm:block text-right">
                <span className="block text-xs font-semibold text-slate-200 truncate max-w-[120px]">
                  {userCompany.name}
                </span>
                <span className="block text-[10px] text-emerald-400 font-medium">
                  {userCompany.approved ? 'Verified Account' : 'Pending Approval'}
                </span>
              </div>
              <Link href="/dashboard">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 border border-slate-700 text-slate-300 hover:border-cyan-500 transition-colors">
                  <Building2 className="h-4 w-4" />
                </div>
              </Link>
            </div>
          ) : (
            <Link href="/login">
              <Button size="sm" variant="default" className="bg-cyan-600 hover:bg-cyan-500">
                <User className="h-4 w-4 mr-1.5" />
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
