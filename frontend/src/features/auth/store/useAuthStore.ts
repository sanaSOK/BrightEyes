import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, CompanyApprovalStatus } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateApprovalStatus: (status: CompanyApprovalStatus) => void;
}

const mockDefaultUser: User = {
  id: 'usr-9901',
  email: 'purchasing@optivision.com',
  fullName: 'Sarah Jenkins',
  phone: '+1 (555) 019-2834',
  role: 'buyer',
  company: {
    id: 'cmp-1001',
    name: 'OptiVision Wholesale Ltd.',
    taxId: 'US-883920192',
    businessLicenseNo: 'BL-99201-OPT',
    country: 'United States',
    city: 'Los Angeles',
    address: '840 Optics Boulevard, Suite 400',
    approvalStatus: 'approved',
    createdAt: '2025-11-01T00:00:00Z',
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: mockDefaultUser,
      isAuthenticated: true,

      login: (user: User) => {
        set({ user, isAuthenticated: true });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      updateApprovalStatus: (status: CompanyApprovalStatus) => {
        const currentUser = get().user;
        if (!currentUser) return;
        set({
          user: {
            ...currentUser,
            company: {
              ...currentUser.company,
              approvalStatus: status,
            },
          },
        });
      },
    }),
    {
      name: 'b2b_optics_auth_storage',
    }
  )
);
