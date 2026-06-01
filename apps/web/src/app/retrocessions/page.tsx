import Link from "next/link";
import { createRetrocessionAction } from "../actions";
import { getRetrocessionsPageData } from "@/server/module-data";

export default async function RetrocessionsPage() {
  const data = await getRetrocessionsPageData();

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Plugin finance</p>
          <h1>Retrocessions</h1>
        </div>
        <Link className="button button-secondary" href="/">
          Retour dashboard
        </Link>
      </header>

      <section className="page-grid">
        {!data.databaseReady ? (
          <div className="notice">
            <strong>Plugin indisponible.</strong>
            <span>Active le plugin Retrocessions dans le catalogue puis lance les migrations.</span>
          </div>
        ) : null}

        <div className="workspace-grid">
          <article className="panel">
            <div className="panel-heading">
              <p className="panel-kicker">Flux collaborateur</p>
              <h2>Nouvelle retrocession</h2>
            </div>
            <form action={createRetrocessionAction} className="form-grid">
              <div className="field-grid">
                <div className="field">
                  <label htmlFor="direction">Sens</label>
                  <select id="direction" name="direction">
                    <option value="PAID">Versee</option>
                    <option value="RECEIVED">Recue</option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="status">Statut</label>
                  <select id="status" name="status">
                    <option value="DUE">A regler</option>
                    <option value="SETTLED">Reglee</option>
                  </select>
                </div>
              </div>
              <div className="field">
                <label htmlFor="label">Libelle</label>
                <input id="label" name="label" placeholder="Remplacement semaine 12" required />
              </div>
              <div className="field">
                <label htmlFor="counterparty">Collaborateur / remplacant</label>
                <input id="counterparty" name="counterparty" required />
              </div>
              <div className="field-grid">
                <div className="field">
                  <label htmlFor="amount">Montant EUR</label>
                  <input id="amount" name="amount" type="number" step="0.01" required />
                </div>
                <div className="field">
                  <label htmlFor="settledAt">Date de reglement</label>
                  <input id="settledAt" name="settledAt" type="date" />
                </div>
                <div className="field">
                  <label htmlFor="periodStart">Debut periode</label>
                  <input id="periodStart" name="periodStart" type="date" required />
                </div>
                <div className="field">
                  <label htmlFor="periodEnd">Fin periode</label>
                  <input id="periodEnd" name="periodEnd" type="date" required />
                </div>
              </div>
              <div className="field">
                <label htmlFor="notes">Notes</label>
                <textarea id="notes" name="notes" />
              </div>
              <button className="button button-primary" type="submit">
                Enregistrer la retrocession
              </button>
            </form>
          </article>

          <article className="panel">
            <div className="panel-heading">
              <p className="panel-kicker">Suivi</p>
              <h2>Retrocessions recentes</h2>
            </div>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Libelle</th>
                    <th>Sens</th>
                    <th>Statut</th>
                    <th>Montant</th>
                  </tr>
                </thead>
                <tbody>
                  {data.retrocessions.length === 0 ? (
                    <tr>
                      <td colSpan={4}>Aucune retrocession pour le moment.</td>
                    </tr>
                  ) : (
                    data.retrocessions.map((retrocession) => (
                      <tr key={retrocession.id}>
                        <td>
                          <strong>{retrocession.label}</strong>
                          <br />
                          <span className="muted-text">{retrocession.counterparty}</span>
                        </td>
                        <td>{retrocession.direction === "RECEIVED" ? "Recue" : "Versee"}</td>
                        <td>
                          <span className="status-pill">
                            {retrocession.status === "SETTLED" ? "Reglee" : "A regler"}
                          </span>
                        </td>
                        <td className="amount-cell">{retrocession.formattedAmount}</td>
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
