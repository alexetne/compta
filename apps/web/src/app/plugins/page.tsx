import Link from "next/link";
import { getPluginCatalog } from "@/plugins/installations";
import { getOrCreateDevSession } from "@/server/auth";
import { setPluginEnabledAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function PluginsPage() {
  let databaseReady = true;
  let plugins: Awaited<ReturnType<typeof getPluginCatalog>> = [];

  try {
    const session = await getOrCreateDevSession();
    plugins = await getPluginCatalog(session.cabinetId);
  } catch {
    databaseReady = false;
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Noyau applicatif</p>
          <h1>Plugins</h1>
        </div>
        <Link className="button button-secondary" href="/">
          Retour dashboard
        </Link>
      </header>

      <section className="page-grid">
        {!databaseReady ? (
          <div className="notice">
            <strong>Base locale non connectee.</strong>
            <span>Le catalogue sera actif apres migration Prisma.</span>
          </div>
        ) : null}

        <section className="plugin-grid">
          {plugins.map((plugin) => (
            <article className="plugin-card" key={plugin.id}>
              <div>
                <p className="panel-kicker">{plugin.category}</p>
                <h2>{plugin.name}</h2>
                <p className="muted-text">{plugin.description}</p>
              </div>
              <div className="plugin-meta">
                <span className="status-pill">{plugin.status}</span>
                <span className="status-pill">{plugin.enabled ? "Actif" : "Inactif"}</span>
              </div>
              {plugin.status === "core" ? (
                <button className="button button-secondary" disabled>
                  Noyau obligatoire
                </button>
              ) : (
                <form action={setPluginEnabledAction}>
                  <input name="pluginId" type="hidden" value={plugin.id} />
                  <input name="enabled" type="hidden" value={plugin.enabled ? "false" : "true"} />
                  <button className="button button-primary" type="submit">
                    {plugin.enabled ? "Desactiver" : "Activer"}
                  </button>
                </form>
              )}
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}
