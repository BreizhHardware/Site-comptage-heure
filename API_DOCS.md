# Documentation des API

## Endpoints

### POST /api/auth/signup

- Rôle requis : SUPER_ADMIN
- Description : Créer un compte (membre ou admin)
- Corps : { email: string, password: string, role: 'MEMBER' | 'ADMIN' }

### GET /api/hours

- Rôle requis : MEMBER, ADMIN, SUPER_ADMIN
- Description : Lister les heures (propres pour membre, toutes pour admin)

### POST /api/hours

- Rôle requis : MEMBER
- Description : Ajouter une heure
- Corps : { date: string, duration: number, reason: string }

### PUT /api/hours/[id]

- Rôle requis : ADMIN, SUPER_ADMIN
- Description : Valider ou rejeter une heure
- Corps : { status: 'VALIDATED' | 'REJECTED' }

### GET /api/settings

- Rôle requis : ADMIN, SUPER_ADMIN
- Description : Lire les paramètres du club

### PUT /api/settings

- Rôle requis : ADMIN, SUPER_ADMIN
- Description : Mettre à jour le nom et logo du club
- Corps : { name: string, logo: string }

### GET /api/export?format=csv|excel

- Rôle requis : ADMIN, SUPER_ADMIN
- Description : Exporter les heures en CSV ou Excel
