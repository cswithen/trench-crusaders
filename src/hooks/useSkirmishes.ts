import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { skirmishService, type Skirmish } from '../services/skirmishService';

export function useSkirmishes(campaignId: string) {
  return useQuery<Skirmish[]>({
    queryKey: ['skirmishes', campaignId],
    queryFn: () => skirmishService.getByCampaign(campaignId),
    enabled: !!campaignId,
  });
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
