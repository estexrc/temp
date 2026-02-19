'use client';

import { useAuth } from '../context/AuthContext';
import EmpleadoProfile from './EmpleadoProfile';
import EmpleadorProfile from './EmpleadorProfile';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function PerfilPage() {
    const { user, isLoggedIn } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoggedIn) router.push('/login');
    }, [isLoggedIn, router]);

    if (!user) return null;

    return user.role === 'empleador'
        ? <EmpleadorProfile user={user} />
        : <EmpleadoProfile user={user} />;
}
