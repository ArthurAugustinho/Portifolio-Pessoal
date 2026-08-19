import styles from './Rodape.module.css'

export function Rodape() {
  const ano = new Date().getFullYear()

  return (
    <footer className={styles.rodape}>
      <a href="mailto:arthuraugustinho35@gmail.com">arthuraugustinho35@gmail.com</a>

      <div className={styles.links}>
        <a
          href="https://github.com/ArthurAugustinho"
          className="t-label"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
        <a
          href="https://www.linkedin.com/in/arthur-augustinho-46076522b/"
          className="t-label"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>
        <span className="t-label">© {ano}</span>
      </div>
    </footer>
  )
}
