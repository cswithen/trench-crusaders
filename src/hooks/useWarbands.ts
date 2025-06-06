import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { warbandService } from '../services/warbandService.js';
import type { Warband } from '../types/Warband';

export function useWarbands() {
  const queryClient = useQueryClient();
  const { data: warbands = [] } = useQuery<Warband[]>({
    queryKey: ['warbands'],
    queryFn: warbandService.getAll,
    refetchOnWindowFocus: false,
  });
  const { mutate: createWarband } = useMutation({
    mutationFn: warbandService.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['warbands'] }),
  });

  // Subscribe to realtime changes
  useEffect(() => {
    const subscription = warbandService.subscribe(() => {
      queryClient.invalidateQueries({ queryKey: ['warbands'] });
    });
    return () => {
      // Unsubscribe on cleanup
      if (subscription && typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe();
      }
    };
  }, [queryClient]);

  return { warbands, createWarband };
}

export function useUpdateWarband() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Warband> }) => warbandService.update(id, updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['warbands'] }),
  });
}
