#!/bin/bash

# Script de démarrage pour AtypikHouse SSR

echo "🚀 Démarrage d'AtypikHouse SSR..."

# Vérifier si les variables d'environnement sont définies
if [ -z "$MONGODB_URI" ]; then
    echo "⚠️  MONGODB_URI non définie, utilisation de la valeur par défaut"
    export MONGODB_URI="mongodb://localhost:27017/atypikhouse"
fi

if [ -z "$JWT_SECRET" ]; then
    echo "⚠️  JWT_SECRET non définie, utilisation de la valeur par défaut"
    export JWT_SECRET="atypikhouse-jwt-secret-key"
fi

# Créer le dossier uploads s'il n'existe pas
mkdir -p uploads

# Démarrer l'application
echo "📦 Démarrage de l'application Next.js..."
npm start


