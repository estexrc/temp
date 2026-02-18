import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      {/* Header */}
      <header className={styles.header}>
        <div className={`container ${styles.navContainer}`}>
          <div className={styles.logo}>
            <span>⚡️</span>
            <span>TempAr</span>
          </div>
          <nav className={styles.navLinks}>
            <a href="#como-funciona">Cómo funciona</a>
            <a href="#comunidad">Comunidad</a>
            <a href="#ranking">Ranking</a>
          </nav>
          <div className={styles.authButtons}>
            <a href="/dashboard" className="btn btn-secondary">Entrar</a>
            <button className="btn btn-primary">Registrarse</button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={`${styles.gradientBlob} ${styles.blob1}`}></div>
        <div className={`${styles.gradientBlob} ${styles.blob2}`}></div>

        <div className={styles.heroContent}>
          <span className={styles.badge}>Comunidad Beta Abierta</span>
          <h1 className={styles.title}>
            Trabajo flexible, <br />
            <span className={styles.highlight}>conexiones reales.</span>
          </h1>
          <p className={styles.subtitle}>
            Únete a la comunidad donde empleadores y talentos se encuentran para colaboraciones cortas.
            Rankea tu experiencia y construye reputación.
          </p>

          <div className={styles.actions}>
            <button className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.2rem' }}>
              Empezar ahora
            </button>
            <button className="btn btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.2rem' }}>
              Ver empleos
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="como-funciona" className={styles.features}>
        <div className={styles.grid}>
          {/* Feature 1 */}
          <div className={styles.card}>
            <div className={styles.iconBox} style={{ color: '#818cf8', background: 'rgba(129, 140, 248, 0.1)' }}>
              🚀
            </div>
            <h3 className={styles.cardTitle}>Trabajos Rápidos</h3>
            <p className={styles.cardText}>Encuentra o publica tareas de corta duración al instante. Sin procesos largos.</p>
          </div>

          {/* Feature 2 */}
          <div className={styles.card}>
            <div className={styles.iconBox} style={{ color: '#c084fc', background: 'rgba(192, 132, 252, 0.1)' }}>
              ⭐
            </div>
            <h3 className={styles.cardTitle}>Ranking de Confianza</h3>
            <p className={styles.cardText}>Califíca y sé calificado. Construye una reputación sólida para mejores oportunidades.</p>
          </div>

          {/* Feature 3 */}
          <div className={styles.card}>
            <div className={styles.iconBox} style={{ color: '#34d399', background: 'rgba(52, 211, 153, 0.1)' }}>
              🤝
            </div>
            <h3 className={styles.cardTitle}>Comunidad</h3>
            <p className={styles.cardText}>Una red que se regula sola mediante feedback honesto y colaboración constante.</p>
          </div>
        </div>
      </section>

      {/* Mobile App CTA */}
      <section className={styles.appCta}>
        <div className={styles.ctaCard}>
          <h2 className={styles.title} style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
            Llévalo contigo
          </h2>
          <p className={styles.subtitle} style={{ marginBottom: '2rem' }}>
            Compatible 100% con iOS y Android. Úsala desde tu navegador o instálala como PWA.
          </p>
          <div className={styles.downloadButtons}>
            <button className="btn btn-secondary">
              📱 Descargar para iOS
            </button>
            <button className="btn btn-secondary">
              🤖 Descargar para Android
            </button>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className="container">
          <p>© 2024 TempAr. Todos los derechos reservados.</p>
        </div>
      </footer>
    </main>
  );
}
