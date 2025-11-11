# AtypikHouse SSR - Plateforme de Logements Insolites

Une plateforme moderne de location de logements insolites construite avec **Next.js 15**, **TypeScript**, **Tailwind CSS 4** et **MongoDB**, optimisée pour le Server-Side Rendering (SSR).

## 🚀 Fonctionnalités

### Frontend (SSR/CSR Hybride)
- **Server-Side Rendering** pour un SEO optimal et des performances améliorées
- **Client-Side Rendering** pour les interactions dynamiques
- Interface utilisateur moderne et responsive avec Tailwind CSS 4
- Design system cohérent avec palette de couleurs personnalisée
- Navigation fluide avec Next.js App Router
- Composants UI réutilisables (Button, Card, Input, etc.)

### Backend (API Routes Next.js)
- **API Routes** intégrées pour l'authentification et la gestion des données
- **MongoDB** avec Mongoose pour la persistance des données
- **JWT** pour l'authentification sécurisée
- **Modèles de données** complets (User, Property, Review)
- **Upload de fichiers** pour les images de propriétés
- **Validation des données** côté serveur

### Base de Données
- **MongoDB** avec schémas Mongoose optimisés
- **Indexation** pour des performances optimales
- **Relations** entre utilisateurs, propriétés et avis
- **Validation** des données au niveau de la base

### Docker & Déploiement
- **Dockerfile** optimisé pour Next.js
- **Docker Compose** avec MongoDB et Mongo Express
- **Variables d'environnement** configurables
- **Health checks** pour la surveillance
- **Volumes persistants** pour les données

## 🛠️ Technologies

### Frontend
- **Next.js 15** - Framework React avec SSR
- **TypeScript** - Typage statique
- **Tailwind CSS 4** - Framework CSS utilitaire
- **Radix UI** - Composants UI accessibles
- **Lucide React** - Icônes modernes
- **Framer Motion** - Animations fluides

### Backend
- **Next.js API Routes** - API intégrée
- **MongoDB** - Base de données NoSQL
- **Mongoose** - ODM pour MongoDB
- **JWT** - Authentification
- **bcrypt** - Hashage des mots de passe
- **Multer** - Upload de fichiers

### DevOps
- **Docker** - Conteneurisation
- **Docker Compose** - Orchestration
- **MongoDB Express** - Interface d'administration
- **Health Checks** - Surveillance

## 📦 Installation

### Prérequis
- Node.js 18+ 
- Docker et Docker Compose
- MongoDB (optionnel en local)

### Démarrage rapide avec Docker

1. **Cloner le projet**
```bash
git clone <repository-url>
cd atypick-ssr
```

2. **Configurer l'environnement**
```bash
cp env.example .env.local
# Éditer .env.local avec vos configurations
```

3. **Démarrer avec Docker**
```bash
docker-compose up -d
```

4. **Accéder à l'application**
- Application: http://localhost:3000
- MongoDB Express: http://localhost:8081 (admin/admin123)

### Démarrage en développement

1. **Installer les dépendances**
```bash
npm install
```

2. **Configurer l'environnement**
```bash
cp env.example .env.local
```

3. **Démarrer MongoDB** (si pas en Docker)
```bash
# Installer et démarrer MongoDB localement
```

4. **Lancer le serveur de développement**
```bash
npm run dev
```

## 🏗️ Architecture

```
atypick-ssr/
├── src/
│   ├── app/                    # App Router Next.js
│   │   ├── api/               # API Routes
│   │   │   ├── auth/          # Routes d'authentification
│   │   │   ├── properties/    # Routes des propriétés
│   │   │   └── uploads/       # Routes d'upload
│   │   ├── auth/              # Page d'authentification
│   │   ├── properties/        # Page des propriétés
│   │   ├── host/              # Page devenir hôte
│   │   ├── layout.tsx         # Layout principal
│   │   └── page.tsx           # Page d'accueil
│   ├── components/            # Composants React
│   │   ├── ui/               # Composants UI de base
│   │   └── layout/           # Composants de layout
│   ├── lib/                  # Utilitaires
│   │   ├── auth/             # Utilitaires d'authentification
│   │   └── db/               # Configuration base de données
│   ├── models/               # Modèles Mongoose
│   └── types/                # Types TypeScript
├── public/                   # Assets statiques
├── uploads/                  # Images uploadées
├── Dockerfile               # Configuration Docker
├── docker-compose.yml       # Orchestration Docker
└── package.json             # Dépendances
```

## 🔐 Authentification

L'application utilise JWT pour l'authentification avec :
- **Inscription** : `/api/auth/register`
- **Connexion** : `/api/auth/login`
- **Cookies sécurisés** pour la persistance des sessions
- **Hashage bcrypt** pour les mots de passe

## 🏠 Gestion des Propriétés

### Types de logements supportés
- Cabanes dans les arbres
- Yourtes et tipis
- Habitations flottantes
- Dômes géodésiques
- Roulottes
- Igloos
- Autres logements insolites

### Fonctionnalités
- **Recherche avancée** avec filtres
- **Pagination** pour les performances
- **Upload d'images** multiples
- **Système d'avis** et notes
- **Gestion des disponibilités**

## 🎨 Design System

### Palette de couleurs
- **Primary** : Vert nature (#2d7a4f)
- **Secondary** : Terre cuite (#cc7a5a)
- **Accent** : Or chaleureux (#f59e0b)
- **Neutral** : Gris sophistiqué

### Typographie
- **Headings** : Playfair Display (serif)
- **Body** : Inter (sans-serif)

### Composants
- Boutons avec variantes (default, outline, ghost)
- Cartes avec ombres et hover effects
- Formulaires avec validation
- Navigation responsive

## 🚀 Déploiement

### Production avec Docker
```bash
# Build de l'image
docker build -t atypikhouse-ssr .

# Démarrage en production
docker-compose -f docker-compose.prod.yml up -d
```

### Variables d'environnement de production
```env
NODE_ENV=production
MONGODB_URI=mongodb://your-mongodb-uri
JWT_SECRET=your-secure-jwt-secret
SESSION_SECRET=your-secure-session-secret
```

## 📊 Performance

### Optimisations SSR
- **Hydration** optimisée pour les composants interactifs
- **Code splitting** automatique avec Next.js
- **Image optimization** intégrée
- **Caching** intelligent des pages

### Optimisations Base de Données
- **Indexation** sur les champs de recherche
- **Pagination** pour les grandes collections
- **Projection** des champs nécessaires
- **Aggregation** pour les requêtes complexes

## 🔧 Développement

### Scripts disponibles
```bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run start        # Serveur de production
npm run lint         # Vérification ESLint
npm run type-check   # Vérification TypeScript
```

### Structure des commits
```
feat: nouvelle fonctionnalité
fix: correction de bug
docs: documentation
style: formatage
refactor: refactoring
test: tests
chore: maintenance
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Consulter la documentation
- Contacter l'équipe de développement

---

**AtypikHouse SSR** - Découvrez des logements insolites et uniques pour des séjours inoubliables ! 🏡✨
