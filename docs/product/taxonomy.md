# Taxonomie metier

## Cabinet

Unite principale de gestion. Un cabinet regroupe les utilisateurs, patients, prestations, factures, paiements, charges, declarations et exports.

## Lieu d'exercice

Adresse ou site rattache a un cabinet. Un cabinet peut avoir plusieurs lieux.

## Praticien

Utilisateur qui realise des rendez-vous, prestations ou actes.

## Patient

Personne suivie par le cabinet. Dans le MVP, la fiche patient reste administrative.

## Prestation

Element de catalogue facturable: consultation, seance, bilan, suivi, intervention ou acte specifique.

## Rendez-vous

Creneau planifie entre un praticien et un patient. Un rendez-vous peut aboutir a une prestation facturee.

## Facture

Document de facturation contenant une ou plusieurs lignes. Une facture peut etre brouillon, emise, payee partiellement, payee ou annulee.

## Ligne de facture

Detail facturable: libelle, quantite, prix unitaire et total.

## Paiement

Encaissement rattache ou non a une facture. Le revenu declare depend generalement des paiements encaisses, pas seulement des factures emises.

## Recette

Flux financier entrant. Dans l'application, une recette provient principalement d'un paiement.

## Charge

Depense professionnelle saisie par le cabinet.

## Categorie comptable

Classification d'une recette ou d'une charge pour faciliter les syntheses, exports et declarations.

## Declaration

Preparation ou suivi d'une periode fiscale/sociale. L'application aide a organiser les donnees, mais la validation finale doit rester explicite.

## Exercice fiscal

Periode annuelle de reference du cabinet. Par defaut, elle commence en janvier, mais cela doit rester configurable.

## Periode verrouillee

Periode qui ne doit plus accepter de modification financiere ordinaire apres controle ou export.

## Export

Fichier produit a partir des donnees du cabinet: recettes, charges, paiements, factures ou audit.

## Audit

Journal horodate des actions sensibles. Il sert a comprendre qui a fait quoi, quand, et sur quelle ressource.
