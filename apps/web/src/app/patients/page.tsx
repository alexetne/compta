import Link from "next/link";
import { createPatientAction } from "../actions";
import { getPatientsPageData } from "@/server/module-data";

export default async function PatientsPage() {
  const data = await getPatientsPageData();

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Module cabinet</p>
          <h1>Patients</h1>
        </div>
        <Link className="button button-secondary" href="/">
          Retour dashboard
        </Link>
      </header>

      <section className="page-grid">
        {!data.databaseReady ? (
          <div className="notice">
            <strong>Base locale non connectee.</strong>
            <span>Le formulaire sera actif apres migration Prisma.</span>
          </div>
        ) : null}

        <div className="workspace-grid">
          <article className="panel">
            <div className="panel-heading">
              <p className="panel-kicker">Creation</p>
              <h2>Nouveau patient</h2>
            </div>
            <form action={createPatientAction} className="form-grid">
              <div className="field-grid">
                <div className="field">
                  <label htmlFor="firstName">Prenom</label>
                  <input id="firstName" name="firstName" required />
                </div>
                <div className="field">
                  <label htmlFor="lastName">Nom</label>
                  <input id="lastName" name="lastName" required />
                </div>
                <div className="field">
                  <label htmlFor="email">Email</label>
                  <input id="email" name="email" type="email" />
                </div>
                <div className="field">
                  <label htmlFor="phone">Telephone</label>
                  <input id="phone" name="phone" />
                </div>
              </div>
              <div className="field">
                <label htmlFor="administrativeNotes">Notes administratives</label>
                <textarea id="administrativeNotes" name="administrativeNotes" />
              </div>
              <button className="button button-primary" type="submit">
                Ajouter le patient
              </button>
            </form>
          </article>

          <article className="panel">
            <div className="panel-heading">
              <p className="panel-kicker">Liste</p>
              <h2>Patients actifs</h2>
            </div>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Contact</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {data.patients.length === 0 ? (
                    <tr>
                      <td colSpan={3}>Aucun patient pour le moment.</td>
                    </tr>
                  ) : (
                    data.patients.map((patient) => (
                      <tr key={patient.id}>
                        <td>
                          {patient.firstName} {patient.lastName}
                        </td>
                        <td>{patient.email ?? patient.phone ?? "-"}</td>
                        <td>
                          <span className="status-pill">{patient.active ? "Actif" : "Inactif"}</span>
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
