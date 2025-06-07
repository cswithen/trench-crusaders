import { supabase } from './supabaseClient';

export type Profile = {
    id: string;
    display_name: string | null;
    email: string | null;
};

export const userService = {
    getById: async (id: string): Promise<Profile | null> => {
        const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', id)
            .single();
        return data || null;
    },
    getByIds: async (ids: string[]): Promise<Profile[]> => {
        if (!ids.length) return [];
        const { data } = await supabase
            .from('profiles')
            .select('*')
            .in('id', ids);
        return data || [];
    },
};
