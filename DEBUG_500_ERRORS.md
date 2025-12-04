# 🔍 Diagnostic des Erreurs 500 sur Render

## ❌ Problème Identifié

Vous rencontrez des erreurs **500 (Internal Server Error)** lors de :
- L'inscription d'un client : `POST /api/auth/register`
- L'inscription d'un propriétaire : `POST /api/hosts/register`

## ✅ Modifications Apportées

J'ai amélioré le code pour mieux diagnostiquer les problèmes :

### 1. **Logging Détaillé des Erreurs**
- Les erreurs sont maintenant loggées avec plus de détails dans la console Render
- Affichage du message d'erreur, de la stack trace, et du nom de l'erreur
- Vérification des variables d'environnement (sans exposer les valeurs)

### 2. **Vérification des Variables d'Environnement**
- Vérification au démarrage que `MONGODB_URI` et `JWT_SECRET` sont définis
- Messages d'erreur clairs si les variables manquent

### 3. **Amélioration de la Connexion MongoDB**
- Timeout de connexion configuré (10 secondes)
- Messages de log pour suivre la connexion
- Gestion d'erreurs améliorée

## 🔧 Étapes de Diagnostic

### Étape 1 : Vérifier les Logs sur Render

1. Allez sur votre dashboard Render : https://dashboard.render.com
2. Sélectionnez votre service `atypikhouse-v2`
3. Cliquez sur l'onglet **"Logs"**
4. Essayez de créer un compte à nouveau
5. Regardez les nouveaux logs détaillés qui apparaîtront

Vous devriez voir des messages comme :
- ✅ `Connexion MongoDB réussie` (si la connexion fonctionne)
- ❌ `MONGODB_URI est manquante` (si la variable n'est pas définie)
- ❌ `Erreur de connexion MongoDB: [détails]` (si la connexion échoue)

### Étape 2 : Vérifier les Variables d'Environnement sur Render

Dans votre dashboard Render :

1. Allez dans **Settings** → **Environment**
2. Vérifiez que ces variables sont bien définies :

#### ✅ Variables OBLIGATOIRES :

| Variable | Doit être définie |
|----------|-------------------|
| `MONGODB_URI` | ✅ Oui (votre URI MongoDB Atlas) |
| `JWT_SECRET` | ✅ Oui (une clé secrète forte) |
| `NODE_ENV` | ✅ Oui (doit être `production`) |

#### 📝 Format de MONGODB_URI :

L'URI MongoDB doit ressembler à :
```
mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

⚠️ **IMPORTANT** : Remplacez `username`, `password`, `cluster`, et `database` par vos vraies valeurs.

### Étape 3 : Vérifier MongoDB Atlas (IP Whitelist)

Si la connexion MongoDB échoue, vérifiez :

1. Allez sur [MongoDB Atlas](https://cloud.mongodb.com)
2. Cliquez sur **Network Access** (dans le menu de gauche)
3. Vérifiez que vous avez soit :
   - `0.0.0.0/0` (autoriser toutes les IPs - pour commencer)
   - Ou les IPs spécifiques de Render (plus sécurisé)

Pour trouver les IPs de Render :
- Dans Render Dashboard → Settings → **Outbound IPs**

### Étape 4 : Vérifier les Identifiants MongoDB

1. Dans MongoDB Atlas, allez dans **Database Access**
2. Vérifiez que :
   - L'utilisateur existe
   - Le mot de passe est correct
   - L'utilisateur a les bonnes permissions

### Étape 5 : Tester la Connexion MongoDB

Vous pouvez tester si MongoDB Atlas est accessible depuis Render en regardant les logs. Si vous voyez :

```
❌ Erreur de connexion MongoDB: getaddrinfo ENOTFOUND
```
→ Problème de réseau / IP non autorisée

```
❌ Erreur de connexion MongoDB: authentication failed
```
→ Mauvais identifiants (username/password)

```
❌ Erreur de connexion MongoDB: timeout
```
→ Problème de réseau ou MongoDB Atlas non accessible

## 🐛 Solutions Communes

### Problème 1 : MongoDB URI Incorrecte

**Symptôme** : Erreur dans les logs concernant la connexion MongoDB

**Solution** :
1. Vérifiez le format de l'URI dans Render
2. Assurez-vous qu'il n'y a pas d'espaces
3. Vérifiez que le mot de passe ne contient pas de caractères spéciaux non encodés

**Format correct** :
```
mongodb+srv://user:pass@cluster.mongodb.net/db?retryWrites=true&w=majority
```

### Problème 2 : IP Non Autorisée dans MongoDB Atlas

**Symptôme** : Timeout ou erreur de connexion réseau

**Solution** :
1. Allez dans MongoDB Atlas → Network Access
2. Cliquez sur "Add IP Address"
3. Ajoutez `0.0.0.0/0` (toutes les IPs) pour tester
4. Ou ajoutez les IPs spécifiques de Render

### Problème 3 : Variable d'Environnement Manquante

**Symptôme** : Logs montrent "MONGODB_URI est manquante" ou "JWT_SECRET est manquant"

**Solution** :
1. Allez dans Render → Settings → Environment
2. Ajoutez la variable manquante
3. Cliquez sur "Save Changes"
4. Render redéploiera automatiquement

### Problème 4 : JWT_SECRET Manquant ou Trop Faible

**Symptôme** : Erreurs lors de la génération du token

**Solution** :
1. Générez un secret fort :
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```
2. Copiez le résultat
3. Ajoutez-le comme valeur de `JWT_SECRET` dans Render

## 📋 Checklist Complète

Avant de redéployer, vérifiez :

- [ ] `MONGODB_URI` est définie dans Render (format correct)
- [ ] `JWT_SECRET` est définie dans Render (clé forte)
- [ ] `NODE_ENV` est définie à `production`
- [ ] MongoDB Atlas autorise les IPs de Render (0.0.0.0/0 ou IPs spécifiques)
- [ ] Les identifiants MongoDB (username/password) sont corrects
- [ ] Le nom de la base de données dans l'URI correspond à une base existante

## 🚀 Après Avoir Corrigé

1. **Sauvegardez les variables** dans Render
2. Render redéploiera automatiquement (2-3 minutes)
3. **Vérifiez les logs** pour voir si la connexion fonctionne
4. **Testez à nouveau** l'inscription

## 📞 Besoin d'Aide ?

Si le problème persiste après avoir vérifié tout ce qui précède :

1. **Copiez les logs complets** depuis Render (les nouveaux logs sont plus détaillés)
2. **Partagez-les** pour qu'on puisse voir l'erreur exacte

Les nouveaux logs contiendront :
- Le message d'erreur exact
- La stack trace complète
- L'état des variables d'environnement (sans exposer les valeurs)
- Les détails de la connexion MongoDB

## 🔐 Sécurité

⚠️ **N'oubliez pas** :
- Ne partagez JAMAIS vos vraies valeurs de variables d'environnement publiquement
- Les logs n'exposent PAS les valeurs (seulement si elles existent)
- Utilisez des secrets forts pour `JWT_SECRET`


