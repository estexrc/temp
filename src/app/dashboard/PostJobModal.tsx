'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Job } from './page';
import styles from './PostJobModal.module.css';

interface NewJob {
    title: string;
    description: string;
    paymentType: 'hora' | 'total';
    amount: string;
    location: string;
    rawTags: string;
    urgent: boolean;
}

interface PostJobModalProps {
    onClose: () => void;
    onSubmit: (job: Job) => void;
}

export default function PostJobModal({ onClose, onSubmit }: PostJobModalProps) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState<NewJob>({
        title: '',
        description: '',
        paymentType: 'hora',
        amount: '',
        location: '',
        rawTags: '',
        urgent: false,
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const target = e.target as HTMLInputElement;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        setForm(prev => ({ ...prev, [target.name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title.trim() || !form.amount.trim() || !user) return;

        setLoading(true);

        const tags = form.rawTags
            .split(',')
            .map(t => t.trim())
            .filter(Boolean);

        try {
            const { data, error } = await supabase
                .from('jobs')
                .insert({
                    employer_id: user.id,
                    employer_name: user.name,
                    title: form.title.trim(),
                    description: form.description.trim(),
                    payment_type: form.paymentType === 'hora' ? 'hourly' : 'total',
                    amount: parseFloat(form.amount) || 0,
                    location: form.location.trim() || 'Remoto',
                    tags: tags.length ? tags : ['General'],
                    urgent: form.urgent,
                })
                .select()
                .single();

            if (error) throw error;

            if (data) {
                onSubmit(data as Job);
                onClose();
            }
        } catch (err) {
            console.error('Error creating job:', err);
            alert('Error al publicar el trabajo. Por favor intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    // Cerrar al hacer click fuera del panel
    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div className={styles.overlay} onClick={handleOverlayClick} role="dialog" aria-modal="true">
            <div className={styles.modal}>
                <span className={styles.handle} aria-hidden="true" />

                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Publicar trabajo ✍️</h2>
                    <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar formulario">
                        ×
                    </button>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    {/* Título */}
                    <div className={styles.field}>
                        <label htmlFor="title" className={styles.label}>Título del trabajo *</label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            className={styles.input}
                            placeholder="Ej: Paseador de perros para el fin de semana"
                            value={form.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Descripción */}
                    <div className={styles.field}>
                        <label htmlFor="description" className={styles.label}>Descripción</label>
                        <textarea
                            id="description"
                            name="description"
                            className={styles.textarea}
                            placeholder="Describí brevemente qué necesitás, horarios, requisitos..."
                            value={form.description}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Tipo de pago */}
                    <div className={styles.field}>
                        <span className={styles.label}>Tipo de pago</span>
                        <div className={styles.paymentGroup}>
                            <input
                                type="radio"
                                id="payHora"
                                name="paymentType"
                                value="hora"
                                className={styles.paymentOption}
                                checked={form.paymentType === 'hora'}
                                onChange={handleChange}
                            />
                            <label htmlFor="payHora" className={styles.paymentLabel}>
                                ⏱ Por hora
                            </label>

                            <input
                                type="radio"
                                id="payTotal"
                                name="paymentType"
                                value="total"
                                className={styles.paymentOption}
                                checked={form.paymentType === 'total'}
                                onChange={handleChange}
                            />
                            <label htmlFor="payTotal" className={styles.paymentLabel}>
                                💰 Total fijo
                            </label>
                        </div>
                    </div>

                    {/* Monto y Ubicación */}
                    <div className={styles.priceRow}>
                        <div className={styles.field}>
                            <label htmlFor="amount" className={styles.label}>Monto ($) *</label>
                            <input
                                id="amount"
                                name="amount"
                                type="number"
                                min="0"
                                className={styles.input}
                                placeholder="Ej: 1500"
                                value={form.amount}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="location" className={styles.label}>Ubicación</label>
                            <input
                                id="location"
                                name="location"
                                type="text"
                                className={styles.input}
                                placeholder="Ej: Palermo, CABA"
                                value={form.location}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Tags */}
                    <div className={styles.field}>
                        <label htmlFor="rawTags" className={styles.label}>Habilidades (separadas por coma)</label>
                        <input
                            id="rawTags"
                            name="rawTags"
                            type="text"
                            className={styles.input}
                            placeholder="Ej: Conducir, Fuerza física, Puntualidad"
                            value={form.rawTags}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Urgente */}
                    <label className={styles.urgentRow}>
                        <input
                            type="checkbox"
                            name="urgent"
                            className={styles.urgentCheck}
                            checked={form.urgent}
                            onChange={handleChange}
                        />
                        <span className={styles.urgentLabel}>🔥 Marcar como urgente</span>
                    </label>

                    <button type="submit" className={`${styles.submitBtn} ${loading ? styles.loading : ''}`} disabled={loading}>
                        {loading ? 'Publicando...' : 'Publicar trabajo'}
                    </button>
                </form>
            </div>
        </div>
    );
}
