import Link from "next/link";
import { createExportJobAction } from "../actions";
import { getExportsPageData } from "@/server/module-data";

function exportTypeLabel(type: string) {
  const labels: Record<string, string> = {
    payments_csv: "Paiements",
    invoices_csv: "Factures",
    expenses_csv: "Charges",
    retrocessions_csv: "Retrocessions",
    declaration_summary_csv: "Synthese declarative",
  };

  return labels[type] ?? type;
}

export default async function ExportsPage() {
  const data = await getExportsPageData();

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Plugin exports</p>
          <h1>Exports</h1>
        </div>
        <Link className="button button-secondary" href="/">
          Retour dashboard
        </Link>
      </header>

      <section className="page-grid">
        {!data.databaseReady ? (
          <div className="notice">
            <strong>Plugin indisponible.</strong>
            <span>Active le plugin Exports dans le catalogue puis lance les migrations.</span>
          </div>
        ) : null}

        <div className="workspace-grid">
          <article className="panel">
            <div className="panel-heading">
              <p className="panel-kicker">CSV</p>
              <h2>Nouvel export</h2>
            </div>
            <form action={createExportJobAction} className="form-grid">
              <div className="field">
                <label htmlFor="type">Type</label>
                <select id="type" name="type">
                  <option value="payments_csv">Paiements</option>
                  <option value="invoices_csv">Factures</option>
                  <option value="expenses_csv">Charges</option>
                  <option value="retrocessions_csv">Retrocessions</option>
                  <option value="declaration_summary_csv">Synthese declarative</option>
                </select>
              </div>
              <div className="field-grid">
                <div className="field">
                  <label htmlFor="from">Debut</label>
                  <input id="from" name="from" type="date" required />
                </div>
                <div className="field">
                  <label htmlFor="to">Fin</label>
                  <input id="to" name="to" type="date" required />
                </div>
              </div>
              <button className="button button-primary" type="submit">
                Generer
              </button>
            </form>
          </article>

          <article className="panel">
            <div className="panel-heading">
              <p className="panel-kicker">Historique</p>
              <h2>Exports generes</h2>
            </div>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Statut</th>
                    <th>Fichier</th>
                  </tr>
                </thead>
                <tbody>
                  {data.exportJobs.length === 0 ? (
                    <tr>
                      <td colSpan={4}>Aucun export pour le moment.</td>
                    </tr>
                  ) : (
                    data.exportJobs.map((job) => (
                      <tr key={job.id}>
                        <td>{job.createdAt.toLocaleDateString("fr-FR")}</td>
                        <td>{exportTypeLabel(job.type)}</td>
                        <td>
                          <span className="status-pill">{job.status}</span>
                        </td>
                        <td>
                          <a className="button button-secondary" href={`/api/exports/${job.id}/download`}>
                            Telecharger CSV
                          </a>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
