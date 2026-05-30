const metrics = [
  { label: "Revenus encaisses", value: "0,00 EUR" },
  { label: "Factures impayees", value: "0" },
  { label: "Rendez-vous ce mois", value: "0" },
  { label: "Charges saisies", value: "0,00 EUR" },
];

const modules = [
  "Cabinet",
  "Patients",
  "Agenda",
  "Prestations",
  "Factures",
  "Paiements",
  "Charges",
  "Declarations",
  "Exports",
  "Audit",
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-sm font-medium text-teal-700">Cabinet paramedical</p>
            <h1 className="text-2xl font-semibold">Pilotage cabinet</h1>
          </div>
          <button className="rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white">
            Nouveau cabinet
          </button>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-8">
        <div className="grid gap-4 md:grid-cols-4">
          {metrics.map((metric) => (
            <article key={metric.label} className="rounded-md border border-slate-200 bg-white p-4">
              <p className="text-sm text-slate-600">{metric.label}</p>
              <p className="mt-2 text-2xl font-semibold">{metric.value}</p>
            </article>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <nav className="rounded-md border border-slate-200 bg-white p-3">
            <p className="px-2 pb-2 text-xs font-semibold uppercase text-slate-500">Modules</p>
            <div className="grid gap-1">
              {modules.map((moduleName) => (
                <button
                  className="rounded px-2 py-2 text-left text-sm hover:bg-slate-100"
                  key={moduleName}
                >
                  {moduleName}
                </button>
              ))}
            </div>
          </nav>

          <section className="rounded-md border border-slate-200 bg-white p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">Tableau de bord mensuel</h2>
                <p className="mt-1 max-w-2xl text-sm text-slate-600">
                  Base applicative prete pour brancher les donnees cabinet, revenus,
                  factures, charges et declarations.
                </p>
              </div>
              <button className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium">
                Export CSV
              </button>
            </div>

            <div className="mt-6 overflow-hidden rounded-md border border-slate-200">
              <table className="w-full border-collapse text-sm">
                <thead className="bg-slate-100 text-left">
                  <tr>
                    <th className="px-4 py-3 font-medium">Flux</th>
                    <th className="px-4 py-3 font-medium">Statut</th>
                    <th className="px-4 py-3 font-medium">Montant</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-slate-200">
                    <td className="px-4 py-3">Honoraires encaisses</td>
                    <td className="px-4 py-3">A connecter</td>
                    <td className="px-4 py-3">0,00 EUR</td>
                  </tr>
                  <tr className="border-t border-slate-200">
                    <td className="px-4 py-3">Charges professionnelles</td>
                    <td className="px-4 py-3">A connecter</td>
                    <td className="px-4 py-3">0,00 EUR</td>
                  </tr>
                  <tr className="border-t border-slate-200">
                    <td className="px-4 py-3">Resultat estime</td>
                    <td className="px-4 py-3">A calculer</td>
                    <td className="px-4 py-3">0,00 EUR</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
