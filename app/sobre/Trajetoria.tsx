import { MapPin } from 'lucide-react'
import { Retrato } from '@/components/ui/Retrato'
import styles from './Trajetoria.module.css'

export function Trajetoria() {
  return (
    <section aria-label="Trajetória" className={styles.trajetoria}>
      <div className={styles.foto}>
        <Retrato alt="Arthur Augustinho" />
      </div>

      <div className={styles.texto}>
        <h2 className="t-h2">Trajetória</h2>
        <p className="t-lead">
          Desenvolvedor full stack com passagem por infraestrutura de redes.
        </p>

        <p>
          Comecei a programar na pandemia, fazendo projetos pequenos com colegas de classe e
          estudando por conta. Tudo mudou quando um amigo que cursava engenharia de software me
          chamou para pegar trabalhos profissionais junto com ele — ali parei de escrever código
          que só funcionava e comecei a me preocupar com arquitetura e legibilidade.
        </p>
        <p>
          Na Fábrica de Tecnologias Turing, da UniEVANGÉLICA, passei um ano e meio como
          desenvolvedor full stack. Atuei em três sistemas — Psicologia, Odontologia e Segurança
          do Campus — construindo APIs em Node.js, Django e Spring Boot, modelando banco em
          PostgreSQL e SQL Server, e implementando autenticação e controle de acesso. Foi onde
          aprendi a investigar causa raiz de bug em produção em vez de apagar incêndio.
        </p>
        <p>
          Depois passei um ano e quatro meses como analista de redes na Telgo Telecom,
          monitorando infraestrutura com Zabbix e Grafana, configurando switches e roteadores e
          atendendo clientes corporativos em incidentes críticos. Não era uma vaga de
          desenvolvimento, mas mudou como eu escrevo software: passei a pensar em latência, ponto
          de falha e no que acontece quando a rede cai no meio de uma requisição.
        </p>
        <p>
          Desde então trabalho como freelancer em aplicações web. O que quero desenvolver agora é
          a ponte entre as duas experiências — backend, containers e observabilidade de
          aplicação, melhorando assim minha capacidade de entender e solucionar problemas.
        </p>

        <dl className={styles.dados}>
          <dt className="t-label">Localização</dt>
          <dd className={styles.valor}>
            <MapPin size={16} className={styles.icone} aria-hidden="true" />
            Anápolis, Goiás — disponível para remoto
          </dd>

          <dt className="t-label">Formação</dt>
          <dd>Bacharel em Engenharia de Software, UniEVANGÉLICA</dd>

          <dt className="t-label">Disponibilidade</dt>
          <dd>Freelance e posições remotas</dd>
        </dl>
      </div>
    </section>
  )
}
