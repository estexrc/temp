'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import styles from './login.module.css';

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        if (!email || !password) {
            setError('Por favor completá todos los campos.');
            return;
        }
        setLoading(true);

        // Simulate async auth
        await new Promise(r => setTimeout(r, 800));

        // Mock login: any credentials work, role from stored userData if exists
        const mockUser = {
            name: email.split('@')[0].replace(/[._]/g, ' '),
            email,
            role: 'empleado' as const,
        };
        login(mockUser);
        router.push('/dashboard');
    };

    return (
        <div className={styles.page}>
            {/* Background blobs */}
            <div className={`${styles.blob} ${styles.blob1}`} />
            <div className={`${styles.blob} ${styles.blob2}`} />

            <div className={styles.card}>
                {/* Logo */}
                <div className={styles.logo}>
                    <span>⚡️</span>
                    <span>TempAr</span>
                </div>

                <h1 className={styles.title}>Bienvenido de vuelta</h1>
                <p className={styles.subtitle}>Ingresá a tu cuenta para continuar</p>

                {error && <div className={styles.errorMsg}>{error}</div>}

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.field}>
                        <label htmlFor="email" className={styles.label}>Email</label>
                        <input
                            id="email"
                            type="email"
                            className={styles.input}
                            placeholder="tu@email.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="password" className={styles.label}>Contraseña</label>
                        <input
                            id="password"
                            type="password"
                            className={styles.input}
                            placeholder="••••••••"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className={`${styles.submitBtn} ${loading ? styles.loading : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Ingresando...' : 'Ingresar'}
                    </button>
                </form>

                <div className={styles.divider}>
                    <span>¿No tenés cuenta?</span>
                </div>

                <a href="/register" className={styles.registerLink}>
                    Crear cuenta gratis
                </a>
            </div>
        </div>
    );
}
