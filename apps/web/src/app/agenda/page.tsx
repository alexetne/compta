import Link from "next/link";
import { createAppointmentAction, updateAppointmentStatusAction } from "../actions";
import { getAppointmentsPageData } from "@/server/module-data";

function appointmentStatusLabel(status: string) {
  const labels: Record<string, string> = {
    SCHEDULED: "Planifie",
    CONFIRMED: "Confirme",
    CANCELLED: "Annule",
    NO_SHOW: "Absent",
    COMPLETED: "Termine",
  };

  return labels[status] ?? status;
}

export default async function AgendaPage() {
  const data = await getAppointmentsPageData();

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Plugin cabinet</p>
          <h1>Agenda</h1>
        </div>
        <Link className="button button-secondary" href="/">
          Retour dashboard
        </Link>
      </header>

      <section className="page-grid">
        {!data.databaseReady ? (
          <div className="notice">
            <strong>Plugin indisponible.</strong>
            <span>Active le plugin Agenda dans le catalogue puis lance les migrations.</span>
          </div>
        ) : null}

        <div className="workspace-grid">
          <article className="panel">
            <div className="panel-heading">
              <p className="panel-kicker">Planning</p>
              <h2>Nouveau rendez-vous</h2>
            </div>
            <form action={createAppointmentAction} className="form-grid">
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
              <div className="field-grid">
                <div className="field">
                  <label htmlFor="date">Date</label>
                  <input id="date" name="date" type="date" required />
                </div>
                <div className="field">
                  <label htmlFor="startsAt">Debut</label>
                  <input id="startsAt" name="startsAt" type="time" required />
                </div>
                <div className="field">
                  <label htmlFor="endsAt">Fin</label>
                  <input id="endsAt" name="endsAt" type="time" required />
                </div>
              </div>
              <div className="field">
                <label htmlFor="notes">Notes</label>
                <textarea id="notes" name="notes" />
              </div>
              <button className="button button-primary" type="submit">
                Planifier
              </button>
            </form>
          </article>

          <article className="panel">
            <div className="panel-heading">
              <p className="panel-kicker">Suivi</p>
              <h2>Rendez-vous</h2>
            </div>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Patient</th>
                    <th>Prestation</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.appointments.length === 0 ? (
                    <tr>
                      <td colSpan={5}>Aucun rendez-vous pour le moment.</td>
                    </tr>
                  ) : (
                    data.appointments.map((appointment) => (
                      <tr key={appointment.id}>
                        <td>
                          <strong>{appointment.startsAt.toLocaleDateString("fr-FR")}</strong>
                          <br />
                          <span className="muted-text">
                            {appointment.startsAt.toLocaleTimeString("fr-FR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}{" "}
                            -{" "}
                            {appointment.endsAt.toLocaleTimeString("fr-FR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </td>
                        <td>
                          {appointment.patient
                            ? `${appointment.patient.firstName} ${appointment.patient.lastName}`
                            : "-"}
                        </td>
                        <td>{appointment.serviceItem?.name ?? "-"}</td>
                        <td>
                          <span className="status-pill">
                            {appointmentStatusLabel(appointment.status)}
                          </span>
                        </td>
                        <td>
                          <form action={updateAppointmentStatusAction} className="inline-actions">
                            <input name="appointmentId" type="hidden" value={appointment.id} />
                            <select name="status" defaultValue={appointment.status}>
                              <option value="SCHEDULED">Planifie</option>
                              <option value="CONFIRMED">Confirme</option>
                              <option value="COMPLETED">Termine</option>
                              <option value="NO_SHOW">Absent</option>
                              <option value="CANCELLED">Annule</option>
                            </select>
                            <button className="button button-secondary" type="submit">
                              Mettre a jour
                            </button>
                          </form>
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
