# 🧟 ZombieLand - Application Web Fullstack

Application web complète pour le parc d'attractions post-apocalyptique ZombieLand, développée dans le cadre d'un projet de formation (Titre Professionnel CDA - Niveau 6).

---

## 📋 Sommaire

* [Présentation du projet](https://claude.ai/chat/d11d278a-b422-4ae0-bbad-553e295c1f69#-pr%C3%A9sentation-du-projet)
* [Architecture globale](https://claude.ai/chat/d11d278a-b422-4ae0-bbad-553e295c1f69#-architecture-globale)
* [Stack technique](https://claude.ai/chat/d11d278a-b422-4ae0-bbad-553e295c1f69#-stack-technique)
* [Structure du projet](https://claude.ai/chat/d11d278a-b422-4ae0-bbad-553e295c1f69#-structure-du-projet)
* [Démarrage rapide](https://claude.ai/chat/d11d278a-b422-4ae0-bbad-553e295c1f69#-d%C3%A9marrage-rapide)
* [Frontend](https://claude.ai/chat/d11d278a-b422-4ae0-bbad-553e295c1f69#-frontend)
* [Backend](https://claude.ai/chat/d11d278a-b422-4ae0-bbad-553e295c1f69#-backend)
* [Authentification](https://claude.ai/chat/d11d278a-b422-4ae0-bbad-553e295c1f69#-authentification)
* [Tests](https://claude.ai/chat/d11d278a-b422-4ae0-bbad-553e295c1f69#-tests)
* [Comptes de test](https://claude.ai/chat/d11d278a-b422-4ae0-bbad-553e295c1f69#-comptes-de-test)

---

## 🎯 Présentation du projet

ZombieLand est une application web permettant aux visiteurs de consulter les attractions du parc, de réserver des billets et de gérer leur profil. Un espace administrateur permet de gérer les attractions, les activités, les tarifs et les réservations.

**Fonctionnalités principales :**

* Consultation des attractions et activités du parc
* Réservation de billets avec gestion des tarifs
* Espace utilisateur (inscription, connexion, gestion du profil)
* Back-office administrateur
* Règle métier : annulation de réservation possible uniquement si la visite est à plus de 10 jours (sauf ADMIN)

---

## 🏗 Architecture globale

L'application repose sur une **architecture multicouche répartie** avec une séparation claire entre le frontend et le backend :

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENT (Navigateur)                  │
│              React 18 + TypeScript + MUI v5              │
└───────────────────────┬─────────────────────────────────┘
                        │ HTTP/REST (Axios + JWT)
┌───────────────────────▼─────────────────────────────────┐
│                  BACKEND (API REST)                      │
│         NestJS 11 + TypeScript + Prisma 6                │
│    Controllers │ Services │ Guards │ DTOs │ Modules      │
└───────────────────────┬─────────────────────────────────┘
                        │ ORM (Prisma)
┌───────────────────────▼─────────────────────────────────┐
│                BASE DE DONNÉES                           │
│                   PostgreSQL 15                          │
└─────────────────────────────────────────────────────────┘

        Tous les services sont orchestrés via Docker Compose
```

**Rôle de chaque couche :**


| Couche          | Technologie     | Responsabilité                                              |
| --------------- | --------------- | ------------------------------------------------------------ |
| Présentation   | React + MUI     | Affichage, interactions utilisateur, validation formulaires  |
| Métier         | NestJS Services | Logique applicative, règles métier, contrôle des droits   |
| Accès données | Prisma ORM      | Requêtes sécurisées, migrations, intégrité des données |
| Persistance     | PostgreSQL 15   | Stockage des données                                        |

---

## 🛠 Stack technique

### Frontend


| Catégorie             | Choix technique       | Justification                                                                                                                                           |
| ---------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework              | React 18+             | Framework leader, vaste écosystème, excellente documentation. Permet de créer des interfaces dynamiques et performantes.                             |
| Langage                | TypeScript            | Typage statique, meilleure maintenabilité et détection d'erreurs à la compilation.                                                                   |
| Build tool             | Vite                  | Démarrage ultra-rapide, HMR performant, optimisé pour React + TypeScript.                                                                             |
| Routing                | React Router V6       | Standard de facto pour la navigation côté client en React.                                                                                            |
| State Management       | Zustand               | Plus léger que Redux (3 Ko vs 1.6 MB), API simple et intuitive, pas de boilerplate. Parfait pour la gestion d'état (auth, réservations, activités). |
| UI Library             | Material UI (MUI v5)  | Composants modernes, accessibles (WCAG), responsive par défaut. Gain de temps considérable, personnalisable pour l'univers ZombieLand.                |
| Animations             | Motion for React      | Bibliothèque d'animation déclarative et performante, optimisée pour React. Renforce l'immersion dans l'univers ZombieLand.                           |
| Communication API      | Axios                 | Meilleur support navigateurs, intercepteurs pour JWT, gestion d'erreurs centralisée, annulation de requêtes.                                          |
| Validation formulaires | React Hook Form + Zod | Performances optimales (pas de re-render inutile), validation de schéma typée avec Zod.                                                               |
| Gestion des dates      | date-fns              | Légère, modulaire, immuable, compatible TypeScript.                                                                                                   |

### Backend


| Catégorie        | Choix technique         |
| ----------------- | ----------------------- |
| Framework         | NestJS 11               |
| Langage           | TypeScript              |
| ORM               | Prisma 6                |
| Base de données  | PostgreSQL 15           |
| Authentification  | JWT                     |
| Documentation API | Swagger / OpenAPI 3.0   |
| Tests             | Jest                    |
| Conteneurisation  | Docker + Docker Compose |

---

## 📁 Structure du projet

```
zombieland/
├── frontend/
│   ├── src/
│   │   ├── @types/          # Interfaces des types typescript
│   │   ├── assets/          # Images, fonts, icônes
│   │   ├── components/      # Composants réutilisables
│   │   ├── context/         # Regroupe les contextes
│   │   ├── pages/           # Pages de l'application
│   │   ├── functions/       # Fonctions génériques de l'app
│   │   ├── store/           # État global (Zustand)
│   │   ├── services/        # Appels API (Axios)
│   │   ├── hooks/           # Hooks personnalisés
│   │   ├── themes/           # Thèmes personnalisés avec Material UI
│   │   └── utils/           # Fonctions utilitaires
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
│
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma    # Modèles de données
│   │   ├── seed.ts          # Script de seeding
│   │   └── migrations/      # Historique des migrations
│   ├── src/
│   │   ├── generated/       # DTOs générés automatiquement
│   │   ├── modules(activités, authentification, reservations...)/
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── api-spec.yml         # Spécification OpenAPI 3.0
│
├── docker-compose.yml
└── README.md
```

---

## 🚀 Démarrage rapide

### Prérequis

* Docker et Docker Compose installés
* Fichier `.env` configuré à la racine du projet

### Lancer le projet

Depuis la **racine du projet** :

```bash
# Démarrer tous les services (PostgreSQL, API, Frontend, Adminer)
docker compose up -d
```

C'est tout ! Le frontend et le backend démarrent automatiquement.

### Configuration initiale (uniquement si base de données vide)

```bash
# 1. Générer les DTOs depuis l'API Spec (en local)
cd backend
npm run generate:api

# 2. Entrer dans le conteneur backend
docker compose exec zombieland-api sh

# 3. Dans le conteneur, exécuter :
npx prisma generate          # Générer le client Prisma
npx prisma migrate dev       # Créer les tables
npm run seed                 # Alimenter la base de données
exit                         # Sortir du conteneur
```

> ⚠️ Ces commandes sont optionnelles et uniquement nécessaires pour configurer une nouvelle base de données.

---

## 🖥 Frontend

### URLs d'accès

* **Application** : http://localhost:5173

### Commandes utiles

```bash
cd frontend

# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev

```

### Variables d'environnement

Créer un fichier `.env` dans le dossier `frontend/` :

```env
VITE_API_URL=http://localhost:3001/api/v1
```

---

## ⚙️ Backend

### URLs d'accès

* **API** : http://localhost:3001/api/v1
* **Swagger UI** : http://localhost:3001/swagger-ui
* **Adminer** : http://localhost:8080

### Variables d'environnement

Créer un fichier `.env` dans le dossier `backend/` en suivant le .env.example 


### Commandes utiles

```bash
# Entrer dans le conteneur Docker
docker compose exec zombieland-api sh

# Lancer le serveur en mode dev (déjà lancé par défaut)
npm run start:dev

# Ouvrir Prisma Studio (interface graphique BDD)
npx prisma studio

# Relancer le seeding
npm run seed

# Lancer les tests
npm test
```

### Commandes Prisma

```bash
# Voir l'état des migrations
npx prisma migrate status

# Créer une nouvelle migration
npx prisma migrate dev --name nom_migration

# Réinitialiser la BDD (⚠️ supprime les données)
npx prisma migrate reset
```

---



## 🔐 Authentification

L'API utilise **JWT (JSON Web Token)**. Pour les endpoints protégés, inclure le header suivant :

```
Authorization: Bearer <votre_token_jwt>
```

Côté frontend, Axios est configuré avec un intercepteur qui injecte automatiquement le token dans chaque requête et gère les erreurs d'authentification (401) de manière centralisée.

---

## 🧪 Tests

### Lancer tous les tests

```bash
# Dans le conteneur Docker
docker compose exec zombieland-api npm test

# En local
cd backend
npm test
```

### Tests spécifiques

```bash
# Tests du service Users
npm test users.service.spec.ts

# Tests du service Reservations
npm test reservations.service.spec.ts

# Mode watch
npm test -- --watch

# Couverture de code
npm test -- --coverage
```

### Tests disponibles

* **UsersService** : findAll, findOne, findUserReservations, remove
* **ReservationsService** : création avec validation (dates, parc ouvert/fermé, calcul du total), récupération, mise à jour du statut, annulation avec règle J-10, contrôles d'accès CLIENT/ADMIN

---

## 👥 Comptes de test

Après le seeding, vous pouvez vous connecter avec :


| Email                | Mot de passe | Rôle  |
| -------------------- | ------------ | ------ |
| admin@zombieland.com | password123  | ADMIN  |
| jean@zombieland.com  | password123  | CLIENT |
| marie@zombieland.com | password123  | CLIENT |

> ⚠️ Ces comptes sont uniquement destinés aux environnements de développement et de test.

---

## 📝 Points clés

* Les **DTOs** sont générés automatiquement depuis `api-spec.yml` avec `npm run generate:api`
* Le **seeding** crée 4 users, 5 catégories, 4 attractions, 5 activités, 31 dates, 5 tarifs, 4 réservations
* **Règle métier** : annulation de réservation possible uniquement si la visite est à plus de 10 jours (sauf ADMIN)
* La documentation complète de l'API est disponible sur **Swagger UI**
* Les mots de passe sont stockés **hashés** en base de données (bcrypt)
