export type CompanyApprovalStatus = 'pending' | 'approved' | 'rejected';
export type UserRole = 'buyer' | 'supplier' | 'admin';

export interface Company {
  id: string;
  name: string;
  taxId: string;
  businessLicenseNo?: string;
  country: string;
  city: string;
  address: string;
  approvalStatus: CompanyApprovalStatus;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  company: Company;
}
