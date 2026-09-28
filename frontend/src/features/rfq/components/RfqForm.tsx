'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSubmitRfq } from '../hooks/useRfqs';
import { CreateRfqInput, RfqItem, RfqRequestType } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle2, FileText, Send, Sparkles } from 'lucide-react';

export interface RfqFormProps {
  initialItem?: RfqItem;
  prefill?: {
    productId?: string;
    variantId?: string;
    quantity?: number;
    requestType?: RfqRequestType;
  };
  onSuccess?: () => void;
}

export function RfqForm({ initialItem, prefill, onSuccess }: RfqFormProps) {
  const searchParams = useSearchParams();
  const submitRfqMutation = useSubmitRfq();

  // Prefill resolution (props vs URL params)
  const prefillProductId = prefill?.productId || searchParams.get('productId') || initialItem?.productId;
  const prefillVariantId = prefill?.variantId || searchParams.get('variantId') || initialItem?.variantId;
  const prefillQuantity = prefill?.quantity || Number(searchParams.get('quantity')) || initialItem?.quantity || 200;
  const prefillRequestType = (prefill?.requestType || searchParams.get('requestType') as RfqRequestType) || 'quote';

  const [companyName, setCompanyName] = useState('OptiVision Wholesale Ltd.');
  const [email, setEmail] = useState('purchasing@optivision.com');
  const [phone, setPhone] = useState('+1 (555) 019-2834');
  const [shippingCountry, setShippingCountry] = useState('United States');
  const [requestType, setRequestType] = useState<RfqRequestType>(prefillRequestType);
  const [targetLeadTime, setTargetLeadTime] = useState('14');
  const [notes, setNotes] = useState('');

  // Item info
  const [productTitle, setProductTitle] = useState(
    initialItem?.productTitle || (prefillProductId ? `Optics Stock ${prefillProductId}` : 'Custom Wholesale Optics Batch')
  );
  const [quantity, setQuantity] = useState(prefillQuantity);
  const [targetUnitPrice, setTargetUnitPrice] = useState(
    initialItem?.targetUnitPrice ? String(initialItem.targetUnitPrice) : ''
  );

  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const input: CreateRfqInput = {
      companyName,
      contactEmail: email,
      contactPhone: phone,
      shippingCountry,
      requestType,
      targetLeadTimeDays: Number(targetLeadTime) || undefined,
      notes,
      items: [
        {
          productId: prefillProductId || 'custom-item',
          productTitle,
          variantId: prefillVariantId,
          variantSku: initialItem?.variantSku || 'CUSTOM-SKU',
          quantity: Number(quantity),
          targetUnitPrice: targetUnitPrice ? Number(targetUnitPrice) : undefined,
        },
      ],
    };

    try {
      const created = await submitRfqMutation.mutateAsync(input);
      setSubmittedRef(created.referenceNo);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Failed to submit RFQ:', err);
    }
  };

  if (submittedRef) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center rounded-2xl bg-cyan-950/20 border border-cyan-800/40">
        <CheckCircle2 className="h-12 w-12 text-cyan-400 mb-3" />
        <h3 className="text-xl font-bold text-slate-100">RFQ Submitted Successfully!</h3>
        <p className="mt-1 text-sm text-slate-300">
          Quote Reference Number:{' '}
          <span className="font-mono font-bold text-cyan-300">{submittedRef}</span>
        </p>
        <p className="mt-2 text-xs text-slate-400 max-w-sm">
          Suppliers will review your spec parameters and reply to your corporate email within 24 business hours.
        </p>
        <Button
          onClick={() => setSubmittedRef(null)}
          variant="outline"
          size="sm"
          className="mt-6 border-cyan-800/40 text-cyan-300"
        >
          Submit Another Request
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center space-x-2 text-cyan-400 font-semibold text-sm">
          <FileText className="h-4 w-4" />
          <span>Request for Quote (RFQ) Form</span>
        </div>

        {/* Request Type Switcher: Quote vs Sample */}
        <div className="flex items-center rounded-lg border border-slate-800 bg-slate-900 p-0.5">
          <button
            type="button"
            onClick={() => setRequestType('quote')}
            className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors ${
              requestType === 'quote'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Bulk Price Quote
          </button>
          <button
            type="button"
            onClick={() => setRequestType('sample')}
            className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors ${
              requestType === 'sample'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sample Request
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">Company Name</label>
          <Input
            required
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="bg-slate-900 border-slate-800 text-xs"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">Contact Email</label>
          <Input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-slate-900 border-slate-800 text-xs"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">Phone / WhatsApp</label>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="bg-slate-900 border-slate-800 text-xs"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">Destination Country</label>
          <Input
            required
            value={shippingCountry}
            onChange={(e) => setShippingCountry(e.target.value)}
            className="bg-slate-900 border-slate-800 text-xs"
          />
        </div>
      </div>

      <div className="border-t border-slate-800/80 pt-3 space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
          Specs ({requestType === 'sample' ? 'Sample Evaluation' : 'Bulk Batch'})
        </span>
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">Product Title / Specs</label>
          <Input
            required
            value={productTitle}
            onChange={(e) => setProductTitle(e.target.value)}
            className="bg-slate-900 border-slate-800 text-xs"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Quantity ({requestType === 'sample' ? 'Sample Pcs' : 'Total Pcs'})
            </label>
            <Input
              required
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="bg-slate-900 border-slate-800 text-xs"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Target Unit Price ($)</label>
            <Input
              type="number"
              step="0.01"
              placeholder="e.g. 14.50"
              value={targetUnitPrice}
              onChange={(e) => setTargetUnitPrice(e.target.value)}
              className="bg-slate-900 border-slate-800 text-xs"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-300 block mb-1">Custom Notes / OEM Specs</label>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Mention custom logo laser engraving, hinge requirements, packaging, or target lead time..."
          className="w-full rounded-lg border border-slate-800 bg-slate-900 p-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>

      <Button
        type="submit"
        disabled={submitRfqMutation.isPending}
        className="w-full bg-cyan-600 hover:bg-cyan-500 text-xs font-semibold py-2.5"
      >
        <Send className="mr-2 h-4 w-4" />
        {submitRfqMutation.isPending ? 'Transmitting Request...' : 'Send Official Wholesale RFQ'}
      </Button>
    </form>
  );
}
