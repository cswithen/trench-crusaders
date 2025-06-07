import { supabase } from './supabaseClient';

export const authService = {
    signIn: (email: string, password: string) =>
        supabase.auth.signInWithPassword({ email, password }),
    signUp: async (email: string, password: string, displayName: string) => {
        const { data: whitelist, error: whitelistError } = await supabase
            .from('email_whitelist')
            .select('email')
            .eq('email', email)
            .single();
        if (whitelistError || !whitelist) {
            throw new Error('This email is not allowed to sign up.');
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { display_name: displayName } },
        });
        if (error || !data.user) throw error || new Error('No user returned');
        await supabase.from('profiles').upsert({
            id: data.user.id,
            display_name: displayName,
            email: data.user.email,
        });
        return data;
    },
    updateDisplayName: async (displayName: string) => {
        const { data, error } = await supabase.auth.updateUser({
            data: { display_name: displayName },
        });
        if (error || !data.user) throw error || new Error('No user returned');
        await supabase.from('profiles').upsert({
            id: data.user.id,
            display_name: displayName,
            email: data.user.email,
        });
        return data;
    },
    signOut: () => supabase.auth.signOut(),
    getUser: () => supabase.auth.getUser(),
};
