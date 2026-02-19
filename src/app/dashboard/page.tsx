'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import styles from './dashboard.module.css';
import PostJobModal from './PostJobModal';

interface Job {
    id: number;
    title: string;
    employer: string;
    verified: boolean;
    price: string;
    type: string;
    location: string;
    time: string;
    tags: string[];
    urgent: boolean;
}

const INITIAL_JOBS: Job[] = [
    {
        id: 1,
        title: 'Ayuda mudanza caja fuerte',
        employer: 'Carlos M.',
        verified: true,
        price: '$50',
        type: 'Total',
        location: 'Palermo, CABA',
        time: 'Hace 2h',
        tags: ['Fuerza física', 'Mudanza', 'Urgente'],
        urgent: true,
    },
    {
        id: 2,
        title: 'Paseador de perros fin de semana',
        employer: 'Ana G.',
        verified: true,
        price: '$1500',
        type: '/hora',
        location: 'Recoleta, CABA',
        time: 'Hace 45min',
        tags: ['Mascotas', 'Aire libre'],
        urgent: false,
    },
    {
        id: 3,
        title: 'Barista evento privado',
        employer: 'Café Start',
        verified: false,
        price: '$2000',
        type: '/hora',
        location: 'Microcentro',
        time: 'Hace 3h',
        tags: ['Barista', 'Eventos', 'Gastronomía'],
        urgent: false,
    },
    {
        id: 4,
        title: 'Limpieza post-obra',
        employer: 'Consorcio B.',
        verified: true,
        price: '$12000',
        type: 'Total',
        location: 'Belgrano, CABA',
        time: 'Hace 5min',
        tags: ['Limpieza', 'Detalle'],
        urgent: true,
    },
];

export default function Dashboard() {
    const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState('Para ti');
    const { user } = useAuth();
    const firstName = user?.name.split(' ')[0] || 'Juan';
    const avatarInitials = user?.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'JS';

    const handleNewJob = (job: Job) => {
        setJobs(prev => [job, ...prev]);
    };

    const filters = ['Para ti', 'Urgente 🔥', 'Cerca de mí', 'Mejor pagados', 'Remoto'];

    return (
        <div className={styles.dashboard}>
            {/* Header */}
            <header className={styles.header}>
                <div className={`container ${styles.headerContent}`}>
                    <a href="/" className={styles.logo}>
                        <span>⚡️</span>
                        <span className={styles.logoText}>TempAr</span>
                    </a>

                    <div className={styles.searchBar}>
                        <svg xmlns="http://www.w3.org/2000/svg" className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <input type="text" placeholder="Buscar trabajos..." className={styles.searchInput} />
                    </div>

                    <div className={styles.userActions}>
                        <button className={`${styles.iconButton} ${styles.mobileSearchBtn}`} aria-label="Buscar">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </button>
                        <button className={styles.iconButton} aria-label="Notificaciones">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                            </svg>
                        </button>
                        <a href="/perfil" className={styles.avatar} title="Ver perfil">{avatarInitials}</a>
                    </div>
                </div>
            </header>

            <main className="container">
                {/* Welcome & Stats */}
                <section className={styles.welcome}>
                    <h1 className={styles.welcomeTitle}>Hola, {firstName} 👋</h1>
                    <p className={styles.welcomeSubtitle}>
                        {jobs.length > INITIAL_JOBS.length
                            ? `Publicaste ${jobs.length - INITIAL_JOBS.length} trabajo${jobs.length - INITIAL_JOBS.length > 1 ? 's' : ''} hoy. ¡Genial!`
                            : 'Hay 12 nuevos trabajos cerca de ti hoy.'}
                    </p>
                </section>

                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <span className={styles.statValue}>$12.5k</span>
                        <span className={styles.statLabel}>Ganancias Mes</span>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statValue}>{jobs.length}</span>
                        <span className={styles.statLabel}>Publicaciones</span>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statValue}>4.9</span>
                        <span className={styles.statLabel}>Calificación</span>
                    </div>
                    <div className={styles.statCard} style={{ borderColor: 'var(--primary)' }}>
                        <span className={styles.statValue}>Top 5%</span>
                        <span className={styles.statLabel}>Ranking</span>
                    </div>
                </div>

                {/* Filters */}
                <div className={styles.filters}>
                    {filters.map(filter => (
                        <button
                            key={filter}
                            className={`${styles.filterChip} ${activeFilter === filter ? styles.active : ''}`}
                            onClick={() => setActiveFilter(filter)}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                {/* Jobs List */}
                <div className={styles.jobsList}>
                    {jobs.map((job) => (
                        <div key={job.id} className={`${styles.jobCard} ${job.urgent ? styles.urgentCard : ''}`}>
                            <div className={styles.jobHeader}>
                                <div>
                                    <h3 className={styles.jobTitle}>
                                        {job.urgent && <span style={{ marginRight: '0.4rem' }}>🔥</span>}
                                        {job.title}
                                    </h3>
                                    <div className={styles.jobCompany}>
                                        {job.employer}
                                        {job.verified && (
                                            <span className={styles.verifiedBadge} title="Verificado">✓</span>
                                        )}
                                    </div>
                                </div>
                                <div className={styles.priceTag}>
                                    {job.price}{' '}
                                    <span style={{ fontSize: '0.7em', opacity: 0.8 }}>{job.type}</span>
                                </div>
                            </div>

                            <div className={styles.jobDetails}>
                                <div className={styles.detailItem}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                        <circle cx="12" cy="10" r="3"></circle>
                                    </svg>
                                    {job.location}
                                </div>
                                <div className={styles.detailItem}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <polyline points="12 6 12 12 16 14"></polyline>
                                    </svg>
                                    {job.time}
                                </div>
                            </div>

                            <div className={styles.tags}>
                                {job.tags.map(tag => (
                                    <span key={tag} className={styles.tag}>{tag}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* Floating Action Button */}
            <button
                className={`${styles.fab} ${isModalOpen ? styles.fabOpen : ''}`}
                onClick={() => setIsModalOpen(true)}
                aria-label="Publicar nuevo trabajo"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className={styles.fabIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
            </button>

            {/* Post Job Modal */}
            {isModalOpen && (
                <PostJobModal
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleNewJob}
                />
            )}
        </div>
    );
}
