import { supabase } from './supabaseClient';
import type { Faction, Subfaction } from '../types/Faction';

export const factionService = {
  getAll: async (): Promise<Faction[]> => {
    const { data } = await supabase.from('factions').select('*');
    return data || [];
  },
  getSubfactions: async (factionId: string): Promise<Subfaction[]> => {
    const { data } = await supabase.from('subfactions').select('*').eq('faction_id', factionId);
    return data || [];
  },
  getAllSubfactions: async (): Promise<Subfaction[]> => {
    const { data } = await supabase.from('subfactions').select('*');
    return data || [];
  },
};
