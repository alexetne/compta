# Securite et RGPD

## Principes

- Minimisation des donnees
- Acces par role et par cabinet
- Journalisation des actions sensibles
- Sauvegardes testees
- Droit a l'export et a la suppression
- Chiffrement des communications

## Donnees de sante

Le produit doit eviter de stocker des donnees de sante detaillees dans le MVP. La fiche patient doit rester administrative sauf besoin metier clairement defini.

Si des donnees de sante sont stockees plus tard:

- Hebergement adapte aux exigences applicables
- Analyse d'impact
- Politique de conservation
- Controle d'acces renforce
- Journalisation fine

## RGPD a documenter

- Finalites de traitement
- Base legale
- Categories de donnees
- Durees de conservation
- Sous-traitants
- Mesures de securite
- Procedure de violation de donnees

## Mesures techniques

- HTTPS obligatoire
- Cookies secure et httpOnly
- Protection CSRF selon mecanisme auth retenu
- Rate limiting sur connexion et exports
- Mots de passe jamais stockes en clair
- Secrets hors depot Git
- Logs sans donnees sensibles

## Sauvegardes

Exigences:

- Backup quotidien minimum
- Retention definie
- Test de restauration regulier
- Chiffrement ou stockage securise

## Audit minimal

Actions a journaliser:

- Connexion
- Invitation utilisateur
- Changement role
- Export de donnees
- Acces patient
- Creation/modification/suppression facture
- Creation/modification/suppression paiement
- Verrouillage de periode

## Droits utilisateur

Prevoir:

- Export des donnees cabinet
- Export des donnees patient
- Suppression ou anonymisation patient
- Desactivation compte utilisateur
- Revocation acces tiers
