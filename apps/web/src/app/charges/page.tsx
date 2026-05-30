import Link from "next/link";
import { createExpenseAction } from "../actions";
import { getExpensesPageData } from "@/server/module-data";

export default async function ChargesPage() {
  const data = await getExpensesPageData();

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Comptabilite</p>
          <h1>Charges</h1>
        </div>
        <Link className="button button-secondary" href="/">
          Retour dashboard
        </Link>
      </header>

      <section className="page-grid">
        <div className="workspace-grid">
          <article className="panel">
            <div className="panel-heading">
              <p className="panel-kicker">Depense</p>
              <h2>Nouvelle charge</h2>
            </div>
            <form action={createExpenseAction} className="form-grid">
              <div className="field">
                <label htmlFor="label">Libelle</label>
                <input id="label" name="label" required />
              </div>
              <div className="field-grid">
                <div className="field">
                  <label htmlFor="amount">Montant EUR</label>
                  <input id="amount" name="amount" type="number" step="0.01" required />
                </div>
                <div className="field">
                  <label htmlFor="expenseDate">Date</label>
                  <input id="expenseDate" name="expenseDate" type="date" />
                </div>
              </div>
              <div className="field">
                <label htmlFor="supplier">Fournisseur</label>
                <input id="supplier" name="supplier" />
              </div>
              <div className="field">
                <label htmlFor="notes">Notes</label>
                <textarea id="notes" name="notes" />
              </div>
              <button className="button button-primary" type="submit">
                Saisir la charge
              </button>
            </form>
          </article>

          <article className="panel">
            <div className="panel-heading">
              <p className="panel-kicker">Suivi</p>
              <h2>Charges recentes</h2>
            </div>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Libelle</th>
                    <th>Date</th>
                    <th>Montant</th>
                  </tr>
                </thead>
                <tbody>
                  {data.expenses.length === 0 ? (
                    <tr>
                      <td colSpan={3}>Aucune charge pour le moment.</td>
                    </tr>
                  ) : (
                    data.expenses.map((expense) => (
                      <tr key={expense.id}>
                        <td>{expense.label}</td>
                        <td>{expense.expenseDate.toLocaleDateString("fr-FR")}</td>
                        <td className="amount-cell">{expense.formattedAmount}</td>
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
