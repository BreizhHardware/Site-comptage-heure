# Plateforme de Comptage d'Heures

Une application web moderne pour la gestion des heures travaillées dans un club scolaire ou une organisation similaire. Permet aux membres de saisir leurs heures, aux administrateurs de valider les demandes, et de gérer les utilisateurs et les paramètres du club.

## Fonctionnalités

- **Authentification sécurisée** : Connexion avec NextAuth.js
- **Gestion des rôles** : Membres, Administrateurs, Super Administrateurs
- **Saisie d'heures** : Interface intuitive pour ajouter des heures travaillées
- **Validation des heures** : Système d'approbation par les administrateurs
- **Gestion des utilisateurs** : Création, suppression et gestion des comptes
- **Paramètres du club** : Configuration du nom et du logo
- **Export de données** : Export CSV et Excel des heures validées
- **Thème sombre/clair** : Support automatique du thème selon les préférences système
- **Design responsive** : Optimisé pour mobile et desktop
- **Notifications** : Toasts pour les actions utilisateur

## Technologies utilisées

- **Framework** : Next.js 15 (App Router)
- **Langage** : TypeScript
- **Base de données** : SQLite avec Prisma ORM
- **Authentification** : NextAuth.js
- **UI** : Tailwind CSS + shadcn/ui + Radix UI
- **Gestionnaire de paquets** : pnpm
- **Déploiement** : Compatible Docker

## Prérequis

- Node.js 18+
- pnpm

## Installation

1. **Cloner le repository**

   ```bash
   git clone https://github.com/breizhhardware/site-comptage-heure.git
   cd site-comptage-heure
   ```

2. **Installer les dépendances**

   ```bash
   pnpm install
   ```

3. **Configuration de la base de données**

   ```bash
   # Appliquer le schéma Prisma
   npx prisma db push

   # (Optionnel) Générer le client Prisma
   npx prisma generate
   ```

4. **Variables d'environnement**

   Créer un fichier `.env.local` à la racine :

   ```env
   NEXTAUTH_SECRET=votre-secret-très-long-et-sécurisé
   NEXTAUTH_URL=http://localhost:3000
   ```

5. **Créer un Super Administrateur**
   ```bash
   node scripts/create-super-admin.js
   ```

## Utilisation

### Démarrage en développement

```bash
pnpm dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

### Première connexion

- Utilisez les identifiants du Super Administrateur créé
- Configurez le nom et le logo du club dans l'admin
- Créez des comptes pour les administrateurs et membres

### Rôles et permissions

- **Membre** : Peut saisir et consulter ses propres heures
- **Administrateur** : Peut valider/rejeter les heures de tous, gérer les paramètres
- **Super Administrateur** : Peut créer des comptes admin/membre, supprimer des utilisateurs

## Scripts disponibles

- `pnpm dev` : Serveur de développement
- `pnpm build` : Build de production
- `pnpm start` : Serveur de production
- `pnpm format` : Formatage du code avec Prettier

## Structure du projet

```
├── app/                    # Pages Next.js (App Router)
│   ├── api/               # Routes API
│   ├── admin/             # Page administration
│   ├── dashboard/         # Tableau de bord
│   ├── login/             # Page de connexion
│   └── layout.tsx         # Layout principal
├── components/            # Composants réutilisables
│   ├── ui/               # Composants shadcn/ui
│   └── Header.tsx        # Header de l'application
├── lib/                  # Utilitaires
│   ├── auth.ts           # Configuration NextAuth
│   ├── prisma.ts         # Client Prisma
│   └── use-toast.ts      # Hook pour les toasts
├── prisma/               # Schéma et migrations Prisma
└── public/               # Assets statiques
```

## API Routes

- `GET/POST /api/hours` : Gestion des heures
- `PUT /api/hours/[id]` : Validation d'une heure
- `DELETE /api/hours/[id]` : Suppression d'une heure
- `GET/PUT /api/settings` : Paramètres du club
- `POST /api/auth/signup` : Création d'utilisateur
- `GET /api/export` : Export des données

## Déploiement

### Avec Docker

1Run le container :

```bash
docker compose up -d
```

Créer un Super Administrateur à l'intérieur du container :

```bash
docker exec -it <container_id> sh
```

Puis exécuter (pensez à modifier le nom d'utilisateur et le mot de passe si nécessaire) :

```bash
node scripts/create-super-admin.js
```

## Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonction`)
3. Commit les changements (`git commit -am 'Ajoute nouvelle fonction'`)
4. Push la branche (`git push origin feature/nouvelle-fonction`)
5. Créer une Pull Request

## Support

Pour toute question ou problème, ouvrir une issue sur GitHub.
