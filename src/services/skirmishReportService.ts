import { supabase } from './supabaseClient';

export type SkirmishReport = {
  id: string;
  warband_id: string;
  skirmish_id: string;
  title?: string | null;
  content: string | null;
  commander_name?: string | null;
  outcome?: string | null;
  commendations?: string | null;
  casualties?: string | null;
};

export const skirmishReportService = {
  async getByWarbandAndSkirmish(warband_id: string, skirmish_id: string): Promise<SkirmishReport | null> {
    const { data, error } = await supabase
      .from('skirmish_reports')
      .select('*')
      .eq('warband_id', warband_id)
      .eq('skirmish_id', skirmish_id)
      .single();
    if (error || !data) return null;
    return data as SkirmishReport;
  },
  async upsert(report: Omit<SkirmishReport, 'id'> & { id?: string }) {
    const { data, error } = await supabase
      .from('skirmish_reports')
      .upsert([report], { onConflict: 'warband_id,skirmish_id' })
      .select();
    if (error) throw error;
    return data && data[0] as SkirmishReport;
  },
};
