# Contrats API initiaux

Les contrats ci-dessous decrivent les endpoints REST possibles. Avec Next.js, ils peuvent devenir des route handlers ou etre remplaces par des server actions. Les memes regles de validation et permission restent applicables.

## Standards

Base:

```text
/api/cabinets/:cabinetId
```

Reponse succes:

```json
{
  "data": {}
}
```

Reponse erreur:

```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "Access denied"
  }
}
```

Codes erreur:

- `UNAUTHORIZED`
- `FORBIDDEN`
- `NOT_FOUND`
- `VALIDATION_ERROR`
- `CONFLICT`
- `LOCKED_PERIOD`
- `INTERNAL_ERROR`

## Cabinets

### POST /api/cabinets

Creer un cabinet.

Body:

```json
{
  "name": "Cabinet Republique",
  "legalName": "Cabinet Republique",
  "siret": "12345678900010",
  "fiscalRegime": "BNC",
  "timezone": "Europe/Paris"
}
```

### GET /api/cabinets

Lister les cabinets accessibles a l'utilisateur.

## Membres

### GET /api/cabinets/:cabinetId/members

Permission: `users.manage`

### POST /api/cabinets/:cabinetId/members/invitations

Inviter un utilisateur.

Body:

```json
{
  "email": "admin@example.com",
  "role": "ASSISTANT"
}
```

## Patients

### GET /api/cabinets/:cabinetId/patients

Query:

```text
search=
active=true
page=1
pageSize=25
```

### POST /api/cabinets/:cabinetId/patients

Body:

```json
{
  "firstName": "Camille",
  "lastName": "Martin",
  "email": "camille@example.com",
  "phone": "+33600000000"
}
```

### PATCH /api/cabinets/:cabinetId/patients/:patientId

Modifier la fiche administrative.

## Rendez-vous

### GET /api/cabinets/:cabinetId/appointments

Query:

```text
from=2026-01-01
to=2026-01-31
practitionerId=
status=
```

### POST /api/cabinets/:cabinetId/appointments

Body:

```json
{
  "patientId": "patient_id",
  "practitionerId": "user_id",
  "serviceItemId": "service_id",
  "startsAt": "2026-01-12T09:00:00.000Z",
  "endsAt": "2026-01-12T09:45:00.000Z"
}
```

## Prestations

### GET /api/cabinets/:cabinetId/service-items

### POST /api/cabinets/:cabinetId/service-items

Body:

```json
{
  "name": "Consultation",
  "defaultDurationMin": 45,
  "defaultAmountCents": 6000,
  "currency": "EUR"
}
```

## Factures

### GET /api/cabinets/:cabinetId/invoices

Query:

```text
status=
from=
to=
patientId=
```

### POST /api/cabinets/:cabinetId/invoices

Body:

```json
{
  "patientId": "patient_id",
  "issuedAt": "2026-01-12T00:00:00.000Z",
  "lines": [
    {
      "serviceItemId": "service_id",
      "label": "Consultation",
      "quantity": 1,
      "unitCents": 6000
    }
  ]
}
```

### POST /api/cabinets/:cabinetId/invoices/:invoiceId/issue

Emettre une facture brouillon.

### POST /api/cabinets/:cabinetId/invoices/:invoiceId/cancel

Annuler une facture avec audit.

## Paiements

### POST /api/cabinets/:cabinetId/payments

Body:

```json
{
  "invoiceId": "invoice_id",
  "amountCents": 6000,
  "currency": "EUR",
  "paidAt": "2026-01-12T10:00:00.000Z",
  "method": "CARD"
}
```

## Charges

### GET /api/cabinets/:cabinetId/expenses

### POST /api/cabinets/:cabinetId/expenses

Body:

```json
{
  "label": "Loyer cabinet",
  "amountCents": 75000,
  "currency": "EUR",
  "expenseDate": "2026-01-05T00:00:00.000Z",
  "accountingCategoryId": "category_id"
}
```

## Dashboard

### GET /api/cabinets/:cabinetId/dashboard/monthly

Query:

```text
month=2026-01
```

Reponse:

```json
{
  "data": {
    "incomeCents": 1200000,
    "expenseCents": 350000,
    "estimatedResultCents": 850000,
    "unpaidInvoiceCents": 180000,
    "completedAppointments": 82
  }
}
```

## Declarations

### GET /api/cabinets/:cabinetId/declaration-periods

### POST /api/cabinets/:cabinetId/declaration-periods

### POST /api/cabinets/:cabinetId/declaration-periods/:periodId/lock

Verrouiller une periode.

## Exports

### POST /api/cabinets/:cabinetId/exports

Body:

```json
{
  "type": "payments_csv",
  "filters": {
    "from": "2026-01-01",
    "to": "2026-12-31"
  }
}
```

### GET /api/cabinets/:cabinetId/exports/:exportJobId

Recuperer le statut d'un export.
