import Link from "next/link";
import { createServiceItemAction } from "../actions";
import { getServiceItemsPageData } from "@/server/module-data";

export default async function PrestationsPage() {
  const data = await getServiceItemsPageData();

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Referentiel cabinet</p>
          <h1>Prestations</h1>
        </div>
        <Link className="button button-secondary" href="/">
          Retour dashboard
        </Link>
      </header>

      <section className="page-grid">
        <div className="workspace-grid">
          <article className="panel">
            <div className="panel-heading">
              <p className="panel-kicker">Catalogue</p>
              <h2>Nouvelle prestation</h2>
            </div>
            <form action={createServiceItemAction} className="form-grid">
              <div className="field">
                <label htmlFor="name">Nom</label>
                <input id="name" name="name" required />
              </div>
              <div className="field-grid">
                <div className="field">
                  <label htmlFor="defaultDurationMin">Duree</label>
                  <input id="defaultDurationMin" name="defaultDurationMin" type="number" defaultValue="45" />
                </div>
                <div className="field">
                  <label htmlFor="defaultAmount">Tarif EUR</label>
                  <input id="defaultAmount" name="defaultAmount" type="number" step="0.01" required />
                </div>
              </div>
              <div className="field">
                <label htmlFor="description">Description</label>
                <textarea id="description" name="description" />
              </div>
              <button className="button button-primary" type="submit">
                Ajouter la prestation
              </button>
            </form>
          </article>

          <article className="panel">
            <div className="panel-heading">
              <p className="panel-kicker">Actes</p>
              <h2>Catalogue actif</h2>
            </div>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Prestation</th>
                    <th>Duree</th>
                    <th>Tarif</th>
                  </tr>
                </thead>
                <tbody>
                  {data.serviceItems.length === 0 ? (
                    <tr>
                      <td colSpan={3}>Aucune prestation pour le moment.</td>
                    </tr>
                  ) : (
                    data.serviceItems.map((item) => (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.defaultDurationMin ?? "-"} min</td>
                        <td className="amount-cell">{item.formattedAmount}</td>
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
