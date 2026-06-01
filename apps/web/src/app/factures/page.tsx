import Link from "next/link";
import {
  cancelInvoiceAction,
  createInvoiceAction,
  issueInvoiceAction,
} from "../actions";
import { getInvoicesPageData } from "@/server/module-data";

function invoiceStatusLabel(status: string) {
  const labels: Record<string, string> = {
    DRAFT: "Brouillon",
    ISSUED: "Emise",
    PARTIALLY_PAID: "Partiellement payee",
    PAID: "Payee",
    CANCELLED: "Annulee",
  };

  return labels[status] ?? status;
}

export default async function FacturesPage() {
  const data = await getInvoicesPageData();

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Plugin facturation</p>
          <h1>Factures</h1>
        </div>
        <Link className="button button-secondary" href="/">
          Retour dashboard
        </Link>
      </header>

      <section className="page-grid">
        {!data.databaseReady ? (
          <div className="notice">
            <strong>Plugin indisponible.</strong>
            <span>Active le plugin Factures dans le catalogue puis lance les migrations.</span>
          </div>
        ) : null}

        <div className="workspace-grid">
          <article className="panel">
            <div className="panel-heading">
              <p className="panel-kicker">Brouillon</p>
              <h2>Nouvelle facture</h2>
            </div>
            <form action={createInvoiceAction} className="form-grid">
              <div className="field">
                <label htmlFor="patientId">Patient</label>
                <select id="patientId" name="patientId">
                  <option value="">Sans patient</option>
                  {data.patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.firstName} {patient.lastName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="serviceItemId">Prestation</label>
                <select id="serviceItemId" name="serviceItemId">
                  <option value="">Libre</option>
                  {data.serviceItems.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="label">Libelle ligne</label>
                <input id="label" name="label" placeholder="Consultation" required />
              </div>
              <div className="field-grid">
                <div className="field">
                  <label htmlFor="quantity">Quantite</label>
                  <input id="quantity" name="quantity" type="number" defaultValue="1" min="1" />
                </div>
                <div className="field">
                  <label htmlFor="unitAmount">Prix unitaire EUR</label>
                  <input id="unitAmount" name="unitAmount" type="number" step="0.01" required />
                </div>
                <div className="field">
                  <label htmlFor="dueAt">Echeance</label>
                  <input id="dueAt" name="dueAt" type="date" />
                </div>
                <div className="field">
                  <label htmlFor="issuedAt">Date emission</label>
                  <input id="issuedAt" name="issuedAt" type="date" />
                </div>
              </div>
              <div className="field">
                <label htmlFor="notes">Notes</label>
                <textarea id="notes" name="notes" />
              </div>
              <button className="button button-primary" type="submit">
                Creer la facture
              </button>
            </form>
          </article>

          <article className="panel">
            <div className="panel-heading">
              <p className="panel-kicker">Suivi</p>
              <h2>Factures recentes</h2>
            </div>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Numero</th>
                    <th>Patient</th>
                    <th>Statut</th>
                    <th>Total</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.invoices.length === 0 ? (
                    <tr>
                      <td colSpan={5}>Aucune facture pour le moment.</td>
                    </tr>
                  ) : (
                    data.invoices.map((invoice) => (
                      <tr key={invoice.id}>
                        <td>
                          <strong>{invoice.invoiceNumber}</strong>
                          <br />
                          <span className="muted-text">{invoice.lines.length} ligne(s)</span>
                        </td>
                        <td>
                          {invoice.patient
                            ? `${invoice.patient.firstName} ${invoice.patient.lastName}`
                            : "-"}
                        </td>
                        <td>
                          <span className="status-pill">{invoiceStatusLabel(invoice.status)}</span>
                        </td>
                        <td className="amount-cell">
                          {invoice.formattedTotal}
                          <br />
                          <span className="muted-text">Regle: {invoice.formattedPaid}</span>
                        </td>
                        <td>
                          <div className="inline-actions">
                            {invoice.status === "DRAFT" ? (
                              <form action={issueInvoiceAction}>
                                <input name="invoiceId" type="hidden" value={invoice.id} />
                                <button className="button button-secondary" type="submit">
                                  Emettre
                                </button>
                              </form>
                            ) : null}
                            {invoice.status !== "CANCELLED" && invoice.status !== "PAID" ? (
                              <form action={cancelInvoiceAction}>
                                <input name="invoiceId" type="hidden" value={invoice.id} />
                                <button className="button button-secondary" type="submit">
                                  Annuler
                                </button>
                              </form>
                            ) : null}
                          </div>
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
