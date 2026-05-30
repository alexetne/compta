# Roadmap

## Phase 0 - Cadrage

- Valider les professions ciblees
- Choisir le perimetre patient
- Definir les regimes fiscaux prioritaires
- Identifier les obligations legales
- Valider l'hebergement et les exigences RGPD

## Phase 1 - Socle technique

- Initialiser Next.js, TypeScript, Prisma et PostgreSQL
- Mettre en place auth et multi-tenancy par cabinet
- Ajouter RBAC
- Ajouter audit log
- Ajouter validation Zod
- Ajouter tests unitaires et e2e minimaux

## Phase 2 - MVP cabinet

- Cabinet
- Membres
- Patients administratifs
- Agenda simple
- Catalogue d'actes
- Factures
- Paiements
- Charges
- Dashboard mensuel
- Export CSV

## Phase 3 - Comptabilite et declarations

- Exercices fiscaux
- Categories comptables parametrables
- Syntheses fiscales
- Exports expert-comptable
- Gestion pieces justificatives
- Verrouillage de periode

## Phase 4 - Collaboration

- Acces assistant
- Acces expert-comptable
- Notifications
- Commentaires internes
- Historique detaille

## Phase 5 - Automatisations

- Import bancaire
- Rapprochement paiement/facture
- Rappels d'impayes
- OCR justificatifs
- Exports XLSX/PDF

## Definition of done globale

- Fonction testee
- Permission verifiee
- Donnees cabinet isolees
- Validation entree/sortie
- Audit si action sensible
- Export ou recuperation prevue si donnee financiere
- Documentation courte mise a jour
