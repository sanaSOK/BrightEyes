import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rfqService } from '../services/rfqService';
import { CreateRfqInput } from '../types';

export function useRfqs(params?: { page?: number; limit?: number; mock_error?: string }) {
  return useQuery({
    queryKey: ['rfqs', params],
    queryFn: () => rfqService.list(params),
  });
}

export function useRfq(id: string) {
  return useQuery({
    queryKey: ['rfq', id],
    queryFn: () => rfqService.get(id),
    enabled: Boolean(id),
  });
}

export function useSubmitRfq() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateRfqInput) => rfqService.submit(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rfqs'] });
    },
  });
}
