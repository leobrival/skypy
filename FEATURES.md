# Skypy - Fonctionnalités Implémentées

## Vue d'ensemble

Skypy est un clone de Linktree développé avec AdonisJS 6, React 19, Inertia.js et PostgreSQL (Neon). Cette application permet de créer des pages de liens personnalisées (landing pages) et de suivre leurs performances via un système d'analytics avancé.

## Fonctionnalités Principales

### 1. Authentification et Gestion Utilisateur

**Contrôleur**: `app/controllers/auth_controller.ts`
**Pages**: `inertia/pages/auth/login.tsx`, `inertia/pages/auth/register.tsx`

- ✅ Inscription avec email/username/password
- ✅ Connexion avec session persistante
- ✅ Protection des routes avec middleware d'authentification
- ✅ Gestion des utilisateurs avec UUID comme clé primaire

**Modèle**: `app/models/user.ts`

- Champs: `id` (UUID), `email`, `username`, `password` (hashé)
- Relation hasMany vers `LandingPage` et `Link`

---

### 2. Pages de Liens (Landing Pages)

**Contrôleur**: `app/controllers/pages_controller.ts`
**Pages**: `inertia/pages/pages/index.tsx`, `inertia/pages/pages/create.tsx`, `inertia/pages/pages/edit.tsx`

#### Fonctionnalités:

- ✅ Création de landing pages personnalisées avec slug unique
- ✅ Configuration du profil (nom, bio, thème)
- ✅ Gestion de la visibilité (public/private)
- ✅ Compteur de vues automatique
- ✅ Thème personnalisable via `themeConfig` (JSON)

**Modèle**: `app/models/landing_page.ts`

- Champs: `id`, `userId`, `slug`, `profileName`, `bio`, `themeConfig`, `visibility`, `viewCount`
- Relation hasMany vers `Link`

**Page Publique**: `app/controllers/public_pages_controller.ts` → `inertia/pages/public/landing_page.tsx`

- Affichage public des landing pages via slug
- Incrémentation automatique du compteur de vues

---

### 3. Gestion des Liens

**Contrôleur**: `app/controllers/links_controller.ts`
**Pages**: `inertia/pages/links/index.tsx`, `inertia/pages/links/create.tsx`, `inertia/pages/links/edit.tsx`

#### Fonctionnalités:

- ✅ Création de liens avec URL de destination
- ✅ Short codes uniques générés automatiquement
- ✅ Activation/désactivation des liens
- ✅ Position personnalisable pour l'ordre d'affichage
- ✅ Association optionnelle à une landing page
- ✅ **Validation d'URL stricte** (format HTTP/HTTPS valide)
- ✅ **Désactivation conditionnelle du short code** si URL non valide

**Modèle**: `app/models/link.ts`

- Champs: `id`, `userId`, `landingPageId`, `title`, `description`, `destinationUrl`, `shortCode`, `isActive`, `position`, `clickCount`
- Relation belongsTo vers `User` et `LandingPage`
- Relation hasMany vers `LinkClick`

#### Redirection de Liens Courts

**Route**: `/:slug` → `PublicPagesController.show()`

- Redirection automatique vers l'URL de destination
- Incrémentation du compteur de clics
- **Enregistrement détaillé des analytics** (voir section Analytics)

---

### 4. Paramètres UTM et Tracking Marketing

**Migration**: `database/migrations/1763665533851_create_add_utm_parameters_to_links_table.ts`

#### Fonctionnalités:

- ✅ Ajout automatique des paramètres UTM aux URLs de destination
- ✅ Support complet des 5 paramètres UTM:
  - `utm_source` - Source du trafic
  - `utm_medium` - Type de média
  - `utm_campaign` - Nom de la campagne
  - `utm_term` - Mots-clés (pour SEA)
  - `utm_content` - Identifiant de contenu (A/B testing)

**Champs dans Link**:

- `utmSource`, `utmMedium`, `utmCampaign`, `utmTerm`, `utmContent`

#### Paramètres Personnalisés

**Migration**: `database/migrations/1763718615858_create_add_custom_params_to_links_table.ts`

- ✅ Ajout de paramètres personnalisés via JSON
- ✅ Format: `[{ key: 'param1', value: 'value1' }]`
- ✅ Injection automatique dans l'URL de destination

**Implémentation**: `app/controllers/public_pages_controller.ts:76-98`

---

### 5. Presets UTM

**Contrôleur**: `app/controllers/utm_presets_controller.ts`
**Page**: `inertia/pages/utm-presets/index.tsx`
**Modèle**: `app/models/utm_preset.ts`

#### Fonctionnalités:

- ✅ Sauvegarde de combinaisons UTM réutilisables
- ✅ Nom et description pour chaque preset
- ✅ Application rapide aux nouveaux liens

**Champs**:

- `id`, `userId`, `name`, `description`, `utmSource`, `utmMedium`, `utmCampaign`, `utmTerm`, `utmContent`

---

### 6. Analytics Avancé avec Géolocalisation

**Contrôleur**: `app/controllers/analytics_controller.ts`
**Page**: `inertia/pages/analytics/index.tsx`
**Service**: `app/services/geolocation_service.ts`

#### A. Tracking des Clics

**Migration**: `database/migrations/1763780641017_create_create_link_clicks_table.ts`
**Modèle**: `app/models/link_click.ts`

##### Données Collectées par Clic:

- ✅ **Identifiants**: `linkId`, `userId` (si connecté)
- ✅ **Données Réseau**: `ipAddress`, `userAgent`, `referrer`
- ✅ **Détection Appareil**: `deviceType` (mobile/tablet/desktop)
- ✅ **Détection Navigateur**: `browser` (Chrome, Firefox, Safari, Edge, Opera)
- ✅ **Détection OS**: `os` (Windows, macOS, Linux, Android, iOS)
- ✅ **Timestamp**: `clickedAt`

**Implémentation**: `app/controllers/public_pages_controller.ts:52-74`

#### B. Géolocalisation IP

**Migration**: `database/migrations/1763782525212_create_add_geolocation_to_link_clicks_table.ts`

##### Données Géographiques Collectées:

- ✅ **Pays**: `country` (nom complet), `countryCode` (ISO 3166-1 alpha-2)
- ✅ **Ville**: `city`
- ✅ **Région**: `region` (état/province)
- ✅ **Fuseau horaire**: `timezone`
- ✅ **Coordonnées**: `latitude`, `longitude` (decimal 10,7)

**Service de Géolocalisation**: `app/services/geolocation_service.ts`

- API: ip-api.com (gratuit, 45 req/min)
- Timeout: 2 secondes
- Gestion d'erreur gracieuse (retourne `null` en cas d'échec)
- Protection vie privée: skip localhost/IPs privées
- Fire-and-forget: ne bloque pas la redirection

**Implémentation**: `app/controllers/public_pages_controller.ts:64-86`

#### C. Dashboard Analytics

**Page**: `inertia/pages/analytics/index.tsx` (453 lignes)

##### Métriques Affichées:

1. **Vue d'ensemble** (3 cartes)
   - Total des clics
   - Total des vues (landing pages)
   - Nombre total de liens

2. **Graphique Temporel** (Area Chart)
   - Clics par jour sur les 30 derniers jours
   - Gradient bleu avec animations
   - Format de date français

3. **Top 5 Liens** (Liste)
   - Liens les plus cliqués avec nombre de clics
   - Lien vers la page d'édition
   - URL de destination

4. **Répartition des Appareils** (Pie Chart)
   - Distribution mobile/tablet/desktop
   - Couleurs personnalisées
   - Labels avec compteurs

5. **Utilisation des Navigateurs** (Bar Chart)
   - Top 5 navigateurs
   - Barres arrondies

6. **🌍 Breakdown Géographique** (Nouveau!)
   - **Top 5 Pays**:
     - Drapeaux emoji (conversion ISO → emoji)
     - Nom complet du pays
     - Nombre de clics
   - **Top 5 Villes**:
     - Nom de la ville
     - Pays associé
     - Nombre de clics

7. **Activité Récente** (Tableau)
   - 10 derniers clics avec détails complets:
     - Lien cliqué (titre + short code)
     - Type d'appareil (badge coloré)
     - Navigateur
     - Système d'exploitation
     - Referrer (lien cliquable ou "Direct")
     - Timestamp (format français: JJ/MM/AAAA HH:MM)

##### Requêtes SQL Analytics:

- Total counts (clics, vues, liens)
- Recent clicks avec preload `link`
- Clics par jour (GROUP BY DATE)
- Top links (ORDER BY click_count)
- Device stats (GROUP BY device_type)
- Browser stats (GROUP BY browser, LIMIT 5)
- **Country stats (GROUP BY country, country_code, LIMIT 10)**
- **City stats (GROUP BY city, country, LIMIT 10)**

##### Librairie de Charts:

- **Recharts** (v2.x) - Basé sur D3.js
- Composants utilisés: AreaChart, PieChart, BarChart
- Responsive design (ResponsiveContainer)
- Thème personnalisé avec variables CSS

---

### 7. Générateur de QR Code

**Contrôleur**: `app/controllers/qr_controller.ts`
**Page**: `inertia/pages/qr/generate.tsx`

#### Fonctionnalités:

- ✅ Génération de QR codes pour les liens courts
- ✅ Personnalisation (taille, couleur, format)
- ✅ Téléchargement en PNG/SVG

---

### 8. Boutique (Placeholder)

**Contrôleur**: `app/controllers/shop_controller.ts`
**Page**: `inertia/pages/shop/index.tsx`

- ⏳ Fonctionnalité future pour monétisation
- ⏳ Vente de produits/services liés au profil

---

## Architecture Technique

### Stack Technologique

**Backend**:

- AdonisJS 6 (TypeScript)
- Lucid ORM
- PostgreSQL (Neon - serverless)

**Frontend**:

- React 19
- Inertia.js v2 (SSR hybride)
- TailwindCSS v4
- shadcn/ui (composants UI)
- Recharts (visualisations)

**Validation**:

- VineJS (validators AdonisJS)
- Validation côté serveur stricte

**Sécurité**:

- Hashing bcrypt pour mots de passe
- Session guard pour authentification
- Middleware de protection des routes
- CSRF protection (Shield)

### Base de Données

**Migrations**:

1. `1763650730650_create_add_uuid_extensions_table.ts` - Extension UUID PostgreSQL
2. `1763650749216_create_create_users_table.ts` - Table utilisateurs
3. `1763652783105_create_create_landing_pages_table.ts` - Landing pages
4. `1763652784338_create_create_links_table.ts` - Liens
5. `1763665533851_create_add_utm_parameters_to_links_table.ts` - Paramètres UTM
6. `1763718588085_create_create_utm_presets_table.ts` - Presets UTM
7. `1763718615858_create_add_custom_params_to_links_table.ts` - Paramètres custom
8. `1763780641017_create_create_link_clicks_table.ts` - Tracking clics
9. `1763782525212_create_add_geolocation_to_link_clicks_table.ts` - Géolocalisation

**Indexes**:

- `link_clicks`: Index composites sur `(link_id, clicked_at)`, `(user_id, clicked_at)`, `clicked_at`
- Optimisation des requêtes analytics

### Modèles Lucid

- `User` - Utilisateurs
- `LandingPage` - Pages de liens
- `Link` - Liens individuels
- `LinkClick` - Clics trackés
- `UtmPreset` - Presets UTM réutilisables

### Routes

**Publiques**:

- `/` - Page d'accueil
- `/:slug` - Redirection short link OU affichage landing page publique
- `/login` - Connexion
- `/register` - Inscription

**Protégées** (authentification requise):

- `/dashboard` - Tableau de bord
- `/pages` - Gestion landing pages
- `/pages/create` - Créer landing page
- `/pages/:id/edit` - Éditer landing page
- `/links` - Liste des liens
- `/links/create` - Créer lien
- `/links/:id/edit` - Éditer lien
- `/analytics` - Dashboard analytics
- `/qr/generate` - Générateur QR code
- `/utm-presets` - Gestion presets UTM
- `/shop` - Boutique (placeholder)

---

## Commits Principaux

### Analytics System

- `e95e0d6` - feat(analytics): add geographic breakdown with country and city statistics
- `b8bd960` - feat(analytics): integrate geolocation service into click tracking
- `d02726b` - feat(analytics): add IP geolocation service and extended tracking
- `900d6e9` - feat(analytics): add comprehensive analytics dashboard with charts
- `a9a6788` - feat(analytics): implement comprehensive click tracking system

### Links & Validation

- `b920037` - feat(links): add URL validation and conditional field disabling
- `5214afe` - docs: add v1.2.1 changelog entry for URL validation improvements

### Setup

- `7ab53a0` - docs: add Neon PostgreSQL setup documentation
- `0b97652` - docs: add comprehensive README with setup instructions

---

## Améliorations Futures Possibles

### Analytics

- ⏳ Filtres de période (7j, 30j, 90j, tout)
- ⏳ Export CSV des données analytics
- ⏳ Carte géographique interactive (Mapbox/Leaflet)
- ⏳ Graphiques par fuseau horaire
- ⏳ Comparaison de périodes (période actuelle vs précédente)
- ⏳ Alertes email pour seuils de clics

### Dashboard

- ⏳ Migration vers shadcn/ui chart components (design system unifié)
- ⏳ Dark mode complet
- ⏳ Raccourcis clavier
- ⏳ Recherche globale

### Liens

- ⏳ Liens programmés (activation/désactivation par date)
- ⏳ A/B testing automatique (rotation d'URLs)
- ⏳ Liens passwordés
- ⏳ Liens expirables (date d'expiration)
- ⏳ Deeplinks iOS/Android

### Monétisation

- ⏳ Plans premium (plus de liens, analytics avancés)
- ⏳ Custom domains
- ⏳ Suppression du branding Skypy
- ⏳ API publique pour intégrations

### Sécurité

- ⏳ Rate limiting sur création de liens
- ⏳ Détection de spam/malware URLs
- ⏳ 2FA (authentification à deux facteurs)
- ⏳ Logs d'audit utilisateur

---

## Statut du Projet

**Version**: 1.2.1
**Date**: 22 novembre 2024
**Statut**: ✅ **Fonctionnel et prêt pour production**

Toutes les fonctionnalités principales sont implémentées et testées :

- ✅ Authentification et gestion utilisateur
- ✅ Landing pages personnalisées
- ✅ Gestion de liens avec short codes
- ✅ Paramètres UTM et tracking marketing
- ✅ Analytics complet avec géolocalisation
- ✅ Dashboard avec visualisations riches
- ✅ Générateur de QR codes

Le projet est **prêt pour déploiement** sur Railway avec base de données Neon PostgreSQL.
