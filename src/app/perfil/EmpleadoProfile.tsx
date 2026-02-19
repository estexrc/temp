'use client';

import { useAuth, User } from '../context/AuthContext';
import styles from './perfil.module.css';

const MOCK_HISTORY = [
    { id: 1, title: 'Barista evento privado', employer: 'Café Start', date: 'Ene 2026', pay: '$6,000' },
    { id: 2, title: 'Mudanza departamento', employer: 'Luis R.', date: 'Dic 2025', pay: '$3,500' },
    { id: 3, title: 'Paseador de perros', employer: 'Ana G.', date: 'Nov 2025', pay: '$4,500' },
];

const SKILL_COLORS: Record<string, string> = {
    default: 'rgba(99,102,241,0.15)',
};
const getSkillColor = (idx: number) => {
    const colors = [
        'rgba(99,102,241,0.15)',   // indigo
        'rgba(16,185,129,0.12)',   // green
        'rgba(236,72,153,0.12)',   // pink
        'rgba(245,158,11,0.12)',   // amber
        'rgba(59,130,246,0.15)',   // blue
    ];
    return colors[idx % colors.length];
};

export default function EmpleadoProfile({ user }: { user: User }) {
    const { logout } = useAuth();
    const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const skills = user.skills?.length ? user.skills : ['Puntualidad', 'Trabajo en equipo', 'Responsabilidad'];

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
                    <div className={`${styles.avatarLarge} ${styles.empleadoAvatar}`}>
                        {initials}
                    </div>
                    <div className={styles.heroInfo}>
                        <div className={styles.nameLine}>
                            <h1 className={styles.name}>{user.name}</h1>
                        </div>
                        <p className={styles.roleLabel}>
                            Trabajador temporal{user.hourlyRate ? ` · $${user.hourlyRate}/hora` : ''}
                        </p>
                        <div className={styles.stars}>
                            {'★★★★★'.split('').map((s, i) => (
                                <span key={i} style={{ color: i < 5 ? '#fbbf24' : '#334155' }}>{s}</span>
                            ))}
                            <span className={styles.ratingNum}>5.0</span>
                        </div>
                    </div>
                    <div className={`${styles.rolePill} ${styles.empleadoPill}`}>👷 Empleado</div>
                </div>

                {/* Stats */}
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <span className={styles.statValue}>12</span>
                        <span className={styles.statLabel}>Trabajos completados</span>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statValue}>$14k</span>
                        <span className={styles.statLabel}>Ganancias mes</span>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statValue}>48h</span>
                        <span className={styles.statLabel}>Horas trabajadas</span>
                    </div>
                    <div className={styles.statCard} style={{ borderColor: 'var(--accent)' }}>
                        <span className={styles.statValue}>Top 5%</span>
                        <span className={styles.statLabel}>Ranking</span>
                    </div>
                </div>

                {/* Skills */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Mis habilidades</h2>
                    <div className={styles.skillCloud}>
                        {skills.map((skill, i) => (
                            <span
                                key={skill}
                                className={styles.skillTag}
                                style={{ background: getSkillColor(i) }}
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </section>

                {/* Job history */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Historial de trabajos</h2>
                    <div className={styles.jobList}>
                        {MOCK_HISTORY.map(job => (
                            <div key={job.id} className={styles.jobRow}>
                                <div className={styles.jobRowLeft}>
                                    <p className={styles.jobRowTitle}>{job.title}</p>
                                    <p className={styles.jobRowMeta}>{job.employer} · {job.date}</p>
                                </div>
                                <span className={styles.payTag}>{job.pay}</span>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}
