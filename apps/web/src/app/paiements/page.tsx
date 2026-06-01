import Link from "next/link";
import { createPaymentAction } from "../actions";
import { getPaymentsPageData } from "@/server/module-data";

function paymentMethodLabel(method: string) {
  const labels: Record<string, string> = {
    CASH: "Especes",
    CARD: "Carte",
    CHECK: "Cheque",
    BANK_TRANSFER: "Virement",
    THIRD_PARTY: "Tiers payant",
    OTHER: "Autre",
  };

  return labels[method] ?? method;
}

export default async function PaiementsPage() {
  const data = await getPaymentsPageData();

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Plugin encaissements</p>
          <h1>Paiements</h1>
        </div>
        <Link className="button button-secondary" href="/">
          Retour dashboard
        </Link>
      </header>

      <section className="page-grid">
        {!data.databaseReady ? (
          <div className="notice">
            <strong>Plugin indisponible.</strong>
            <span>Active le plugin Paiements dans le catalogue puis lance les migrations.</span>
          </div>
        ) : null}

        <div className="workspace-grid">
          <article className="panel">
            <div className="panel-heading">
              <p className="panel-kicker">Encaissement</p>
              <h2>Nouveau paiement</h2>
            </div>
            <form action={createPaymentAction} className="form-grid">
              <div className="field">
                <label htmlFor="invoiceId">Facture</label>
                <select id="invoiceId" name="invoiceId">
                  <option value="">Paiement libre</option>
                  {data.invoices.map((invoice) => (
                    <option key={invoice.id} value={invoice.id}>
                      {invoice.invoiceNumber} - {invoice.formattedRemaining} restant
                    </option>
                  ))}
                </select>
              </div>
              <div className="field-grid">
                <div className="field">
                  <label htmlFor="amount">Montant EUR</label>
                  <input id="amount" name="amount" type="number" step="0.01" required />
                </div>
                <div className="field">
                  <label htmlFor="paidAt">Date</label>
                  <input id="paidAt" name="paidAt" type="date" />
                </div>
                <div className="field">
                  <label htmlFor="method">Moyen</label>
                  <select id="method" name="method">
                    <option value="CARD">Carte</option>
                    <option value="CASH">Especes</option>
                    <option value="CHECK">Cheque</option>
                    <option value="BANK_TRANSFER">Virement</option>
                    <option value="THIRD_PARTY">Tiers payant</option>
                    <option value="OTHER">Autre</option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="reference">Reference</label>
                  <input id="reference" name="reference" />
                </div>
              </div>
              <div className="field">
                <label htmlFor="notes">Notes</label>
                <textarea id="notes" name="notes" />
              </div>
              <button className="button button-primary" type="submit">
                Enregistrer le paiement
              </button>
            </form>
          </article>

          <article className="panel">
            <div className="panel-heading">
              <p className="panel-kicker">Suivi</p>
              <h2>Paiements recents</h2>
            </div>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Facture</th>
                    <th>Moyen</th>
                    <th>Montant</th>
                  </tr>
                </thead>
                <tbody>
                  {data.payments.length === 0 ? (
                    <tr>
                      <td colSpan={4}>Aucun paiement pour le moment.</td>
                    </tr>
                  ) : (
                    data.payments.map((payment) => (
                      <tr key={payment.id}>
                        <td>{payment.paidAt.toLocaleDateString("fr-FR")}</td>
                        <td>{payment.invoice?.invoiceNumber ?? "Libre"}</td>
                        <td>{paymentMethodLabel(payment.method)}</td>
                        <td className="amount-cell">{payment.formattedAmount}</td>
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
