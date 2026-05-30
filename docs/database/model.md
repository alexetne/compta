# Modele de donnees

## Vue d'ensemble

Le modele est organise autour du cabinet. Les entites financieres, patients, rendez-vous, documents et exports doivent porter un `cabinetId`.

## Entites principales

### User

Compte applicatif global.

Relations:

- Plusieurs appartenances cabinet via `CabinetMember`
- Plusieurs actions dans `AuditLog`

### Cabinet

Unite de gestion principale.

Contient:

- Informations administratives
- Devise
- Timezone
- Regime fiscal
- Membres
- Patients
- Factures
- Paiements
- Charges

### CabinetMember

Association utilisateur/cabinet avec role.

Permet:

- Multi-cabinet
- Permissions differenciees
- Acces tiers expert-comptable

### Patient

Fiche administrative rattachee a un cabinet.

MVP:

- Nom
- Prenom
- Email
- Telephone
- Notes administratives

### Appointment

Rendez-vous rattache a un cabinet, un patient optionnel et un praticien.

### ServiceItem

Catalogue d'actes/prestations du cabinet.

### Invoice

Facture rattachee au cabinet.

Contient:

- Numero
- Statut
- Date d'emission
- Total en centimes
- Lignes
- Paiements

### InvoiceLine

Ligne de facture.

### Payment

Paiement total ou partiel.

### Expense

Charge professionnelle.

### AccountingCategory

Categorie de recette ou depense.

### DeclarationPeriod

Periode declarative ou fiscale.

### ExportJob

Trace des exports generes.

### AuditLog

Journal immuable des actions sensibles.

## Regles importantes

- Les montants sont stockes en centimes.
- Les suppressions metier doivent favoriser `deletedAt` ou archivage.
- Les factures emises ne doivent pas etre modifiees sans trace.
- Les paiements doivent etre append-only autant que possible.
- Les periodes verrouillees ne doivent plus accepter de modifications financieres sans permission speciale.

## Index prioritaires

- `cabinetId`
- `cabinetId, createdAt`
- `cabinetId, status`
- `cabinetId, invoiceNumber`
- `cabinetId, periodStart, periodEnd`
- `userId, cabinetId`
