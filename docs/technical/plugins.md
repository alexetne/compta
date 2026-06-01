# Architecture plugin

## Objectif

Le produit est organise autour d'un noyau applicatif minimal et de plugins metier activables par cabinet.

Le noyau gere:

- Application Next.js
- Session/auth de base
- Prisma et PostgreSQL
- Cabinets et membres
- RBAC
- Audit
- Shell UI
- Registre de plugins
- Installation/activation par cabinet

Les plugins ajoutent:

- Navigation
- Pages
- Formulaires
- Services metier
- Contributions dashboard
- Tables Prisma si besoin
- Permissions requises

## Fichiers principaux

```text
apps/web/src/plugins/types.ts
apps/web/src/plugins/registry.ts
apps/web/src/plugins/installations.ts
apps/web/src/plugins/builtin/
```

## Cycle de vie

1. Un plugin est declare dans `apps/web/src/plugins/builtin`.
2. Il est ajoute au `pluginRegistry`.
3. S'il est `defaultEnabled`, il est installe automatiquement pour les nouveaux cabinets.
4. Le cabinet peut l'activer/desactiver depuis `/plugins`.
5. Le dashboard agrege les contributions des plugins actifs.

## Exemple minimal

```ts
import type { AppPlugin } from "../types";

export const retrocessionsPlugin: AppPlugin = {
  id: "finance.retrocessions",
  name: "Retrocessions",
  description: "Gestion des retrocessions recues et versees.",
  category: "finance",
  status: "planned",
  defaultEnabled: false,
  navItems: [
    {
      label: "Retrocessions",
      href: "/retrocessions",
      status: "Plugin",
      permission: "accounting.manage",
    },
  ],
};
```

## Ajouter un plugin metier

1. Creer `apps/web/src/plugins/builtin/mon-plugin.ts`.
2. Declarer son `AppPlugin`.
3. Ajouter le plugin dans `apps/web/src/plugins/registry.ts`.
4. Creer les pages Next.js associees dans `apps/web/src/app/...`.
5. Creer les services serveur associes dans `apps/web/src/server/services/...`.
6. Ajouter les schemas Zod dans `packages/shared/src/schemas/...`.
7. Ajouter les tables Prisma si le plugin stocke de nouvelles donnees.
8. Generer une migration.
9. Ajouter les contributions dashboard si utile.

## Regles

- Un plugin ne doit jamais contourner le `cabinetId`.
- Un plugin doit verifier les permissions via les services serveur.
- Un plugin financier doit stocker les montants en centimes.
- Un plugin sensible doit ecrire dans `AuditLog`.
- Un plugin peut etre installe mais desactive pour un cabinet.
- Les plugins `core` ne sont pas desactivables.

## Prochains plugins probables

- `finance.retrocessions`: retrocessions recues/versees, remplacants, collaborateurs.
- `billing.invoices`: factures, numeros, lignes et emission.
- `admin.declarations`: periodes fiscales, verrouillage et syntheses.
- `documents.receipts`: justificatifs, pieces comptables et exports.
- `integration.bank-import`: imports bancaires et rapprochements.
