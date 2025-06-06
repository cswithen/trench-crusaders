
import { supabase } from './supabaseClient';

export const oathService = {
  getByUser: async (userId: string) => {
    const { data } = await supabase.from('oaths').select('*').eq('user_id', userId);
    return { data };
  },
  getByCampaign: async (campaignId: string) => {
    const { data } = await supabase.from('oaths').select('*').eq('campaign_id', campaignId);
    return data || [];
  },
  pledge: async (campaignId: string) => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('Not authenticated');
    await supabase.from('oaths').insert([{ user_id: user.id, campaign_id: campaignId }]);
  },
  getUsersForOaths: async (userIds: string[]) => {
    if (!userIds.length) return { data: [] };
    const { data } = await supabase.from('users').select('*').in('id', userIds);
    return { data };
  },
};
