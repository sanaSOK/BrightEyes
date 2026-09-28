'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Building2, Glasses, ShieldCheck } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuthStore();

  const [companyName, setCompanyName] = useState('');
  const [taxId, setTaxId] = useState('');
  const [licenseNo, setLicenseNo] = useState('');
  const [country, setCountry] = useState('United States');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    login({
      id: `usr-${Date.now()}`,
      email,
      fullName,
      role: 'buyer',
      company: {
        id: `cmp-${Date.now()}`,
        name: companyName,
        taxId,
        businessLicenseNo: licenseNo,
        country,
        city: 'New York',
        address: 'Wholesale Plaza Suite 100',
        approvalStatus: 'pending', // Starts as pending for audit
        createdAt: new Date().toISOString(),
      },
    });

    router.push('/dashboard');
  };

  return (
    <PageContainer className="max-w-xl py-10">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8 space-y-6 shadow-2xl shadow-cyan-950/20">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-md">
            <Building2 className="h-7 w-7" />
          </div>
          <h1 className="text-xl font-bold text-slate-100">Register B2B Company Account</h1>
          <p className="text-xs text-slate-400">
            Submit your corporate tax ID and business license for factory price access approval.
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Company Name</label>
              <Input
                required
                placeholder="e.g. Apex Optics LLC"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="bg-slate-950 border-slate-800 text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Tax ID / VAT No.</label>
              <Input
                required
                placeholder="e.g. US-99201928"
                value={taxId}
                onChange={(e) => setTaxId(e.target.value)}
                className="bg-slate-950 border-slate-800 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Business License No.</label>
              <Input
                placeholder="e.g. BL-88201-NY"
                value={licenseNo}
                onChange={(e) => setLicenseNo(e.target.value)}
                className="bg-slate-950 border-slate-800 text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Country</label>
              <Input
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="bg-slate-950 border-slate-800 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Full Contact Name</label>
              <Input
                required
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="bg-slate-950 border-slate-800 text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Corporate Email</label>
              <Input
                required
                type="email"
                placeholder="purchasing@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-950 border-slate-800 text-xs"
              />
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full bg-cyan-600 hover:bg-cyan-500 text-xs font-semibold">
            <ShieldCheck className="mr-2 h-4 w-4" />
            Submit Business Registration
          </Button>
        </form>
      </div>
    </PageContainer>
  );
}
