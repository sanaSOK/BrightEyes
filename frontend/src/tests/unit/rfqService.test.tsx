import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { rfqService, useRfqs, useSubmitRfq } from '@/features/rfq';
import { CreateRfqInput } from '@/features/rfq/types';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = 'QueryClientTestWrapper';
  return Wrapper;
}

describe('RFQ Layered Service & Hooks (MSW integrated)', () => {
  it('rfqService.list returns paginated RFQs from MSW handler', async () => {
    const result = await rfqService.list();
    expect(result.items.length).toBeGreaterThan(0);
    expect(result.items[0].referenceNo).toBeDefined();
    expect(result.total).toBe(result.items.length);
  });

  it('rfqService.get returns a specific RFQ by ID from MSW handler', async () => {
    const listResult = await rfqService.list();
    const firstRfq = listResult.items[0];

    const rfq = await rfqService.get(firstRfq.id);
    expect(rfq).toBeDefined();
    expect(rfq.id).toBe(firstRfq.id);
    expect(rfq.referenceNo).toBe(firstRfq.referenceNo);
  });

  it('rfqService.submit posts new RFQ payload to MSW handler', async () => {
    const newRfqPayload: CreateRfqInput = {
      companyName: 'Spectra Optics Corp',
      contactEmail: 'orders@spectraoptics.com',
      shippingCountry: 'Germany',
      requestType: 'quote',
      targetLeadTimeDays: 20,
      notes: 'Testing MSW submit endpoint',
      items: [
        {
          productId: 'prod-002',
          productTitle: 'Titanium Rimless Frame TR-50',
          quantity: 1000,
          targetUnitPrice: 22.50,
        },
      ],
    };

    const created = await rfqService.submit(newRfqPayload);
    expect(created.id).toBeDefined();
    expect(created.referenceNo).toMatch(/^RFQ-2026-/);
    expect(created.companyName).toBe('Spectra Optics Corp');
  });

  it('useRfqs hook fetches RFQ list successfully', async () => {
    const { result } = renderHook(() => useRfqs(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.items.length).toBeGreaterThan(0);
  });

  it('useSubmitRfq mutation submits and invalidates rfqs query cache', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const Wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
    Wrapper.displayName = 'QueryClientMutationTestWrapper';

    const { result: rfqsResult } = renderHook(() => useRfqs(), { wrapper: Wrapper });
    await waitFor(() => expect(rfqsResult.current.isSuccess).toBe(true));
    const initialLength = rfqsResult.current.data?.items.length ?? 0;

    const { result: submitResult } = renderHook(() => useSubmitRfq(), { wrapper: Wrapper });

    await submitResult.current.mutateAsync({
      companyName: 'Nova Vision LLC',
      contactEmail: 'info@novavision.de',
      shippingCountry: 'Germany',
      requestType: 'sample',
      items: [
        {
          productId: 'prod-003',
          productTitle: 'Polarized TAC Sun Lens',
          quantity: 50,
        },
      ],
    });

    await waitFor(() => expect(rfqsResult.current.data?.items.length).toBe(initialLength + 1));
  });

  it('handles simulated 500 server error via mock_error query parameter', async () => {
    await expect(rfqService.list({ mock_error: '500' })).rejects.toThrow();
  });
});
