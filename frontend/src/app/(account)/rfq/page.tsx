'use client';

import React, { useState } from 'react';
import { useRfqs, RfqForm } from '@/features/rfq';
import { PageContainer } from '@/components/layout/PageContainer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { formatCurrency } from '@/lib/utils/formatters';
import { FileText, Plus, Clock, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export default function RfqPage() {
  const { data, isLoading, isError, error } = useRfqs();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const rfqs = data?.items ?? [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted':
        return <Badge variant="warning"><Clock className="mr-1 h-3 w-3" /> Submitted</Badge>;
      case 'under_review':
        return <Badge variant="secondary"><Clock className="mr-1 h-3 w-3" /> Under Factory Review</Badge>;
      case 'quoted':
        return <Badge variant="success"><CheckCircle2 className="mr-1 h-3 w-3" /> Quote Ready</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" /> Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <PageContainer
      title="Request for Quote (RFQ) Dashboard"
      description="Manage submitted wholesale quote requests, target lead times, and custom OEM manufacturing specifications."
      actionSlot={
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-cyan-600 hover:bg-cyan-500 text-xs font-semibold"
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Create New RFQ Request
        </Button>
      }
    >
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
            <span className="ml-3 text-sm text-slate-400">Loading RFQ history...</span>
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-red-800/50 bg-red-950/20 p-6 text-center">
            <p className="text-sm text-red-400">
              Failed to load RFQ records: {error instanceof Error ? error.message : 'Unknown error'}
            </p>
          </div>
        ) : rfqs.length === 0 ? (
          <div className="text-center py-12 rounded-2xl border border-dashed border-slate-800 bg-slate-900/40">
            <FileText className="mx-auto h-12 w-12 text-slate-600 mb-3" />
            <h3 className="text-base font-semibold text-slate-200">No Submitted RFQs</h3>
            <p className="mt-1 text-xs text-slate-400">
              Submit custom batch specifications to receive wholesale factory quotes.
            </p>
          </div>
        ) : (
          rfqs.map((rfq) => (
            <div
              key={rfq.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3 transition-all hover:border-slate-700"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-sm font-bold text-cyan-400">
                    {rfq.referenceNo}
                  </span>
                  {getStatusBadge(rfq.status)}
                </div>
                <span className="text-xs text-slate-400">
                  Submitted: {new Date(rfq.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Items in RFQ */}
              <div className="space-y-2">
                {rfq.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-xl bg-slate-950/60 p-3 text-xs border border-slate-800/60"
                  >
                    <div>
                      <span className="font-semibold text-slate-200 block">{item.productTitle}</span>
                      {item.variantSku && (
                        <span className="text-[11px] text-slate-400">SKU: {item.variantSku}</span>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-100 block">{item.quantity} pcs</span>
                      {item.targetUnitPrice && (
                        <span className="text-[11px] text-amber-400">
                          Target: {formatCurrency(item.targetUnitPrice)}/pc
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {rfq.notes && (
                <div className="text-xs text-slate-400 bg-slate-950/30 p-2.5 rounded-lg border border-slate-800/40">
                  <span className="font-semibold text-slate-300">Notes: </span>
                  {rfq.notes}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Submit New Wholesale RFQ"
          description="Specify target quantity, target unit price, and custom OEM manufacturing specs."
        >
          <RfqForm onSuccess={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </PageContainer>
  );
}
