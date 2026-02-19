'use client';

import { useAuth } from '../context/AuthContext';
import EmpleadoProfile from './EmpleadoProfile';
import EmpleadorProfile from './EmpleadorProfile';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function PerfilPage() {
    const { user, isLoggedIn, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isLoggedIn) router.push('/login');
    }, [isLoggedIn, isLoading, router]);

    if (isLoading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white' }}>Cargando perfil...</div>;
    if (!user) return null;

    return user.role === 'empleador'
        ? <EmpleadorProfile user={user} />
        : <EmpleadoProfile user={user} />;
}
