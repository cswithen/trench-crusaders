import { supabase } from './supabaseClient';
import type { Campaign } from '../types/Campaign.js';

export const campaignService = {
  getByIds: async (ids: string[]): Promise<{ data: Campaign[] }> => {
    if (!ids.length) return { data: [] };
    const { data } = await supabase.from('campaigns').select('*').in('id', ids);
    return { data: data ?? [] };
  },
  getAll: async (): Promise<Campaign[]> => {
    const { data } = await supabase.from('campaigns').select('*');
    return data ?? [];
  },
  getById: async (id: string): Promise<{ data: Campaign | null }> => {
    const { data } = await supabase.from('campaigns').select('*').eq('id', id).single();
    return { data };
  },
  create: async ({ name, description }: { name: string; description: string }) => {
    await supabase.from('campaigns').insert([{ name, description }]);
  },
  subscribe: (onChange: (payload: unknown) => void) =>
    supabase.channel('campaigns').on('postgres_changes', { event: '*', schema: 'public', table: 'campaigns' }, onChange).subscribe(),
};
