import React from 'react';
import Link from 'next/link';
import { Glasses, ShieldCheck, Factory, Truck, HelpCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-800 bg-slate-950 text-slate-400 text-sm mt-auto">
      {/* Value Proposition Bar */}
      <div className="border-b border-slate-800/80 bg-slate-900/50 py-8 px-4">
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-lg bg-cyan-950/40 text-cyan-400 border border-cyan-800/30">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-200 text-sm">Verified Optics Suppliers</h4>
              <p className="text-xs text-slate-400 mt-0.5">Strict quality audit & ISO factory certification checks.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-lg bg-cyan-950/40 text-cyan-400 border border-cyan-800/30">
              <Factory className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-200 text-sm">Direct Factory Pricing</h4>
              <p className="text-xs text-slate-400 mt-0.5">Clear volume tier rates directly from optical manufacturers.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-lg bg-cyan-950/40 text-cyan-400 border border-cyan-800/30">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-200 text-sm">Global Express Freight</h4>
              <p className="text-xs text-slate-400 mt-0.5">Air cargo & DHL/FedEx wholesale logistics support.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-lg bg-cyan-950/40 text-cyan-400 border border-cyan-800/30">
              <HelpCircle className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-200 text-sm">RFQ & Custom OEM</h4>
              <p className="text-xs text-slate-400 mt-0.5">Custom logo laser etching, temple wire stamping, & custom acetates.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 py-12 grid grid-cols-2 md:grid-cols-5 gap-8">
        <div className="col-span-2">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-600 text-white">
              <Glasses className="h-5 w-5" />
            </div>
            <span className="text-base font-bold text-white">OptiTrade B2B</span>
          </div>
          <p className="mt-3 text-xs text-slate-400 max-w-sm leading-relaxed">
            The global B2B wholesale marketplace connecting eyeglass frame manufacturers, lens laboratories, and optical component suppliers with retail chains and distributors worldwide.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider mb-3">Categories</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/products?category_id=cat-acetate-frames" className="hover:text-cyan-400">Acetate Frames</Link></li>
            <li><Link href="/products?category_id=cat-titanium-frames" className="hover:text-cyan-400">Titanium Frames</Link></li>
            <li><Link href="/products?category_id=cat-tr90-frames" className="hover:text-cyan-400">TR90 Memory Frames</Link></li>
            <li><Link href="/products?category_id=cat-optical-lenses" className="hover:text-cyan-400">Optical Lenses</Link></li>
            <li><Link href="/products?category_id=cat-components" className="hover:text-cyan-400">OBE Hinges & Parts</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider mb-3">Buyer Services</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/rfq" className="hover:text-cyan-400">Submit RFQ</Link></li>
            <li><Link href="/orders" className="hover:text-cyan-400">Track Wholesale Orders</Link></li>
            <li><Link href="/register" className="hover:text-cyan-400">Apply for B2B Credit</Link></li>
            <li><Link href="/dashboard" className="hover:text-cyan-400">Company Account Setup</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider mb-3">Legal & Support</h4>
          <ul className="space-y-2 text-xs">
            <li><span className="hover:text-cyan-400 cursor-pointer">Quality Guarantee Policy</span></li>
            <li><span className="hover:text-cyan-400 cursor-pointer">Terms of Wholesale Trade</span></li>
            <li><span className="hover:text-cyan-400 cursor-pointer">Privacy Policy</span></li>
            <li><span className="hover:text-cyan-400 cursor-pointer">Factory Inspection Guidelines</span></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-900 bg-slate-950 py-4 px-4 text-center text-xs text-slate-400">
        © 2026 OptiTrade B2B Platform. All rights reserved. Designed for wholesale optical commerce.
      </div>
    </footer>
  );
}
