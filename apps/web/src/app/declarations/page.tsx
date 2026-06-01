import Link from "next/link";
import { createDeclarationPeriodAction, lockDeclarationPeriodAction } from "../actions";
import { getDeclarationsPageData } from "@/server/module-data";

function declarationStatusLabel(status: string) {
  const labels: Record<string, string> = {
    OPEN: "Ouverte",
    LOCKED: "Verrouillee",
    EXPORTED: "Exportee",
  };

  return labels[status] ?? status;
}

export default async function DeclarationsPage() {
  const data = await getDeclarationsPageData();

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Plugin declarations</p>
          <h1>Declarations</h1>
        </div>
        <Link className="button button-secondary" href="/">
          Retour dashboard
        </Link>
      </header>

      <section className="page-grid">
        {!data.databaseReady ? (
          <div className="notice">
            <strong>Plugin indisponible.</strong>
            <span>Active le plugin Declarations dans le catalogue puis lance les migrations.</span>
          </div>
        ) : null}

        <div className="workspace-grid">
          <article className="panel">
            <div className="panel-heading">
              <p className="panel-kicker">Periode</p>
              <h2>Nouvelle periode declarative</h2>
            </div>
            <form action={createDeclarationPeriodAction} className="form-grid">
              <div className="field">
                <label htmlFor="label">Libelle</label>
                <input id="label" name="label" placeholder="Trimestre 1 2026" required />
              </div>
              <div className="field-grid">
                <div className="field">
                  <label htmlFor="periodStart">Debut</label>
                  <input id="periodStart" name="periodStart" type="date" required />
                </div>
                <div className="field">
                  <label htmlFor="periodEnd">Fin</label>
                  <input id="periodEnd" name="periodEnd" type="date" required />
                </div>
              </div>
              <div className="field">
                <label htmlFor="notes">Notes</label>
                <textarea id="notes" name="notes" />
              </div>
              <button className="button button-primary" type="submit">
                Creer la periode
              </button>
            </form>
          </article>

          <article className="panel">
            <div className="panel-heading">
              <p className="panel-kicker">Synthese</p>
              <h2>Periodes</h2>
            </div>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Periode</th>
                    <th>Statut</th>
                    <th>Recettes</th>
                    <th>Charges</th>
                    <th>Retrocessions</th>
                    <th>Resultat</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.periods.length === 0 ? (
                    <tr>
                      <td colSpan={7}>Aucune periode pour le moment.</td>
                    </tr>
                  ) : (
                    data.periods.map((period) => (
                      <tr key={period.id}>
                        <td>
                          <strong>{period.label}</strong>
                          <br />
                          <span className="muted-text">
                            {period.periodStart.toLocaleDateString("fr-FR")} -{" "}
                            {period.periodEnd.toLocaleDateString("fr-FR")}
                          </span>
                        </td>
                        <td>
                          <span className="status-pill">
                            {declarationStatusLabel(period.status)}
                          </span>
                        </td>
                        <td className="amount-cell">{period.formattedIncome}</td>
                        <td className="amount-cell">{period.formattedExpenses}</td>
                        <td>
                          <span className="muted-text">Recues: {period.formattedRetrocessionReceived}</span>
                          <br />
                          <span className="muted-text">Versees: {period.formattedRetrocessionPaid}</span>
                        </td>
                        <td className="amount-cell">{period.formattedResult}</td>
                        <td>
                          {period.status === "OPEN" ? (
                            <form action={lockDeclarationPeriodAction}>
                              <input name="periodId" type="hidden" value={period.id} />
                              <button className="button button-secondary" type="submit">
                                Verrouiller
                              </button>
                            </form>
                          ) : null}
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
