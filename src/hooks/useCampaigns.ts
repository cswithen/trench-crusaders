import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { campaignService } from '../services/campaignService.js';
import type { Campaign } from '../types/Campaign';

import { useEffect } from 'react';

export function useCampaigns() {
    const queryClient = useQueryClient();
    const { data: campaigns = [] } = useQuery<Campaign[]>({
        queryKey: ['campaigns'],
        queryFn: campaignService.getAll,
        refetchOnWindowFocus: false,
    });
    const { mutate: createCampaign } = useMutation({
        mutationFn: campaignService.create,
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ['campaigns'] }),
    });

    useEffect(() => {
        const sub = campaignService.subscribe(() => {
            queryClient.invalidateQueries({ queryKey: ['campaigns'] });
        });
        return () => {
            if (sub && typeof sub.unsubscribe === 'function') sub.unsubscribe();
        };
    }, [queryClient]);

    return { campaigns, createCampaign };
}
