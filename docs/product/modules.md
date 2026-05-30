# Modules fonctionnels

## 1. Cabinet

Fonctions:

- Creer un cabinet
- Gerer les informations legales et administratives
- Associer plusieurs lieux d'exercice
- Parametrer devise, exercice fiscal, regime fiscal et categories comptables
- Inviter des membres

Entites principales:

- Cabinet
- Lieu d'exercice
- Membre du cabinet
- Role

## 2. Utilisateurs et permissions

Roles initiaux:

- Owner: controle complet du cabinet
- Admin: gestion operationnelle
- Practitioner: activite et facturation personnelle
- Assistant: planning, patients et documents selon permissions
- Accountant: acces lecture/export aux donnees financieres

Permissions:

- cabinet.manage
- users.manage
- patients.read
- patients.write
- appointments.manage
- billing.manage
- accounting.manage
- declarations.manage
- exports.run
- audit.read

## 3. Patients

Objectif MVP: fiche administrative minimale.

Champs:

- Identite
- Coordonnees
- Date de naissance optionnelle
- Notes administratives
- Statut actif/inactif
- Rattachement cabinet

Points sensibles:

- Eviter le stockage de donnees de sante non necessaires
- Journaliser les acces
- Prevoir suppression/anonymisation

## 4. Agenda

Fonctions:

- Rendez-vous par cabinet, lieu et praticien
- Statuts: planifie, confirme, annule, absent, termine
- Liaison optionnelle a une prestation
- Vue jour/semaine/mois

## 5. Prestations et actes

Fonctions:

- Catalogue d'actes par cabinet
- Tarif par defaut
- Duree par defaut
- Categorie de revenu
- Association a un rendez-vous ou facture

## 6. Facturation et paiements

Fonctions:

- Creer une facture
- Ajouter lignes de prestation
- Suivre paiements partiels
- Gerer avoirs et annulations
- Identifier impayes
- Exporter les donnees

Statuts facture:

- draft
- issued
- partially_paid
- paid
- cancelled

Moyens de paiement:

- cash
- card
- check
- bank_transfer
- third_party
- other

## 7. Revenus, charges et tresorerie

Fonctions:

- Visualiser revenus encaisses par periode
- Saisir charges professionnelles
- Categoriser recettes et depenses
- Suivre tresorerie simple
- Comparer mois, trimestre, annee

Categories initiales:

- Honoraires
- Retrocessions recues
- Retrocessions versees
- Loyers et charges cabinet
- Materiel
- Assurance
- Formation
- Deplacements
- Logiciels
- Cotisations
- Frais bancaires

## 8. Declarations

Fonctions:

- Preparation de syntheses par exercice fiscal
- Export des revenus encaisses
- Export des charges
- Suivi des periodes declarees
- Notes et pieces justificatives

Attention:

L'application peut aider a preparer les declarations mais ne doit pas presenter un calcul fiscal comme un avis comptable certifie sans validation par un professionnel.

## 9. Exports

Formats:

- CSV
- XLSX plus tard
- PDF plus tard

Exports MVP:

- Recettes par periode
- Depenses par periode
- Factures
- Paiements
- Patients actifs
- Journal d'audit

## 10. Tableaux de bord

Indicateurs:

- Chiffre d'affaires encaisse
- Factures emises
- Impayes
- Charges
- Resultat estime
- Rendez-vous realises
- Taux d'annulation
- Evolution mensuelle

## 11. Documents

Fonctions futures:

- Stockage justificatifs
- Association a une charge ou facture
- Expiration ou rappel
- Export dossier comptable

## 12. Audit

Evenements a tracer:

- Connexion
- Creation/modification/suppression cabinet
- Acces fiche patient
- Modification facture/paiement
- Export de donnees
- Changement de permissions
