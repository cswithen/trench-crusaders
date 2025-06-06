import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { skirmishService, type Skirmish } from '../services/skirmishService';

import { useEffect } from 'react';

export function useSkirmishes(campaignId: string) {
  const queryClient = useQueryClient();
  const query = useQuery<Skirmish[]>({
    queryKey: ['skirmishes', campaignId],
    queryFn: () => skirmishService.getByCampaign(campaignId),
    enabled: !!campaignId,
  });

  // Real-time subscription for skirmishes
  useEffect(() => {
    if (!campaignId) return;
    const sub = skirmishService.subscribe(() => {
      queryClient.invalidateQueries({ queryKey: ['skirmishes', campaignId] });
    });
    return () => {
      if (sub && typeof sub.unsubscribe === 'function') sub.unsubscribe();
    };
  }, [campaignId, queryClient]);

  return query;
}

export function useCreateSkirmish() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: skirmishService.create,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['skirmishes', variables.campaign_id] });
    },
  });
}
