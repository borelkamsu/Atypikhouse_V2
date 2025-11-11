# 🚀 Guide de Déploiement sur Render

## Étape 1 : Préparer votre projet

### 1.1 Vérifier le fichier package.json

Assurez-vous que votre `package.json` contient :

```json
{
  "engines": {
    "node": "20.x"
  },
  "scripts": {
    "dev": "next dev -p 5000 -H 0.0.0.0",
    "build": "next build",
    "start": "next start -p 5000",
    "lint": "next lint"
  }
}
```

### 1.2 Créer un fichier render.yaml (optionnel mais recommandé)

Créez un fichier `render.yaml` à la racine du projet :

```yaml
services:
  - type: web
    name: atypikhouse
    env: node
    region: oregon
    buildCommand: npm install && npm run build
    startCommand: npm run start
    envVars:
      - key: NODE_VERSION
        value: 20.19.3
      - key: NODE_ENV
        value: production
```

### 1.3 Pousser votre code sur GitHub

```bash
# Si vous n'avez pas encore de repo GitHub
git init
git add .
git commit -m "Préparer le déploiement sur Render"
git branch -M main
git remote add origin https://github.com/VOTRE-USERNAME/atypikhouse.git
git push -u origin main
```

---

## Étape 2 : Créer un compte Render

1. Allez sur [https://render.com](https://render.com)
2. Créez un compte gratuit (ou connectez-vous avec GitHub)

---

## Étape 3 : Créer un nouveau Web Service

1. **Dashboard Render** → Cliquez sur **"New +"** → **"Web Service"**
2. **Connectez votre dépôt GitHub**
3. **Sélectionnez votre projet** atypikhouse
4. **Configurez les paramètres** :

   - **Name** : `atypikhouse` (ou le nom de votre choix)
   - **Region** : `Oregon (US West)` ou la région la plus proche de vous
   - **Branch** : `main`
   - **Runtime** : `Node`
   - **Build Command** : `npm install && npm run build`
   - **Start Command** : `npm run start`
   - **Plan** : Choisissez **Free** pour commencer

---

## Étape 4 : Configurer les Variables d'Environnement

Dans la section **Environment** du dashboard Render, ajoutez ces variables :

### Variables Obligatoires

| Clé | Valeur | Description |
|-----|--------|-------------|
| `MONGODB_URI` | `mongodb+srv://lama:lama@cluster0.254tgqb.mongodb.net/BdAtypik?retryWrites=true&w=majority` | Connection MongoDB Atlas |
| `JWT_SECRET` | `atypikhouse-jwt-secret-key-change-in-production-XXXX` | **⚠️ CHANGEZ CETTE VALEUR !** Utilisez une clé aléatoire forte |
| `SESSION_SECRET` | `atypikhouse-session-secret-change-in-production-XXXX` | **⚠️ CHANGEZ CETTE VALEUR !** Utilisez une clé aléatoire forte |
| `NODE_ENV` | `production` | Environnement de production |

### Variables Cloudinary (si vous utilisez les uploads d'images)

| Clé | Valeur | Description |
|-----|--------|-------------|
| `CLOUDINARY_CLOUD_NAME` | Votre Cloud Name | Depuis votre dashboard Cloudinary |
| `CLOUDINARY_API_KEY` | Votre API Key | Depuis votre dashboard Cloudinary |
| `CLOUDINARY_API_SECRET` | Votre API Secret | Depuis votre dashboard Cloudinary |

### Variables Publiques (Frontend)

| Clé | Valeur | Description |
|-----|--------|-------------|
| `NEXT_PUBLIC_APP_URL` | `https://atypikhouse.onrender.com` | **Remplacez** par votre URL Render |
| `NEXT_PUBLIC_API_URL` | `https://atypikhouse.onrender.com/api` | **Remplacez** par votre URL Render |

### Variables Optionnelles (Email)

| Clé | Valeur | Description |
|-----|--------|-------------|
| `SMTP_HOST` | `smtp.gmail.com` | Serveur SMTP (si vous utilisez les emails) |
| `SMTP_PORT` | `587` | Port SMTP |
| `SMTP_USER` | `votre-email@gmail.com` | Email pour les notifications |
| `SMTP_PASS` | `votre-mot-de-passe-app` | Mot de passe d'application Gmail |

---

## Étape 5 : Générer des Secrets Sécurisés

**⚠️ IMPORTANT** : Ne gardez PAS les secrets par défaut en production !

### Générer des secrets forts avec Node.js :

```bash
# Ouvrez un terminal et exécutez :
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Répétez cette commande 2 fois pour générer :
1. Un `JWT_SECRET` unique
2. Un `SESSION_SECRET` unique

---

## Étape 6 : Configurer MongoDB Atlas

### 6.1 Whitelist l'IP de Render

1. Allez sur [MongoDB Atlas](https://cloud.mongodb.com)
2. **Network Access** → **Add IP Address**
3. Ajoutez `0.0.0.0/0` (autoriser toutes les IPs)
   
   **Ou mieux** : Utilisez les IPs spécifiques de Render :
   - Allez dans votre Web Service Render
   - Copiez l'IP publique
   - Ajoutez cette IP dans MongoDB Atlas

### 6.2 Vérifier la connection string

Assurez-vous que votre `MONGODB_URI` :
- ✅ Contient le bon username/password
- ✅ Contient le bon nom de base de données (`BdAtypik`)
- ✅ A `retryWrites=true&w=majority` à la fin

---

## Étape 7 : Déployer

1. **Cliquez sur "Create Web Service"**
2. Render va automatiquement :
   - Cloner votre repo
   - Installer les dépendances (`npm install`)
   - Builder l'application (`npm run build`)
   - Démarrer le serveur (`npm run start`)

Le déploiement prend environ **5-10 minutes** la première fois.

---

## Étape 8 : Vérifier le Déploiement

### 8.1 Consulter les logs

Dans votre dashboard Render :
- **Logs** → Vérifiez qu'il n'y a pas d'erreurs
- Cherchez le message : `✓ Ready in XXXms`

### 8.2 Tester votre site

1. Render vous donne une URL : `https://atypikhouse.onrender.com`
2. Ouvrez cette URL dans votre navigateur
3. Testez :
   - ✅ La page d'accueil s'affiche
   - ✅ Vous pouvez vous inscrire/connecter
   - ✅ Les propriétés s'affichent
   - ✅ Les images Cloudinary se chargent

---

## Étape 9 : Domaine Personnalisé (Optionnel)

### 9.1 Ajouter votre domaine

1. **Settings** → **Custom Domains** → **Add Custom Domain**
2. Entrez votre domaine : `www.atypikhouse.com`

### 9.2 Configurer le DNS

Chez votre registrar de domaine (ex: OVH, Namecheap, GoDaddy) :

**Type CNAME** :
```
www  →  atypikhouse.onrender.com
```

**Type A** (pour le domaine racine) :
Render vous donnera une IP spécifique.

### 9.3 Mettre à jour les variables

Changez dans Render :
```
NEXT_PUBLIC_APP_URL=https://www.atypikhouse.com
NEXT_PUBLIC_API_URL=https://www.atypikhouse.com/api
```

---

## Étape 10 : Auto-Deploy (Déploiement Automatique)

Render déploie automatiquement à chaque `git push` sur la branche `main` !

```bash
# Faire des modifications
git add .
git commit -m "Amélioration du site"
git push origin main

# Render déploie automatiquement en quelques minutes
```

---

## 🐛 Dépannage

### Erreur : "Cannot connect to MongoDB"

1. Vérifiez que `MONGODB_URI` est correcte
2. Vérifiez les Network Access dans MongoDB Atlas
3. Testez la connection localement d'abord

### Erreur : "Module not found"

```bash
# Assurez-vous que toutes les dépendances sont dans package.json
npm install --save [package-manquant]
git add package.json package-lock.json
git commit -m "Ajouter dépendance manquante"
git push
```

### Le site est lent

- Le plan **Free** de Render s'endort après 15 min d'inactivité
- Premier chargement peut prendre 30-60 secondes
- Passez au plan **Starter ($7/mois)** pour des performances constantes

### Images Cloudinary ne se chargent pas

1. Vérifiez les variables `CLOUDINARY_*` dans Render
2. Vérifiez que les credentials sont corrects
3. Consultez les logs pour voir les erreurs

---

## 📊 Monitoring

### Voir les métriques

Dans Render :
- **Metrics** → CPU, Mémoire, Requêtes
- **Logs** → Erreurs et warnings
- **Events** → Historique des déploiements

---

## 🔒 Sécurité Production

### Checklist avant la mise en production

- ✅ Changez tous les secrets par défaut
- ✅ Utilisez HTTPS (automatique avec Render)
- ✅ Restreignez les IPs MongoDB si possible
- ✅ Activez 2FA sur votre compte Render
- ✅ Sauvegardez régulièrement votre base de données
- ✅ Surveillez les logs pour détecter les intrusions

---

## 💰 Coûts

### Plan Free (Gratuit)
- ✅ 750 heures/mois
- ✅ SSL automatique
- ⚠️ Le service s'endort après 15 min d'inactivité
- ⚠️ Redémarre en 30-60 secondes

### Plan Starter ($7/mois)
- ✅ Service toujours actif
- ✅ Meilleure performance
- ✅ Plus de RAM/CPU

---

## 🎉 Félicitations !

Votre site **AtypikHouse** est maintenant en ligne sur Render ! 🚀

**URL de test** : `https://atypikhouse.onrender.com`

Pour toute question, consultez la [documentation Render](https://render.com/docs).
