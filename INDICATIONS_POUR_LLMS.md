# Indications pour les LLMs - Projet Site de Comptage d'Heures

## Vue d'ensemble du projet

Ce projet est une application web Next.js pour le suivi des heures travaillées dans un club ou une organisation. Elle permet aux utilisateurs de saisir leurs heures, aux administrateurs de valider ou rejeter les demandes, et de gérer les utilisateurs et les paramètres du club.

## Technologies utilisées

- **Framework**: Next.js 15 avec App Router
- **Base de données**: SQLite avec Prisma ORM
- **Authentification**: NextAuth.js
- **UI**: Radix UI avec Tailwind CSS
- **Langage**: TypeScript
- **Gestionnaire de paquets**: pnpm
- **Déploiement**: Docker (optionnel)

## Structure du projet

- `app/`: Pages et API routes Next.js
- `components/`: Composants réutilisables
- `lib/`: Utilitaires, configuration Prisma et auth
- `prisma/`: Schéma de base de données et migrations
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

## Commandes importantes

- `pnpm dev`: Lancer le serveur de développement
- `pnpm build`: Construire pour la production
- `pnpm start`: Lancer en production
- `npx prisma db push`: Appliquer les changements de schéma à la DB
- `npx prisma generate`: Régénérer le client Prisma
- `npx prisma studio`: Interface graphique pour la DB

## Points d'attention pour les LLMs

- Utiliser pnpm pour toutes les commandes npm
- Le projet utilise SQLite, donc pas de migrations Prisma traditionnelles ; utiliser `db push`
- Les heures sont stockées en minutes (entier)
- L'authentification utilise NextAuth avec des sessions
- Les fichiers uploadés vont dans `public/uploads/`
- Le premier compte créé est SUPER_ADMIN
- Vérifier les erreurs Prisma après changements de schéma

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
