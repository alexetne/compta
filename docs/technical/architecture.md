# Architecture technique

## Vue generale

Architecture cible:

```text
Navigateur
  -> Next.js App Router
    -> Server actions / API routes
      -> Services metier
        -> Prisma
          -> PostgreSQL
```

Le produit doit etre multi-tenant: toutes les donnees metier sont rattachees a un `cabinetId`. Les requetes doivent verifier que l'utilisateur courant est membre du cabinet avant tout acces.

## Couches

### UI

Responsabilites:

- Afficher les vues
- Gérer les formulaires
- Afficher etat vide, chargement, erreur
- Ne jamais contenir de logique comptable critique

### Application

Responsabilites:

- Orchestrer les actions utilisateur
- Valider les entrees avec Zod
- Appeler les services metier
- Transformer les erreurs en messages utiles

### Domaine

Responsabilites:

- Regles de facturation
- Calculs de revenus et charges
- Statuts facture/paiement
- Verrouillage de periode
- Controle des permissions sensibles

### Infrastructure

Responsabilites:

- Prisma
- Stockage documents
- Email
- Exports
- Jobs asynchrones
- Logs et monitoring

## Multi-tenancy

Regle: aucune entite metier sensible ne doit etre accessible sans verification du cabinet.

Pattern recommande:

1. Lire la session utilisateur
2. Verifier l'appartenance au cabinet
3. Verifier la permission
4. Executer la requete filtree par `cabinetId`
5. Ecrire un audit log si action sensible

## Choix techniques

### Next.js

Avantages:

- Full-stack TypeScript
- Routes serveur integrees
- Bon support formulaires et rendu hybride
- Deploiement simple

### PostgreSQL

Avantages:

- Relationnel fiable
- Transactions solides
- Types dates/numeriques robustes
- Adapté comptabilite et audit

### Prisma

Avantages:

- Schema lisible
- Migrations
- Typage TypeScript
- Productivite en phase MVP

## Numerique et argent

Ne jamais stocker d'argent en float.

Option recommandee:

- Stocker les montants en centimes avec `Int`
- Stocker la devise sur les entites financieres
- Afficher via helpers de formatage

## Dates

- Stocker en UTC
- Garder la timezone du cabinet
- Les periodes fiscales doivent utiliser des dates civiles locales

## Exports

Les exports simples peuvent etre synchrones en MVP. Les exports volumineux doivent passer par une table `ExportJob`.

## Audit

L'audit doit enregistrer:

- Acteur
- Cabinet
- Action
- Ressource
- Horodatage
- Metadata JSON minimale

Ne pas stocker de donnees sensibles inutiles dans les metadata.

## Environnements

- local: developpement
- staging: validation avant production
- production: donnees reelles

Chaque environnement doit avoir une base separee.
