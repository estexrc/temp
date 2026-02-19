'use client';

import { useAuth, User } from '../context/AuthContext';
import styles from './perfil.module.css';

const MOCK_JOBS_POSTED = [
    { id: 1, title: 'Ayuda mudanza caja fuerte', applicants: 4, status: 'Activo', price: '$50 Total' },
    { id: 2, title: 'Limpieza post-obra', applicants: 7, status: 'Activo', price: '$12,000 Total' },
    { id: 3, title: 'Recepcionista evento', applicants: 12, status: 'Completado', price: '$3,000 Total' },
];

export default function EmpleadorProfile({ user }: { user: User }) {
    const { logout } = useAuth();
    const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

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
                        <span className={styles.statValue}>18</span>
                        <span className={styles.statLabel}>Trabajos Publicados</span>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statValue}>34</span>
                        <span className={styles.statLabel}>Contrataciones</span>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statValue}>4.8</span>
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
                        {MOCK_JOBS_POSTED.map(job => (
                            <div key={job.id} className={styles.jobRow}>
                                <div className={styles.jobRowLeft}>
                                    <p className={styles.jobRowTitle}>{job.title}</p>
                                    <p className={styles.jobRowMeta}>{job.applicants} postulantes · {job.price}</p>
                                </div>
                                <span className={`${styles.statusBadge} ${job.status === 'Activo' ? styles.statusActive : styles.statusDone}`}>
                                    {job.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}
