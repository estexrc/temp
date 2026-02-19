'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';

export type UserRole = 'empleado' | 'empleador';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    // Empleado extras
    skills?: string[];
    hourlyRate?: string;
    bio?: string;
    // Empleador extras
    company?: string;
    sector?: string;
    rating?: number;
}

interface AuthContextType {
    user: User | null;
    supabaseUser: SupabaseUser | null;
    isLoggedIn: boolean;
    login: (redirect?: boolean) => void; // Trigger for post-login actions if needed
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    supabaseUser: null,
    isLoggedIn: false,
    login: () => { },
    logout: () => { },
    isLoading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Load user profile from Supabase
    const loadProfile = async (uid: string) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', uid)
                .single();

            if (error) {
                console.error('Error loading profile:', error);
                return;
            }

            if (data) {
                setUser({
                    id: data.id,
                    name: data.name,
                    email: supabaseUser?.email || '',
                    role: data.role as UserRole,
                    skills: data.skills || [],
                    hourlyRate: data.hourly_rate?.toString(),
                    bio: data.bio || '',
                    company: data.company || '',
                    sector: data.sector || '',
                    rating: data.rating,
                });
            }
        } catch (err) {
            console.error('Unexpected error loading profile:', err);
        }
    };

    useEffect(() => {
        // Check active session
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSupabaseUser(session?.user ?? null);
            if (session?.user) {
                await loadProfile(session.user.id);
            }
            setIsLoading(false);
        };

        getSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setSupabaseUser(session?.user ?? null);
            if (session?.user) {
                await loadProfile(session.user.id);
            } else {
                setUser(null);
            }
            setIsLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []); // Only run once on mount

    const login = (redirect = true) => {
        // Just a helper if we need manual trigger after login success
        if (redirect) router.push('/dashboard');
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setSupabaseUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, supabaseUser, isLoggedIn: !!user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
