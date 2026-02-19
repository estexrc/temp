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
        // Redirigir solo si ya no está cargando y NO hay sesión activa
        if (!isLoading && !isLoggedIn) {
            router.push('/login');
        }
    }, [isLoggedIn, isLoading, router]);

    if (isLoading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white' }}>Cargando perfil...</div>;
    }

    // Si está logueado pero no hay perfil (ej: error en DB o SQL no corrido)
    if (isLoggedIn && !user) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white', textAlign: 'center', padding: '2rem' }}>
                <h2>Lo sentimos, no pudimos cargar tu perfil 😕</h2>
                <p>Asegúrate de haber ejecutado el script SQL en Supabase.</p>
                <button onClick={() => window.location.reload()} style={{ padding: '0.5rem 1rem', background: 'var(--primary)', border: 'none', borderRadius: '0.5rem', color: 'white', cursor: 'pointer' }}>
                    Reintentar
                </button>
            </div>
        );
    }

    if (!user) return null;

    return user.role === 'empleador'
        ? <EmpleadorProfile user={user} />
        : <EmpleadoProfile user={user} />;
}
