import Link from "next/link";
import { getDashboardViewModel } from "@/server/dashboard";

export default async function HomePage() {
  const dashboard = await getDashboardViewModel();

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Cabinet paramedical</p>
          <h1>{dashboard.cabinetName}</h1>
        </div>
        <div className="topbar-actions">
          <Link className="button button-secondary" href="/plugins">
            Plugins
          </Link>
          <Link className="button button-secondary" href="/patients">
            Patients
          </Link>
          <Link className="button button-primary" href="/prestations">
            Nouvelle prestation
          </Link>
        </div>
      </header>

      <section className="page-grid">
        {!dashboard.databaseReady ? (
          <div className="notice">
            <strong>Base locale non connectee.</strong>
            <span>
              Lance PostgreSQL, les migrations et le seed pour remplir automatiquement le
              dashboard avec des donnees demo.
            </span>
          </div>
        ) : null}

        <section className="metric-grid" aria-label="Indicateurs mensuels">
          {dashboard.metrics.map((metric) => (
            <article key={metric.label} className="metric-card">
              <p>{metric.label}</p>
              <strong>{metric.value}</strong>
            </article>
          ))}
        </section>

        <div className="workspace-grid">
          <aside className="side-panel">
            <div className="panel-heading">
              <p className="panel-kicker">Navigation</p>
              <h2>Modules</h2>
            </div>
            <nav className="module-list" aria-label="Modules cabinet">
              {dashboard.modules.map((module) => (
                <Link className="module-link" href={module.href} key={module.label}>
                  <span>{module.label}</span>
                  <small>{module.status}</small>
                </Link>
              ))}
            </nav>
          </aside>

          <section className="content-stack">
            <article className="panel">
              <div className="section-header">
                <div>
                  <p className="panel-kicker">Periode: {dashboard.periodLabel}</p>
                  <h2>Tableau de bord mensuel</h2>
                </div>
                <button className="button button-secondary">Export CSV</button>
              </div>

              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Flux</th>
                      <th>Statut</th>
                      <th>Montant</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboard.rows.map((row) => (
                      <tr key={row.label}>
                        <td>{row.label}</td>
                        <td>
                          <span className="status-pill">{row.status}</span>
                        </td>
                        <td className="amount-cell">{row.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>

            <section className="split-grid">
              <article className="panel">
                <div className="panel-heading">
                  <p className="panel-kicker">Suivi</p>
                  <h2>Activite recente</h2>
                </div>
                <div className="activity-list">
                  {dashboard.activity.map((item) => (
                    <div className="activity-item" key={`${item.label}-${item.detail}`}>
                      <div>
                        <strong>{item.label}</strong>
                        <span>{item.detail}</span>
                      </div>
                      {item.amount ? <em>{item.amount}</em> : null}
                    </div>
                  ))}
                </div>
              </article>

              <article className="panel action-panel">
                <div>
                  <p className="panel-kicker">Prochaine etape</p>
                  <h2>Composer le cabinet avec les bons plugins</h2>
                </div>
                <div className="quick-actions">
                  <Link className="button button-primary" href="/plugins">
                    Gerer les plugins
                  </Link>
                  <Link className="button button-primary" href="/patients">
                    Ajouter un patient
                  </Link>
                  <Link className="button button-secondary" href="/charges">
                    Saisir une charge
                  </Link>
                  <Link className="button button-secondary" href="/prestations">
                    Configurer les actes
                  </Link>
                </div>
              </article>
            </section>
          </section>
        </div>
      </section>
    </main>
  );
}
