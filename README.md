# SAS Schoeffter — Site vitrine

Site vitrine one-page de la **SAS Schoeffter**, couvreur à Metz et en Moselle
(charpente, couverture, zinguerie, entretien, installateur Velux).

Site statique (HTML/CSS/JS), sans étape de build.

## Structure

```
index.html          Page unique (hero vidéo, prestations, réalisations, avis, FAQ, contact)
zone-map.html       Carte D3 de la zone d'intervention (chargée en iframe)
robots.txt
sitemap.xml
assets/             Logo, vidéo, photos, police Freeroad
```

## Déploiement (Cloudflare Pages)

Hébergement statique. Réglages de build :

- **Framework preset** : None
- **Build command** : (vide)
- **Build output directory** : `/`

## À finaliser avant mise en production

- Brancher le formulaire de devis sur un backend (Formspree / Cloudflare Pages Forms).
- Remplacer les avis et la note (4,9/5) par les vrais avis Google.
- Confirmer ou retirer les certifications affichées.
- Remplacer le domaine `schoeffter-couverture.fr` (canonical, Open Graph, sitemap) par le domaine réel.
- Remplacer les photos de banque d'images par de vraies photos de chantiers.
