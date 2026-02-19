'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

export type UserRole = 'empleado' | 'empleador';

export interface User {
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
}

interface AuthContextType {
    user: User | null;
    isLoggedIn: boolean;
    login: (user: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoggedIn: false,
    login: () => { },
    logout: () => { },
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    // Restore session from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem('tempar_user');
            if (stored) setUser(JSON.parse(stored));
        } catch {
            // ignore parse errors
        }
    }, []);

    const login = (userData: User) => {
        localStorage.setItem('tempar_user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('tempar_user');
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
