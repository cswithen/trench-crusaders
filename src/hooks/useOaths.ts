import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { oathService } from '../services/oathService.js';
import { useAuth } from './useAuth';
import type { Oath } from '../types/Oath';

export function useOaths(campaignId: string) {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const { data: oaths = [] } = useQuery<Oath[]>({
        queryKey: ['oaths', campaignId],
        queryFn: () => oathService.getByCampaign(campaignId),
    });
    const isPledged = !!oaths.find((o: Oath) => o.user_id === user?.id);
    const { mutate: pledge } = useMutation({
        mutationFn: () => oathService.pledge(campaignId),
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ['oaths', campaignId] }),
    });
    return { oaths, isPledged, pledge };
}
