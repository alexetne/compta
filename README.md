# Cabinet paramedical

Base de travail pour un outil web de gestion de cabinet paramedical: activite, revenus, declarations, patients, rendez-vous, facturation et pilotage par cabinet.

## Objectif

Construire une application multi-cabinets permettant a des professionnels paramedicaux de suivre leur activite administrative et financiere avec une base solide pour la conformite, la securite et l'evolutivite.

## Stack recommandee

- Frontend et backend web: Next.js avec TypeScript
- Base de donnees: PostgreSQL
- ORM: Prisma
- Validation: Zod
- UI: Tailwind CSS + composants accessibles
- Authentification: Auth.js ou fournisseur compatible OAuth/email
- Tests: Vitest, Playwright
- Observabilite: Sentry ou equivalent
- Hebergement cible: Scalingo, Clever Cloud, Fly.io, Railway, Render ou infrastructure europeenne compatible RGPD

## Domaines fonctionnels

- Cabinets et etablissements
- Utilisateurs, roles et permissions
- Patients et dossiers administratifs
- Rendez-vous et planning
- Actes, prestations et cotations
- Facturation, paiements et impayes
- Revenus, charges et tresorerie
- Declarations fiscales/sociales
- Exports comptables
- Documents et justificatifs
- Tableaux de bord
- Journal d'audit et securite

## Structure

```text
apps/web/              Application web
packages/shared/       Types, schemas et logique partagee
prisma/                Schema de base de donnees
docs/product/          Cadrage produit et fonctionnalites
docs/technical/        Architecture, conventions, qualite
docs/database/         Modele de donnees
docs/api/              Contrats API
docs/security/         RGPD, securite, audit
docs/roadmap/          Roadmap et montee en competence
```

## Demarrage propose

```bash
npm install
cp .env.example .env
docker compose up -d
npm run db:migrate
npm run db:seed
npm run dev
```

Application locale: http://localhost:3000

## Cadrage produit propose

1. Valider les professions ciblees en premier: infirmiers, kines, orthophonistes, psychomotriciens, dieteticiens, osteopathes, etc.
2. Choisir le niveau de gestion patient attendu: administratif simple ou dossier metier detaille.
3. Stabiliser le modele de revenus: BNC, micro-BNC, SCM, SEL, retrocession, remplacants.
4. Construire un MVP centre sur cabinet, agenda, revenus, charges, declarations et exports.
5. Ajouter ensuite les modules avances: documents, automatisations, integrations bancaires, teletransmission si necessaire.

## Documents principaux

- [Vision produit](docs/product/vision.md)
- [Modules fonctionnels](docs/product/modules.md)
- [Taxonomie metier](docs/product/taxonomy.md)
- [Architecture technique](docs/technical/architecture.md)
- [Conventions de developpement](docs/technical/conventions.md)
- [Modele de donnees](docs/database/model.md)
- [Schema Prisma initial](prisma/schema.prisma)
- [Contrats API](docs/api/contracts.md)
- [Securite et RGPD](docs/security/rgpd-security.md)
- [Roadmap](docs/roadmap/roadmap.md)
- [Plan de competences](docs/roadmap/competences.md)
