'use client';

import React from 'react';
import { useAuthStore, CompanyApprovalStatus } from '@/features/auth';
import { PageContainer } from '@/components/layout/PageContainer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, ShieldCheck, Clock, AlertOctagon, User } from 'lucide-react';

export default function DashboardPage() {
  const { user, updateApprovalStatus } = useAuthStore();

  if (!user) return null;

  const company = user.company;

  const getStatusBadge = (status: CompanyApprovalStatus) => {
    switch (status) {
      case 'approved':
        return (
          <Badge variant="success" className="px-3 py-1 text-xs">
            <ShieldCheck className="mr-1.5 h-3.5 w-3.5" /> Approved B2B Wholesale Buyer
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="warning" className="px-3 py-1 text-xs">
            <Clock className="mr-1.5 h-3.5 w-3.5" /> Pending Verification Review
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive" className="px-3 py-1 text-xs">
            <AlertOctagon className="mr-1.5 h-3.5 w-3.5" /> Verification Rejected
          </Badge>
        );
    }
  };

  return (
    <PageContainer
      title="Company Account Dashboard"
      description="Manage corporate verification details, tax credentials, and inspect B2B price visibility access."
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Company Profile Card */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-950/40 text-cyan-400 border border-cyan-800/40">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-100">{company.name}</h2>
                  <span className="text-xs text-slate-400">ID: {company.id}</span>
                </div>
              </div>
              <div>{getStatusBadge(company.approvalStatus)}</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="rounded-xl bg-slate-950/50 p-3.5 border border-slate-800/60">
                <span className="text-slate-400 block mb-0.5">Tax Identification Number</span>
                <span className="font-mono font-bold text-slate-200">{company.taxId}</span>
              </div>
              <div className="rounded-xl bg-slate-950/50 p-3.5 border border-slate-800/60">
                <span className="text-slate-400 block mb-0.5">Business License No.</span>
                <span className="font-mono font-bold text-slate-200">
                  {company.businessLicenseNo || 'N/A'}
                </span>
              </div>
              <div className="rounded-xl bg-slate-950/50 p-3.5 border border-slate-800/60">
                <span className="text-slate-400 block mb-0.5">Registered Location</span>
                <span className="font-bold text-slate-200">
                  {company.city}, {company.country}
                </span>
              </div>
              <div className="rounded-xl bg-slate-950/50 p-3.5 border border-slate-800/60">
                <span className="text-slate-400 block mb-0.5">Primary Contact</span>
                <span className="font-bold text-slate-200">
                  {user.fullName} ({user.email})
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Status Switcher Demo Helper */}
          <div className="rounded-2xl border border-cyan-800/30 bg-cyan-950/10 p-6 space-y-3">
            <h3 className="text-sm font-bold text-cyan-300">
              Demo Helper: Toggle Company Verification Status
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Use these buttons to instantly test how restricted wholesale pricing (&quot;approved_only&quot;) behaves across Product Cards, Details, and Catalog pages when a company account is Approved vs Pending.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                size="sm"
                onClick={() => updateApprovalStatus('approved')}
                className={`text-xs ${
                  company.approvalStatus === 'approved'
                    ? 'bg-emerald-600 hover:bg-emerald-500'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                Set Status: Approved
              </Button>

              <Button
                size="sm"
                onClick={() => updateApprovalStatus('pending')}
                className={`text-xs ${
                  company.approvalStatus === 'pending'
                    ? 'bg-amber-600 hover:bg-amber-500'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                Set Status: Pending
              </Button>

              <Button
                size="sm"
                onClick={() => updateApprovalStatus('rejected')}
                className={`text-xs ${
                  company.approvalStatus === 'rejected'
                    ? 'bg-rose-600 hover:bg-rose-500'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                Set Status: Rejected
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar Status Notice */}
        <div className="lg:col-span-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              Access Privileges
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Public Wholesale Catalog</span>
                <span className="font-bold text-emerald-400">Enabled</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Restricted Tier Pricing</span>
                <span className="font-bold text-cyan-400">
                  {company.approvalStatus === 'approved' ? 'Full Access' : 'Locked'}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Custom RFQ Submission</span>
                <span className="font-bold text-emerald-400">Enabled</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
