import { supabase } from './supabaseClient';

export type Skirmish = {
  id: string;
  campaign_id: string;
  left_warband_id: string;
  right_warband_id: string;
  winner_id: string | null;
  arena_name: string | null;
  created_at: string;
};

export const skirmishService = {
  subscribe: (onChange: (payload: unknown) => void) =>
    supabase
      .channel('skirmishes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'skirmishes' },
        onChange
      )
      .subscribe(),
  getByCampaign: async (campaign_id: string): Promise<Skirmish[]> => {
    const { data } = await supabase
      .from('skirmishes')
      .select('*')
      .eq('campaign_id', campaign_id);
    return data || [];
  },
  getAll: async (): Promise<{ data: Skirmish[] }> => {
    const { data } = await supabase.from('skirmishes').select('*');
    return { data: data || [] };
  },
  create: async ({
    campaign_id,
    left_warband_id,
    right_warband_id,
    winner_id,
    arena_name,
  }: {
    campaign_id: string;
    left_warband_id: string;
    right_warband_id: string;
    winner_id: string | null;
    arena_name: string | null;
  }) => {
    const { data, error } = await supabase
      .from('skirmishes')
      .insert([
        {
          campaign_id,
          left_warband_id,
          right_warband_id,
          winner_id,
          arena_name,
        },
      ])
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  updateWinner: async (id: string, winner_id: string) => {
    const { error } = await supabase
      .from('skirmishes')
      .update({ winner_id })
      .eq('id', id);
    return { error };
  },
  delete: async (id: string) => {
    const { error } = await supabase
      .from('skirmishes')
      .delete()
      .eq('id', id);
    return { error };
  },
};
