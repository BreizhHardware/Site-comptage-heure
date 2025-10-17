# Configuration Initiale

## Créer le Super Admin

### Méthode 1 : Script Node.js

Exécutez le script pour créer le super admin :

```bash
node scripts/create-super-admin.js
```

Le script crée un utilisateur avec email `superadmin@example.com` et mot de passe `superadmin123` (haché).

### Méthode 2 : Via Prisma Studio

```bash
npx prisma studio
```

Créez manuellement un utilisateur avec role = SUPER_ADMIN.

## Lancer le projet

### Développement

```bash
npm run dev
```

### Production avec Docker

```bash
docker-compose up --build
```

Assurez-vous que le dossier `data` existe pour la DB SQLite.
