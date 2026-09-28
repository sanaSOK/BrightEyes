export type RfqStatus = 'submitted' | 'under_review' | 'quoted' | 'rejected';
export type RfqRequestType = 'quote' | 'sample';

export interface RfqItem {
  productId: string;
  productTitle: string;
  variantId?: string;
  variantSku?: string;
  quantity: number;
  targetUnitPrice?: number;
}

export interface RfqRequest {
  id: string;
  referenceNo: string;
  companyName: string;
  contactEmail: string;
  contactPhone?: string;
  shippingCountry: string;
  requestType: RfqRequestType;
  items: RfqItem[];
  targetLeadTimeDays?: number;
  notes?: string;
  status: RfqStatus;
  createdAt: string;
}

export interface CreateRfqInput {
  companyName: string;
  contactEmail: string;
  contactPhone?: string;
  shippingCountry: string;
  requestType?: RfqRequestType;
  items: RfqItem[];
  targetLeadTimeDays?: number;
  notes?: string;
}

export interface PaginatedRfqsResponse {
  items: RfqRequest[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
