# 🎯 Configuration Render - Guide Visuel Étape par Étape

## 📍 Étape 1 : Créer le Web Service

### 1.1 Aller sur Render
- 🌐 Allez sur [https://render.com](https://render.com)
- 🔐 Connectez-vous avec votre compte GitHub

### 1.2 Créer un nouveau service
```
Dashboard → Cliquez sur "New +" (en haut à droite) → "Web Service"
```

### 1.3 Connecter votre repository GitHub
```
✅ Autorisez Render à accéder à vos repositories GitHub
✅ Sélectionnez : borelkamsu/Atypikhouse_V2
✅ Cliquez sur "Connect"
```

---

## 📍 Étape 2 : Configurer les Paramètres de Build

Dans la page de configuration, remplissez :

| Champ | Valeur |
|-------|--------|
| **Name** | `atypikhouse` |
| **Region** | `Oregon (US West)` ou `Frankfurt (EU Central)` |
| **Branch** | `main` |
| **Root Directory** | *(laissez vide)* |
| **Environment** | `Node` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm run start` |
| **Plan** | `Free` (pour commencer) |

⚠️ **NE CLIQUEZ PAS ENCORE SUR "CREATE WEB SERVICE"** - Ajoutez d'abord les variables !

---

## 📍 Étape 3 : Ajouter les Variables d'Environnement

### 3.1 Scrollez vers le bas jusqu'à "Environment Variables"

Cliquez sur **"Add Environment Variable"** et ajoutez **TOUTES** ces variables :

---

### ✅ VARIABLES OBLIGATOIRES (8 au total)

#### 1. MONGODB_URI
```
Key:   MONGODB_URI
Value: mongodb+srv://lama:lama@cluster0.254tgqb.mongodb.net/BdAtypik?retryWrites=true&w=majority
```

#### 2. JWT_SECRET
```
Key:   JWT_SECRET
Value: [GÉNÉREZ UN SECRET FORT - Voir ci-dessous]
```

#### 3. SESSION_SECRET
```
Key:   SESSION_SECRET
Value: [GÉNÉREZ UN SECRET FORT - Voir ci-dessous]
```

#### 4. NODE_ENV
```
Key:   NODE_ENV
Value: production
```

#### 5. CLOUDINARY_CLOUD_NAME
```
Key:   CLOUDINARY_CLOUD_NAME
Value: [Votre Cloud Name depuis dashboard Cloudinary]
```

#### 6. CLOUDINARY_API_KEY
```
Key:   CLOUDINARY_API_KEY
Value: [Votre API Key depuis dashboard Cloudinary]
```

#### 7. CLOUDINARY_API_SECRET
```
Key:   CLOUDINARY_API_SECRET
Value: [Votre API Secret depuis dashboard Cloudinary]
```

#### 8. NODE_VERSION (optionnel mais recommandé)
```
Key:   NODE_VERSION
Value: 20.19.3
```

---

### 🔐 Comment Générer des Secrets Forts

**Méthode 1 : Node.js (Recommandé)**
```bash
# Dans votre terminal local, exécutez :
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Méthode 2 : En ligne**
- Allez sur https://randomkeygen.com/
- Copiez une clé "Fort Knox Passwords"

**Exemple de résultat** :
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7
```

Utilisez une clé différente pour `JWT_SECRET` et `SESSION_SECRET` !

---

### 📌 VARIABLES OPTIONNELLES (Frontend URL)

Ces variables seront mises à jour après le déploiement avec votre vraie URL Render.

#### 9. NEXT_PUBLIC_APP_URL (optionnel pour le moment)
```
Key:   NEXT_PUBLIC_APP_URL
Value: https://atypikhouse.onrender.com
```
⚠️ **Remplacez `atypikhouse` par le nom que vous avez choisi**

#### 10. NEXT_PUBLIC_API_URL (optionnel pour le moment)
```
Key:   NEXT_PUBLIC_API_URL
Value: https://atypikhouse.onrender.com/api
```

---

### 📧 VARIABLES EMAIL (Optionnel - Seulement si vous utilisez les emails)

```
Key:   SMTP_HOST
Value: smtp.gmail.com

Key:   SMTP_PORT
Value: 587

Key:   SMTP_USER
Value: votre-email@gmail.com

Key:   SMTP_PASS
Value: votre-mot-de-passe-app-gmail
```

---

## 📍 Étape 4 : Récapitulatif de Vérification

Avant de cliquer sur "Create Web Service", vérifiez que vous avez bien ajouté :

- ✅ `MONGODB_URI` (connection MongoDB Atlas)
- ✅ `JWT_SECRET` (secret fort généré)
- ✅ `SESSION_SECRET` (secret fort généré différent du JWT)
- ✅ `NODE_ENV` = `production`
- ✅ `CLOUDINARY_CLOUD_NAME`
- ✅ `CLOUDINARY_API_KEY`
- ✅ `CLOUDINARY_API_SECRET`
- ✅ `NODE_VERSION` = `20.19.3`

**Total minimum : 8 variables obligatoires**

---

## 📍 Étape 5 : Créer le Web Service

1. **Vérifiez une dernière fois** tous les champs
2. **Cliquez sur "Create Web Service"**
3. Render va automatiquement :
   - 📥 Cloner votre repository
   - 📦 Installer les dépendances (`npm install`)
   - 🏗️ Builder l'application (`npm run build`)
   - 🚀 Démarrer le serveur (`npm run start`)

⏱️ **Temps estimé : 5-10 minutes**

---

## 📍 Étape 6 : Surveiller le Déploiement

### 6.1 Consulter les logs en temps réel

Dans le dashboard Render :
```
Onglet "Logs" → Vous verrez le build en direct
```

### 6.2 Cherchez ces messages de succès

```bash
✓ Compiling /api/properties/featured/route
✓ Compiling /api/properties/categories/route
✓ Compiled successfully
✓ Ready in 2.5s
```

### 6.3 En cas d'erreur

Les erreurs courantes :
- ❌ `Cannot find module` → Dépendance manquante dans package.json
- ❌ `MongoDB connection failed` → Vérifiez MONGODB_URI ou IP whitelist
- ❌ `Build failed` → Vérifiez les logs pour voir l'erreur exacte

---

## 📍 Étape 7 : Tester votre Site

### 7.1 Obtenir votre URL

Render vous donne une URL publique :
```
https://atypikhouse.onrender.com
(ou le nom que vous avez choisi)
```

### 7.2 Tests à effectuer

1. ✅ **Page d'accueil** : `https://votre-app.onrender.com`
   - Les propriétés en vedette s'affichent ?
   - Les types d'habitations s'affichent ?

2. ✅ **Inscription** : `/register`
   - Vous pouvez créer un compte ?

3. ✅ **Connexion** : `/login`
   - Vous pouvez vous connecter ?

4. ✅ **Images** : 
   - Les images Cloudinary se chargent ?

5. ✅ **API** : `https://votre-app.onrender.com/api/properties/featured`
   - Retourne du JSON avec des propriétés ?

---

## 📍 Étape 8 : Configurer MongoDB Atlas (IP Whitelist)

### 8.1 Trouver l'IP de Render

Dans le dashboard Render :
```
Settings → Outbound IPs
```

Vous verrez une liste d'IPs, par exemple :
```
34.123.45.67
35.234.56.78
```

### 8.2 Whitelist les IPs dans MongoDB Atlas

**Méthode Facile (Recommandée pour commencer)** :
1. Allez sur [MongoDB Atlas](https://cloud.mongodb.com)
2. **Network Access** (dans le menu de gauche)
3. Cliquez sur **"Add IP Address"**
4. Ajoutez : `0.0.0.0/0` (autoriser toutes les IPs)
5. Cliquez sur **"Confirm"**

**Méthode Sécurisée (Production)** :
- Ajoutez chaque IP de Render individuellement au lieu de `0.0.0.0/0`

---

## 📍 Étape 9 : Mettre à Jour les URLs Frontend (Important !)

Une fois que votre site fonctionne, vous devez mettre à jour les URLs :

### 9.1 Allez dans Render Dashboard

```
Votre Web Service → Environment (onglet) → Edit
```

### 9.2 Modifiez ces variables

```
NEXT_PUBLIC_APP_URL
Remplacez par: https://VOTRE-VRAI-URL.onrender.com

NEXT_PUBLIC_API_URL
Remplacez par: https://VOTRE-VRAI-URL.onrender.com/api
```

### 9.3 Cliquez sur "Save Changes"

Render va automatiquement redéployer l'application (2-3 minutes).

---

## 📍 Étape 10 : Auto-Deploy (Déploiement Automatique)

### Comment ça marche

À chaque fois que vous faites `git push` sur GitHub :
```bash
git add .
git commit -m "Nouvelles fonctionnalités"
git push origin main
```

Render détecte automatiquement et redéploie votre site ! 🎉

### Désactiver l'auto-deploy (optionnel)

```
Settings → Build & Deploy → Auto-Deploy : OFF
```

---

## 🐛 Dépannage

### ❌ Site ne démarre pas

**Vérifiez les logs** :
```
Dashboard → Logs → Cherchez les erreurs en rouge
```

**Erreurs courantes** :

| Erreur | Solution |
|--------|----------|
| `Cannot connect to MongoDB` | Vérifiez MONGODB_URI et IP whitelist |
| `Port already in use` | Vérifiez que Start Command est `npm run start` |
| `Module not found` | Installez la dépendance et re-push |
| `Build failed` | Vérifiez Node version et package.json |

---

### ❌ Variables d'environnement ne fonctionnent pas

1. **Vérifiez l'orthographe** des noms de variables (sensible à la casse)
2. **Pas d'espaces** dans les noms ou valeurs
3. **Redémarrez** le service après modification :
   ```
   Dashboard → Manual Deploy → Deploy Latest Commit
   ```

---

### ❌ Le site est très lent

Le **plan Free** de Render :
- ⏱️ S'endort après **15 minutes** d'inactivité
- 🐌 Premier chargement peut prendre **30-60 secondes**
- 💰 Passez au plan **Starter ($7/mois)** pour un service toujours actif

---

## ✅ Checklist Finale

Avant de partager votre site en production :

- ✅ Tous les secrets sont différents de ceux par défaut
- ✅ MongoDB Atlas whitelist configurée
- ✅ Cloudinary configuré et fonctionne
- ✅ NEXT_PUBLIC_APP_URL mis à jour avec la vraie URL
- ✅ Tests effectués : inscription, connexion, navigation
- ✅ Images se chargent correctement
- ✅ Pas d'erreurs dans les logs Render

---

## 🎉 Félicitations !

Votre site **AtypikHouse** est maintenant en ligne ! 🚀

**URL** : `https://votre-app.onrender.com`

---

## 📞 Support

- 📖 [Documentation Render](https://render.com/docs)
- 💬 [Support Render](https://render.com/support)
- 🐛 Logs en direct dans le dashboard Render

---

## 🔄 Prochaines Étapes

1. **Domaine personnalisé** : Configurez `www.atypikhouse.com`
2. **Base de données backup** : Configurez des sauvegardes MongoDB
3. **Monitoring** : Activez les alertes Render
4. **Performance** : Passez au plan payant si nécessaire
5. **SSL** : Automatique avec Render (HTTPS gratuit !)
