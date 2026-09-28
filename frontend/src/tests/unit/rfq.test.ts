import { describe, it, expect } from 'vitest';
import { useRfqStore } from '@/features/rfq/store/useRfqStore';

describe('RFQ Draft Store', () => {
  it('saves and clears draft RFQ specifications in client state', () => {
    const store = useRfqStore.getState();

    store.setDraft({
      companyName: 'Apex Eyewear Inc.',
      contactEmail: 'purchasing@apexeyewear.com',
      shippingCountry: 'Canada',
      requestType: 'quote',
      notes: 'Draft note for custom lens coating.',
    });

    expect(useRfqStore.getState().draft?.companyName).toBe('Apex Eyewear Inc.');
    expect(useRfqStore.getState().draft?.shippingCountry).toBe('Canada');

    store.clearDraft();
    expect(useRfqStore.getState().draft).toBeNull();
  });
});
