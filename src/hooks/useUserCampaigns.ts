import { useQuery } from '@tanstack/react-query';
import { oathService } from '../services/oathService';
import { campaignService } from '../services/campaignService';
import { useAuth } from './useAuth';
import type { Campaign } from '../types/Campaign';
import type { Oath } from '../types/Oath';

export function useUserCampaigns() {
    const { user } = useAuth();
    const { data: oaths = [], isLoading: loadingOaths } = useQuery<Oath[]>({
        queryKey: ['user-oaths', user?.id],
        queryFn: async () => {
            if (!user?.id) return [];
            const { data } = await oathService.getByUser(user.id);
            return data || [];
        },
        enabled: !!user?.id,
    });
    const campaignIds = oaths.map((o) => o.campaign_id);
    const { data: campaigns = [], isLoading: loadingCampaigns } = useQuery<
        Campaign[]
    >({
        queryKey: ['user-campaigns', campaignIds],
        queryFn: async () => {
            if (!campaignIds.length) return [];
            const { data } = await campaignService.getByIds(campaignIds);
            return data || [];
        },
        enabled: !!campaignIds.length,
    });
    return { campaigns, loading: loadingOaths || loadingCampaigns };
}
