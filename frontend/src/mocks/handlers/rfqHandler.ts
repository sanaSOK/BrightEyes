import { http, HttpResponse, delay } from 'msw';
import { RfqDto } from '@/features/rfq/schemas/rfqSchema';

export const mockRfqsDto: RfqDto[] = [
  {
    id: 'rfq-sample-101',
    reference_no: 'RFQ-2026-8801',
    company_name: 'OptiVision Wholesale Ltd.',
    contact_email: 'purchasing@optivision.com',
    contact_phone: '+1 (555) 019-2834',
    shipping_country: 'United States',
    request_type: 'quote',
    items: [
      {
        product_id: 'prod-001',
        product_title: 'Mazzucchelli Vintage Square Acetate Frame AC-801',
        variant_sku: 'AC801-BLK-52',
        quantity: 500,
        target_unit_price: 15.00,
      },
    ],
    target_lead_time_days: 14,
    notes: 'Requesting custom laser engraving of our brand logo on temple inner side.',
    status: 'under_review',
    created_at: '2026-03-24T10:00:00Z',
  },
];

export const rfqHandlers = [
  http.get('*/rfqs', async ({ request }) => {
    const url = new URL(request.url);
    const mockError = url.searchParams.get('mock_error');

    if (mockError) {
      await delay(200);
      const status = Number(mockError) || 500;
      return HttpResponse.json({ message: `Simulated server error ${status}` }, { status });
    }

    await delay(250);

    const page = Number(url.searchParams.get('page')) || 1;
    const limit = Number(url.searchParams.get('limit')) || 10;

    const total = mockRfqsDto.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const paginatedItems = mockRfqsDto.slice(startIndex, startIndex + limit);

    return HttpResponse.json({
      items: paginatedItems,
      total,
      page,
      limit,
      total_pages: totalPages,
    });
  }),

  http.get('*/rfqs/:id', async ({ params, request }) => {
    const url = new URL(request.url);
    const mockError = url.searchParams.get('mock_error');

    if (mockError) {
      await delay(200);
      const status = Number(mockError) || 500;
      return HttpResponse.json({ message: `Simulated server error ${status}` }, { status });
    }

    await delay(200);
    const { id } = params;
    const item = mockRfqsDto.find((r) => r.id === id || r.reference_no === id);

    if (!item) {
      return HttpResponse.json({ message: 'RFQ not found' }, { status: 404 });
    }

    return HttpResponse.json(item);
  }),

  http.post('*/rfqs', async ({ request }) => {
    const url = new URL(request.url);
    const mockError = url.searchParams.get('mock_error');

    if (mockError) {
      await delay(200);
      const status = Number(mockError) || 500;
      return HttpResponse.json({ message: `Simulated server error ${status}` }, { status });
    }

    await delay(300);

    const body = (await request.json()) as Record<string, unknown>;

    const newRfq: RfqDto = {
      id: `rfq-${Date.now()}`,
      reference_no: `RFQ-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      company_name: String(body.company_name || 'Anonymous Business'),
      contact_email: String(body.contact_email || 'contact@business.com'),
      contact_phone: body.contact_phone ? String(body.contact_phone) : undefined,
      shipping_country: String(body.shipping_country || 'United States'),
      request_type: (body.request_type as 'quote' | 'sample') || 'quote',
      items: Array.isArray(body.items) ? (body.items as RfqDto['items']) : [],
      target_lead_time_days: body.target_lead_time_days ? Number(body.target_lead_time_days) : undefined,
      notes: body.notes ? String(body.notes) : undefined,
      status: 'submitted',
      created_at: new Date().toISOString(),
    };

    mockRfqsDto.unshift(newRfq);

    return HttpResponse.json(newRfq, { status: 201 });
  }),
];
