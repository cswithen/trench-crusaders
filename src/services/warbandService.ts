import { supabase } from './supabaseClient';
import type { Warband } from '../types/Warband.js';

export const warbandService = {
    getAll: async (): Promise<Warband[]> => {
        const { data } = await supabase.from('warbands').select('*');
        return data || [];
    },
    create: async ({
        name,
        campaign_id,
        owner_id,
        faction_id = null,
        subfaction_id = null,
    }: {
        name: string;
        campaign_id: string;
        owner_id: string;
        faction_id?: string | null;
        subfaction_id?: string | null;
    }) => {
        await supabase
            .from('warbands')
            .insert([
                { name, campaign_id, owner_id, faction_id, subfaction_id },
            ]);
    },
    update: async (id: string, updates: Partial<Warband>) => {
        const { error } = await supabase
            .from('warbands')
            .update(updates)
            .eq('id', id);
        if (error) throw error;
    },
    subscribe: (onChange: (payload: unknown) => void) =>
        supabase
            .channel('warbands')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'warbands' },
                onChange
            )
            .subscribe(),
};
