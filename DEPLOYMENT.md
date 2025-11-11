# Guide de Déploiement - AtypikHouse SSR

## 🚀 Déploiement avec Docker

### Prérequis
- Docker et Docker Compose installés
- Git installé
- Au moins 2GB de RAM disponible

### 1. Configuration de l'environnement

```bash
# Copier le fichier d'exemple
cp env.example .env.local

# Éditer les variables d'environnement
nano .env.local
```

Variables importantes à configurer :
```env
MONGODB_URI=mongodb://localhost:27017/atypikhouse
JWT_SECRET=votre-secret-jwt-securise
SESSION_SECRET=votre-secret-session-securise
NODE_ENV=production
```

### 2. Démarrage avec Docker

```bash
# Construire et démarrer tous les services
docker-compose up -d

# Vérifier le statut des services
docker-compose ps

# Voir les logs
docker-compose logs -f
```

### 3. Accès aux services

- **Application** : http://localhost:3000
- **MongoDB Express** : http://localhost:8081 (admin/admin123)
- **MongoDB** : localhost:27017

### 4. Initialisation de la base de données

```bash
# Peupler la base avec des données de test
npm run seed
```

## 🌐 Déploiement en Production

### Option 1 : VPS avec Docker

1. **Préparer le serveur**
```bash
# Installer Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Installer Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

2. **Déployer l'application**
```bash
# Cloner le projet
git clone <votre-repo>
cd atypick-ssr

# Configurer l'environnement
cp env.example .env.local
# Éditer .env.local avec vos configurations

# Démarrer en production
docker-compose -f docker-compose.prod.yml up -d
```

### Option 2 : Plateformes Cloud

#### Vercel (Recommandé pour Next.js)
```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel --prod
```

#### Railway
```bash
# Installer Railway CLI
npm i -g @railway/cli

# Déployer
railway up
```

#### Heroku
```bash
# Installer Heroku CLI
# Créer un app Heroku
heroku create atypikhouse-ssr

# Configurer les variables d'environnement
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=votre-mongodb-uri

# Déployer
git push heroku main
```

## 🔧 Configuration MongoDB

### MongoDB Atlas (Recommandé)

1. **Créer un cluster MongoDB Atlas**
2. **Configurer l'accès réseau** (0.0.0.0/0 pour le développement)
3. **Créer un utilisateur de base de données**
4. **Obtenir l'URI de connexion**

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/atypikhouse?retryWrites=true&w=majority
```

### MongoDB Local

```bash
# Installer MongoDB
sudo apt-get install mongodb

# Démarrer le service
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

## 🔒 Sécurité

### Variables d'environnement critiques
- `JWT_SECRET` : Utiliser un secret fort (32+ caractères)
- `SESSION_SECRET` : Secret différent du JWT
- `MONGODB_URI` : URI sécurisée avec authentification

### Firewall
```bash
# Ouvrir uniquement les ports nécessaires
sudo ufw allow 3000  # Application
sudo ufw allow 27017 # MongoDB (si local)
sudo ufw enable
```

### SSL/TLS
```bash
# Installer Certbot pour Let's Encrypt
sudo apt-get install certbot

# Obtenir un certificat SSL
sudo certbot certonly --standalone -d votre-domaine.com
```

## 📊 Monitoring

### Health Checks
L'application expose un endpoint de santé :
```
GET /api/health
```

### Logs
```bash
# Voir les logs de l'application
docker-compose logs -f app

# Voir les logs MongoDB
docker-compose logs -f mongodb
```

### Métriques
- **MongoDB Express** : Interface web pour surveiller la base
- **Docker Stats** : `docker stats`
- **Système** : `htop`, `df -h`

## 🔄 Mise à jour

### Avec Docker
```bash
# Arrêter les services
docker-compose down

# Récupérer les dernières modifications
git pull origin main

# Reconstruire et redémarrer
docker-compose up -d --build
```

### Sans Docker
```bash
# Arrêter l'application
pm2 stop atypikhouse-ssr

# Récupérer les modifications
git pull origin main

# Installer les dépendances
npm install

# Reconstruire
npm run build

# Redémarrer
pm2 start atypikhouse-ssr
```

## 🚨 Dépannage

### Problèmes courants

1. **Port déjà utilisé**
```bash
# Vérifier les ports utilisés
netstat -tulpn | grep :3000

# Tuer le processus
sudo kill -9 <PID>
```

2. **MongoDB ne démarre pas**
```bash
# Vérifier les logs
docker-compose logs mongodb

# Redémarrer le service
docker-compose restart mongodb
```

3. **Application ne répond pas**
```bash
# Vérifier les logs
docker-compose logs app

# Redémarrer l'application
docker-compose restart app
```

### Support
- Vérifier les logs : `docker-compose logs -f`
- Tester l'API : `curl http://localhost:3000/api/health`
- Vérifier la base : `docker-compose exec mongodb mongosh`

## 📝 Checklist de déploiement

- [ ] Variables d'environnement configurées
- [ ] Base de données accessible
- [ ] SSL/TLS configuré (production)
- [ ] Firewall configuré
- [ ] Monitoring en place
- [ ] Sauvegarde configurée
- [ ] Tests effectués
- [ ] Documentation mise à jour


