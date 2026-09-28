import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CreateRfqInput } from '../types';

interface RfqDraftState {
  draft: Partial<CreateRfqInput> | null;
  setDraft: (draft: Partial<CreateRfqInput> | null) => void;
  clearDraft: () => void;
}

export const useRfqStore = create<RfqDraftState>()(
  persist(
    (set) => ({
      draft: null,
      setDraft: (draft) => set({ draft }),
      clearDraft: () => set({ draft: null }),
    }),
    {
      name: 'b2b_optics_rfq_draft_storage',
    }
  )
);

