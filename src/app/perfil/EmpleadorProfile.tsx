import { useState, useEffect } from 'react';
import { useAuth, User } from '../context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Job } from '../dashboard/page';
import styles from './perfil.module.css';

const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        maximumFractionDigits: 0,
    }).format(amount);
};

export default function EmpleadorProfile({ user }: { user: User }) {
    const { logout } = useAuth();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);

    const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    useEffect(() => {
        const fetchMyJobs = async () => {
            try {
                const { data, error } = await supabase
                    .from('jobs')
                    .select('*')
                    .eq('employer_id', user.id)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setJobs(data as Job[]);
            } catch (err) {
                console.error('Error fetching employer jobs:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchMyJobs();
    }, [user.id]);

    return (
        <div className={styles.page}>
            {/* Header */}
            <header className={styles.header}>
                <a href="/dashboard" className={styles.logo}>⚡️ TempAr</a>
                <button className={styles.logoutBtn} onClick={logout}>Cerrar sesión</button>
            </header>

            <main className={styles.main}>
                {/* Hero */}
                <div className={styles.hero}>
                    <div className={`${styles.avatarLarge} ${styles.empleadorAvatar}`}>
                        {initials}
                    </div>
                    <div className={styles.heroInfo}>
                        <div className={styles.nameLine}>
                            <h1 className={styles.name}>{user.name}</h1>
                            <span className={styles.verifiedBadge}>✓ Verificado</span>
                        </div>
                        <p className={styles.roleLabel}>
                            {user.company ? `${user.company} · ` : ''}{user.sector || 'Empleador'}
                        </p>
                        <div className={styles.stars}>
                            {'★★★★★'.split('').map((s, i) => (
                                <span key={i} style={{ color: i < 4 ? '#fbbf24' : '#334155' }}>{s}</span>
                            ))}
                            <span className={styles.ratingNum}>4.8</span>
                        </div>
                    </div>
                    <div className={`${styles.rolePill} ${styles.empleadorPill}`}>🧑‍💼 Empleador</div>
                </div>

                {/* Stats */}
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <span className={styles.statValue}>{jobs.length}</span>
                        <span className={styles.statLabel}>Trabajos Publicados</span>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statValue}>-</span>
                        <span className={styles.statLabel}>Hitos</span>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statValue}>{user.rating || '5.0'}</span>
                        <span className={styles.statLabel}>Calificación</span>
                    </div>
                    <div className={styles.statCard} style={{ borderColor: 'var(--primary)' }}>
                        <span className={styles.statValue}>Top 10%</span>
                        <span className={styles.statLabel}>Ranking</span>
                    </div>
                </div>

                {/* Active jobs */}
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Mis publicaciones</h2>
                        <a href="/dashboard" className={styles.sectionAction}>+ Publicar nuevo</a>
                    </div>
                    <div className={styles.jobList}>
                        {loading ? (
                            <p style={{ color: 'var(--text-secondary)', padding: '1rem' }}>Cargando tus publicaciones...</p>
                        ) : jobs.length === 0 ? (
                            <p style={{ color: 'var(--text-secondary)', padding: '1rem' }}>No has publicado ningún trabajo aún.</p>
                        ) : (
                            jobs.map(job => (
                                <div key={job.id} className={styles.jobRow}>
                                    <div className={styles.jobRowLeft}>
                                        <p className={styles.jobRowTitle}>{job.title}</p>
                                        <p className={styles.jobRowMeta}>
                                            {formatPrice(job.amount)} {job.payment_type === 'hourly' ? '/hora' : 'Total'}
                                        </p>
                                    </div>
                                    <span className={`${styles.statusBadge} ${styles.statusActive}`}>
                                        Activo
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}
