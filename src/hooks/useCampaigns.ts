import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { campaignService } from '../services/campaignService.js';
import type { Campaign } from '../types/Campaign';

export function useCampaigns() {
  const queryClient = useQueryClient();
  const { data: campaigns = [] } = useQuery<Campaign[]>({
    queryKey: ['campaigns'],
    queryFn: campaignService.getAll,
    refetchOnWindowFocus: false,
  });
  const { mutate: createCampaign } = useMutation({
    mutationFn: campaignService.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['campaigns'] }),
  });
  return { campaigns, createCampaign };
}
