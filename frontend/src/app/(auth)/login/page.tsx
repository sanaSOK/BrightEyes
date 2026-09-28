'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Glasses, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();

  const [email, setEmail] = useState('purchasing@optivision.com');
  const [password, setPassword] = useState('password123');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login({
      id: 'usr-9901',
      email,
      fullName: 'Sarah Jenkins',
      role: 'buyer',
      company: {
        id: 'cmp-1001',
        name: 'OptiVision Wholesale Ltd.',
        taxId: 'US-883920192',
        approvalStatus: 'approved',
        country: 'United States',
        city: 'Los Angeles',
        address: '840 Optics Boulevard',
        createdAt: new Date().toISOString(),
      },
    });
    router.push('/products');
  };

  return (
    <PageContainer className="max-w-md py-12">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8 space-y-6 shadow-2xl shadow-cyan-950/20">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-md">
            <Glasses className="h-7 w-7" />
          </div>
          <h1 className="text-xl font-bold text-slate-100">B2B Wholesale Portal Sign In</h1>
          <p className="text-xs text-slate-400">
            Access factory tier prices, custom RFQ management, and order history.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Business Email</label>
            <div className="relative">
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9 bg-slate-950 border-slate-800 text-xs"
              />
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Password</label>
            <div className="relative">
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 bg-slate-950 border-slate-800 text-xs"
              />
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full bg-cyan-600 hover:bg-cyan-500 text-xs font-semibold">
            Sign In to B2B Account
          </Button>
        </form>

        <div className="text-center text-xs text-slate-400 border-t border-slate-800/80 pt-4">
          Don&apos;t have a verified company account?{' '}
          <a href="/register" className="text-cyan-400 font-semibold hover:underline">
            Register Business
          </a>
        </div>
      </div>
    </PageContainer>
  );
}
