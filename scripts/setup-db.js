#!/usr/bin/env node
/**
 * Script de configuration de la base de données.
 * Adapte le schéma Prisma selon DATABASE_PROVIDER (sqlite ou postgresql),
 * régénère le client Prisma, puis applique le schéma à la base de données.
 *
 * Variables d'environnement :
 *   DATABASE_PROVIDER  - "sqlite" (défaut) ou "postgresql"
 *   DATABASE_URL       - URL de connexion à la base de données
 *
 * Options CLI :
 *   --generate-only    - Met à jour le schéma et génère le client uniquement (sans db push)
 *   --push-only        - Applique le schéma uniquement (sans mise à jour du schéma ni generate)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const args = process.argv.slice(2);
const generateOnly = args.includes('--generate-only');
const pushOnly = args.includes('--push-only');

const provider = process.env.DATABASE_PROVIDER || 'sqlite';

if (provider !== 'sqlite' && provider !== 'postgresql') {
  console.error(
    `Fournisseur de base de données invalide : "${provider}". Utilisez "sqlite" ou "postgresql".`
  );
  process.exit(1);
}

const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
const prismaBin = path.join(__dirname, '..', 'node_modules', 'prisma', 'build', 'index.js');

if (!pushOnly) {
  // Mettre à jour le provider dans schema.prisma
  let schema = fs.readFileSync(schemaPath, 'utf8');
  schema = schema.replace(
    /^(\s*provider\s*=\s*)"(sqlite|postgresql)"/m,
    `$1"${provider}"`
  );
  fs.writeFileSync(schemaPath, schema);
  console.log(`✓ Schéma Prisma configuré pour : ${provider}`);

  // Régénérer le client Prisma
  execSync(`node "${prismaBin}" generate`, { stdio: 'inherit' });
}

if (!generateOnly) {
  // Appliquer le schéma à la base de données
  execSync(`node "${prismaBin}" db push`, { stdio: 'inherit' });
}
