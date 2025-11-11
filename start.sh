#!/bin/bash

# Script de démarrage pour AtypikHouse SSR sur Replit

echo "🚀 Démarrage d'AtypikHouse SSR..."

# Vérifier si les variables d'environnement sont définies
if [ -z "$MONGODB_URI" ]; then
    echo "⚠️  MONGODB_URI non définie, utilisation de .env.local"
fi

if [ -z "$JWT_SECRET" ]; then
    echo "⚠️  JWT_SECRET non définie, utilisation de .env.local"
fi

# Créer le dossier uploads s'il n'existe pas
mkdir -p uploads

# Démarrer l'application en mode développement sur 0.0.0.0:5000 pour Replit
echo "📦 Démarrage de l'application Next.js..."
echo "📍 Port: 5000 | Host: 0.0.0.0"
exec npm run dev -- -p 5000 -H 0.0.0.0


