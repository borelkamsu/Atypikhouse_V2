# Utiliser l'image Node.js officielle
FROM node:20-alpine AS base

# Installer les dépendances nécessaires
RUN apk --no-cache add bash

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer toutes les dépendances (incluant devDependencies pour le build)
RUN npm install

# Copier le code source
COPY . .

# Créer le dossier uploads pour les images
RUN mkdir -p uploads && chmod 777 uploads

# Build de l'application pour la production
RUN npm run build

# Supprimer les devDependencies après le build pour réduire la taille
RUN npm prune --production

# Exposer le port
EXPOSE 3000

# Définir les variables d'environnement
ENV NODE_ENV=production
ENV PORT=3000

# Commande pour démarrer l'application
CMD ["npm", "start"]


