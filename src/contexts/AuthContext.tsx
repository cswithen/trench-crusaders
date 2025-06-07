import * as React from 'react';
import { supabase } from '../services/supabaseClient';
import { authService } from '../services/authService';

import type { User } from '../types/User';
import type { Session } from '@supabase/supabase-js';
import { AuthContext } from './AuthContextValue.js';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = React.useState<User | null>(null);
    const [loading, setLoading] = React.useState<boolean>(true);

    React.useEffect(() => {
        authService.getUser().then(({ data }) => {
            setUser(data.user);
            setLoading(false);
        });
        const { data } = supabase.auth.onAuthStateChange(
            (_event, session: Session | null) => {
                setUser(session?.user ?? null);
                setLoading(false);
            }
        );
        return () => data.subscription.unsubscribe();
    }, []);

    const signIn = async (email: string, password: string) => {
        await authService.signIn(email, password);
        const { data } = await authService.getUser();
        setUser(data.user);
    };

    const signUp = async (
        email: string,
        password: string,
        displayName: string
    ) => {
        await authService.signUp(email, password, displayName);
        const { data } = await authService.getUser();
        setUser(data.user);
    };

    const updateDisplayName = async (displayName: string) => {
        await authService.updateDisplayName(displayName);
        const { data } = await authService.getUser();
        setUser(data.user);
    };

    const signOut = async () => {
        await authService.signOut();
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                signIn,
                signUp,
                updateDisplayName,
                signOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
