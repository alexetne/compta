# Conventions de developpement

## Langage

- TypeScript strict
- Noms explicites
- Fonctions courtes
- Erreurs metier typees
- Validation Zod aux frontieres

## Nommage

Tables Prisma:

- Modeles en PascalCase: `Cabinet`, `Invoice`, `Payment`
- Champs en camelCase: `cabinetId`, `createdAt`
- Enums en PascalCase

Routes:

- `/app/(app)/cabinets/[cabinetId]/...` pour les vues connectees
- `/api/cabinets/[cabinetId]/...` pour les endpoints

Permissions:

- Format `resource.action`
- Exemple: `billing.manage`, `exports.run`

Branches Git:

- `feature/module-name`
- `fix/bug-name`
- `chore/task-name`

Commits:

- `feat: add invoice payments`
- `fix: restrict patient access by cabinet`
- `docs: describe declaration workflow`

## Structure applicative proposee

```text
apps/web/src/app/              Routes Next.js
apps/web/src/components/       Composants UI
apps/web/src/features/         Modules fonctionnels
apps/web/src/lib/              Helpers techniques
apps/web/src/server/           Services serveur
packages/shared/src/schemas/   Schemas Zod partages
packages/shared/src/types/     Types partages
```

## Pattern module

Chaque module fonctionnel peut suivre:

```text
features/invoices/
  components/
  actions.ts
  queries.ts
  service.ts
  schema.ts
  permissions.ts
```

## Validation

- Toute entree utilisateur doit passer par un schema Zod.
- Les enums metier doivent etre centralises.
- Les montants doivent etre valides en centimes.
- Les dates doivent etre validees avant conversion.

## Tests

Priorite:

1. Services metier financiers
2. Permissions et isolation cabinet
3. Exports
4. Formulaires critiques
5. Parcours e2e MVP

## Qualite UI

- Etats vides utiles
- Tables filtrables
- Actions principales visibles
- Pas de donnees financieres cachees derriere plusieurs clics
- Confirmation pour actions destructives
- Historique visible pour factures et paiements

## Normalisation metier

### Statuts generiques

- active
- inactive
- archived

### Factures

- draft
- issued
- partially_paid
- paid
- cancelled

### Rendez-vous

- scheduled
- confirmed
- cancelled
- no_show
- completed

### Exports

- pending
- processing
- completed
- failed

## Variables d'environnement

```text
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
APP_ENV=local
```
