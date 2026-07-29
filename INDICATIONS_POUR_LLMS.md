# Indications pour les LLMs - Projet Site de Comptage d'Heures

## Vue d'ensemble du projet

Ce projet est une application web Next.js pour le suivi des heures travaillées dans un club ou une organisation. Elle permet aux utilisateurs de saisir leurs heures, aux administrateurs de valider ou rejeter les demandes, et de gérer les utilisateurs et les paramètres du club.

## Technologies utilisées

- **Framework**: Next.js 15 avec App Router
- **Base de données**: SQLite ou PostgreSQL avec Prisma ORM
- **Authentification**: NextAuth.js
- **UI**: Radix UI avec Tailwind CSS
- **Langage**: TypeScript
- **Gestionnaire de paquets**: pnpm
- **Déploiement**: Docker (optionnel)

## Structure du projet

- `app/`: Pages et API routes Next.js
- `components/`: Composants réutilisables
- `lib/`: Utilitaires, configuration Prisma et auth
- `prisma/`: Schéma de base de données
- `scripts/`: Scripts utilitaires (setup-db.js, create-super-admin.js, etc.)
- `public/`: Assets statiques
- `types/`: Types TypeScript personnalisés

## Modèles de données

- **User**: Utilisateurs avec email, mot de passe, rôle, prénom, nom
- **Hour**: Entrées d'heures avec date, durée, raison, statut
- **ClubSettings**: Paramètres du club (nom, logo)

## Rôles utilisateurs

- **MEMBER**: Peut saisir et voir ses propres heures
- **ADMIN**: Peut valider/rejeter les heures de tous, gérer les paramètres
- **SUPER_ADMIN**: Peut créer des comptes admin/membre, supprimer des utilisateurs

## Configuration de la base de données

Le projet supporte deux bases de données via les variables d'environnement :

| Variable            | Description                           | Valeur SQLite              | Valeur PostgreSQL                      |
|---------------------|---------------------------------------|----------------------------|----------------------------------------|
| `DATABASE_PROVIDER` | Fournisseur de base de données        | `sqlite`                   | `postgresql`                           |
| `DATABASE_URL`      | URL de connexion                      | `file:./prisma/data/dev.db`| `postgresql://user:pass@host:5432/db`  |

Le fichier `prisma/schema.prisma` a `provider = "sqlite"` par défaut dans git. Le script `scripts/setup-db.js` met à jour ce provider en fonction de `DATABASE_PROVIDER` avant d'appliquer les changements.

### Changement de provider

Toujours utiliser `node scripts/setup-db.js` plutôt que d'appeler directement `prisma db push`, car le script met à jour le provider dans `schema.prisma` avant d'appliquer le schéma.

## Commandes importantes

- `pnpm dev`: Lancer le serveur de développement
- `pnpm build`: Construire pour la production
- `pnpm start`: Lancer en production
- `node scripts/setup-db.js`: Configurer la DB selon `DATABASE_PROVIDER` et appliquer le schéma
- `node scripts/setup-db.js --generate-only`: Mettre à jour le schéma + générer le client Prisma uniquement
- `node scripts/setup-db.js --push-only`: Appliquer le schéma à la DB uniquement
- `npx prisma studio`: Interface graphique pour la DB

## Points d'attention pour les LLMs

- Utiliser pnpm pour toutes les commandes npm
- Utiliser `node scripts/setup-db.js` plutôt que `npx prisma db push` directement
- Ne jamais modifier le provider dans `schema.prisma` manuellement ; passer par `DATABASE_PROVIDER` + `setup-db.js`
- Les heures sont stockées en minutes (entier)
- L'authentification utilise NextAuth avec des sessions
- Les fichiers uploadés vont dans `public/uploads/`
- Le premier compte créé est SUPER_ADMIN
- Vérifier les erreurs Prisma après changements de schéma

## Déploiement Docker

- `docker-compose.yml` : Déploiement SQLite (image pré-construite depuis ghcr.io)
- `docker-compose.postgresql.yml` : Déploiement PostgreSQL (build local + service postgres)

## API Routes

- `/api/auth/[...nextauth]`: Authentification
- `/api/hours`: CRUD des heures
- `/api/settings`: Gestion des paramètres club
- `/api/upload`: Upload de fichiers
- `/api/export`: Export CSV/Excel
- `/api/users/[id]`: Gestion utilisateurs

## Composants UI

Utilise shadcn/ui basé sur Radix UI pour une cohérence.

## Sécurité

- Mots de passe hashés avec bcrypt
- Sessions sécurisées
- Rôles et permissions strictes

## Développement

- Utiliser TypeScript strictement
- Respecter les conventions de nommage
- Tester les changements dans le navigateur et via les API
