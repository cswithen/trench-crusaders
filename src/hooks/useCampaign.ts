import { useQuery } from '@tanstack/react-query';
import { campaignService } from '../services/campaignService';
import type { Campaign } from '../types/Campaign';

export function useCampaign(campaignId: string | undefined) {
    return useQuery<Campaign | null>({
        queryKey: ['campaign', campaignId],
        queryFn: async () => {
            if (!campaignId) return null;
            const { data } = await campaignService.getById(campaignId);
            return data;
        },
        enabled: !!campaignId,
    });
}
