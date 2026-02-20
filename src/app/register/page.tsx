'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import styles from './register.module.css';

type Step = 'role' | 'details';
type UserRole = 'empleado' | 'empleador';

export default function RegisterPage() {
    const router = useRouter();
    const [step, setStep] = useState<Step>('role');
    const [role, setRole] = useState<UserRole | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Shared
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Empleado
    const [skills, setSkills] = useState('');
    const [hourlyRate, setHourlyRate] = useState('');
    const [bio, setBio] = useState('');

    // Empleador
    const [company, setCompany] = useState('');
    const [sector, setSector] = useState('');

    const selectRole = (r: UserRole) => {
        setRole(r);
        setStep('details');
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!role) return;
        setLoading(true);
        setError('');

        try {
            // 1. Sign up with Supabase Auth + Metadata
            // We pass details in metadata so the DB Trigger can create the profile automatically
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name,
                        role,
                        bio,
                        skills: role === 'empleado' ? skills.split(',').map(s => s.trim()).filter(Boolean) : [],
                        hourly_rate: role === 'empleado' ? (parseFloat(hourlyRate) || 0) : null,
                        company: role === 'empleador' ? company : null,
                        sector: role === 'empleador' ? sector : null,
                    }
                }
            });

            if (authError) throw authError;

            if (authData.user) {
                // The profile is now created automatically by the database trigger!
                // We just wait a brief moment and redirect
                router.push('/dashboard');
            }
        } catch (err: any) {
            setError(err.message || 'Ocurrió un error al registrarse.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.page}>
            <div className={`${styles.blob} ${styles.blob1}`} />
            <div className={`${styles.blob} ${styles.blob2}`} />

            <div className={styles.card}>
                <a href="/" className={styles.logo}>
                    <span>⚡️</span>
                    <span>TempAr</span>
                </a>

                {/* Step 1: Role Selection */}
                {step === 'role' && (
                    <div className={styles.roleStep}>
                        <h1 className={styles.title}>¿Cómo vas a usar TempAr?</h1>
                        <p className={styles.subtitle}>Elegí tu perfil para personalizar tu experiencia</p>

                        <div className={styles.roleGrid}>
                            <button className={styles.roleCard} onClick={() => selectRole('empleador')}>
                                <div className={styles.roleIcon}>🧑‍💼</div>
                                <h3 className={styles.roleTitle}>Soy Empleador</h3>
                                <p className={styles.roleDesc}>Necesito contratar personas para tareas temporales</p>
                                <div className={styles.roleArrow}>→</div>
                            </button>

                            <button className={styles.roleCard} onClick={() => selectRole('empleado')}>
                                <div className={styles.roleIcon}>👷</div>
                                <h3 className={styles.roleTitle}>Soy Empleado</h3>
                                <p className={styles.roleDesc}>Busco trabajos temporales para ganar dinero</p>
                                <div className={styles.roleArrow}>→</div>
                            </button>
                        </div>

                        <a href="/login" className={styles.loginLink}>
                            ¿Ya tenés cuenta? Ingresá
                        </a>
                    </div>
                )}

                {/* Step 2: Details Form */}
                {step === 'details' && role && (
                    <div>
                        <button className={styles.backBtn} onClick={() => setStep('role')}>
                            ← Volver
                        </button>
                        <div className={`${styles.roleBadge} ${role === 'empleador' ? styles.empleadorBadge : styles.empleadoBadge}`}>
                            {role === 'empleador' ? '🧑‍💼 Empleador' : '👷 Empleado'}
                        </div>
                        <h1 className={styles.title}>Creá tu perfil</h1>
                        <p className={styles.subtitle}>Completá tus datos para empezar</p>

                        {error && <div style={{ color: '#f87171', background: 'rgba(239,68,68,0.1)', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

                        <form className={styles.form} onSubmit={handleSubmit}>
                            <div className={styles.row}>
                                <div className={styles.field}>
                                    <label className={styles.label}>Nombre completo *</label>
                                    <input type="text" className={styles.input} placeholder="Juan García" value={name} onChange={e => setName(e.target.value)} required />
                                </div>
                            </div>

                            <div className={styles.row}>
                                <div className={styles.field}>
                                    <label className={styles.label}>Email *</label>
                                    <input type="email" className={styles.input} placeholder="tu@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
                                </div>
                                <div className={styles.field}>
                                    <label className={styles.label}>Contraseña *</label>
                                    <input type="password" className={styles.input} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
                                </div>
                            </div>

                            {/* Empleador extras */}
                            {role === 'empleador' && (
                                <>
                                    <div className={styles.row}>
                                        <div className={styles.field}>
                                            <label className={styles.label}>Empresa / Nombre comercial</label>
                                            <input type="text" className={styles.input} placeholder="Mi Empresa S.A." value={company} onChange={e => setCompany(e.target.value)} />
                                        </div>
                                        <div className={styles.field}>
                                            <label className={styles.label}>Sector</label>
                                            <input type="text" className={styles.input} placeholder="Gastronomía, Logística..." value={sector} onChange={e => setSector(e.target.value)} />
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Empleado extras */}
                            {role === 'empleado' && (
                                <>
                                    <div className={styles.field}>
                                        <label className={styles.label}>Habilidades (separadas por coma)</label>
                                        <input type="text" className={styles.input} placeholder="Conducir, Barista, Fuerza física..." value={skills} onChange={e => setSkills(e.target.value)} />
                                    </div>
                                    <div className={styles.field}>
                                        <label className={styles.label}>Tarifa por hora ($)</label>
                                        <input type="number" className={styles.input} placeholder="1500" value={hourlyRate} onChange={e => setHourlyRate(e.target.value)} />
                                    </div>
                                </>
                            )}

                            <div className={styles.field}>
                                <label className={styles.label}>Descripción breve</label>
                                <textarea
                                    className={`${styles.input} ${styles.textarea}`}
                                    placeholder={role === 'empleador' ? 'Contá qué tipo de trabajos solés publicar...' : 'Contá brevemente tu experiencia y disponibilidad...'}
                                    value={bio}
                                    onChange={e => setBio(e.target.value)}
                                />
                            </div>

                            <button type="submit" className={`${styles.submitBtn} ${loading ? styles.loading : ''}`} disabled={loading}>
                                {loading ? 'Creando cuenta...' : 'Crear cuenta y entrar'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
