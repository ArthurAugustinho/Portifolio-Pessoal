import { MapPin } from 'lucide-react'
import { Retrato } from '@/components/ui/Retrato'
import styles from './Trajetoria.module.css'

export function Trajetoria() {
  return (
    <section aria-label="Background" className={styles.trajetoria}>
      <div className={styles.foto}>
        <Retrato alt="Portrait of Arthur Augustinho" />
      </div>

      <div className={styles.texto}>
        <h2 className="t-h2">Background</h2>
        <p className="t-lead">
          Full stack developer with a background in network infrastructure.
        </p>

        <p>
          I started programming during the pandemic, building small projects with classmates and
          studying on my own. Everything changed when a friend who was studying software
          engineering invited me to take on professional work together with him — that is when I
          stopped writing code that merely worked and started to care about architecture and
          readability.
        </p>
        <p>
          At the Fábrica de Tecnologias Turing of UniEVANGÉLICA, I spent a year and a half as a
          full stack developer. I worked on three systems — Psychology, Dentistry and Campus
          Security — building APIs in Node.js, Django and Spring Boot, modelling databases in
          PostgreSQL and SQL Server, and implementing authentication and access control. It is
          where I learned to investigate the root cause of production bugs instead of just
          firefighting.
        </p>
        <p>
          Afterwards I spent a year and four months as a network analyst at Telgo Telecom,
          monitoring infrastructure with Zabbix and Grafana, configuring switches and routers and
          supporting corporate clients during critical incidents. It was not a development role,
          but it changed how I write software: I started thinking about latency, points of
          failure and what happens when the network drops in the middle of a request.
        </p>
        <p>
          Since then I have worked as a freelancer on web applications. What I want to develop
          now is the bridge between the two experiences — backend, containers and application
          observability, thereby improving my ability to understand and solve problems.
        </p>

        <dl className={styles.dados}>
          <dt className="t-meta">Location</dt>
          <dd className={styles.valor}>
            <MapPin size={16} className={styles.icone} aria-hidden="true" />
            Brazil and Europe
          </dd>

          <dt className="t-meta">Education</dt>
          <dd>Bachelor’s degree in Software Engineering, UniEVANGÉLICA</dd>

          <dt className="t-meta">Availability</dt>
          <dd>Freelance work and remote positions</dd>
        </dl>
      </div>
    </section>
  )
}
