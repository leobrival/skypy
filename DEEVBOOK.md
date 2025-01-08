# Skypy - Cartes de Visite Connectées

## Vision du Projet

Skypy est une plateforme moderne de cartes de visite numériques qui réinvente la façon dont nous partageons nos informations professionnelles. Inspirée par la simplicité de Linktree et l'expérience utilisateur fluide de Bento.me, notre solution offre une approche innovante pour créer et partager des profils professionnels digitaux.

## Caractéristiques Principales

### 1. Création de Profil Digital

- Interface intuitive et moderne
- Personnalisation complète du design
- Support multi-langues
- Intégration de médias (photos, vidéos, logos)
- Liens vers réseaux sociaux et portfolios

### 2. Intégration Physique-Digital

- Compatible avec les cartes NFC
- Support des tags QR Code
- Intégration avec Apple Wallet et Google Wallet
- Cartes de visite physiques connectées

### 3. Fonctionnalités Avancées

- Analytics en temps réel
- Gestion des contacts
- Partage facile via liens courts personnalisés
- Mise à jour instantanée des informations

## Architecture Technique

### Frontend

- **Next.js** pour une expérience utilisateur optimale
  - Pages statiques et dynamiques
  - Optimisation SEO
  - Performance optimisée
  - Interface responsive

### Backend

- **Supabase** pour une gestion robuste des données
  - Authentication intégrée
  - Base de données PostgreSQL
  - Stockage de fichiers
  - API temps réel

### Infrastructure

- **Docker** pour le déploiement
  - Environnements de développement et production isolés
  - Configuration via docker-compose
  - Auto-hébergement des instances Supabase

## Configuration des Environnements

### Développement

```yaml
version: "3.8"
services:
  supabase-dev:
    image: supabase/supabase-dev
    environment:
      - DB_URL=postgresql://postgres:postgres@db:5432/postgres
    ports:
      - "8000:8000"
    volumes:
      - supabase-dev-data:/var/lib/postgresql/data

  frontend-dev:
    build:
      context: ./frontend
      target: development
    volumes:
      - ./frontend:/app
    ports:
      - "3000:3000"
```

### Production

```yaml
version: "3.8"
services:
  supabase-prod:
    image: supabase/supabase-prod
    environment:
      - DB_URL=postgresql://postgres:postgres@db:5432/postgres
    ports:
      - "8000:8000"
    volumes:
      - supabase-prod-data:/var/lib/postgresql/data

  frontend-prod:
    build:
      context: ./frontend
      target: production
    ports:
      - "3000:3000"
```

## Processus d'Onboarding

1. **Inscription Simple**

   - Email ou réseaux sociaux
   - Création rapide du profil de base

2. **Personnalisation Guidée**

   - Assistant de création de profil
   - Templates pré-conçus
   - Suggestions de personnalisation

3. **Intégration des Services**

   - Connection des réseaux sociaux
   - Configuration des cartes NFC
   - Génération des QR codes

4. **Activation des Fonctionnalités Avancées**
   - Configuration des analytics
   - Personnalisation des liens
   - Intégration wallet

## Roadmap

### Phase 1 - Q1 2025

- MVP avec création de profils basiques
- Intégration Supabase
- Interface utilisateur de base

### Phase 2 - Q2 2025

- Intégration NFC
- Support QR Code
- Analytics de base

### Phase 3 - Q3 2025

- Intégration Apple Wallet
- Intégration Google Walletu- Analytics avancés

### Phase 4 - Q4 2025

- API publique
- Intégrations tierces
- Fonctionnalités entreprise

## Contribution

Les contributions sont les bienvenues ! Voir le fichier CONTRIBUTING.md pour plus de détails.

## Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.
