# 🔐 Guide d'Authentification Git pour GitHub

## ❌ Problème

Vous obtenez cette erreur :
```
remote: Invalid username or token. Password authentication is not supported for Git operations.
fatal: Authentication failed
```

GitHub a désactivé l'authentification par mot de passe en août 2021. Il faut utiliser un **Personal Access Token (PAT)** ou **SSH**.

## ✅ Solution : Utiliser un Personal Access Token (PAT)

### Étape 1 : Créer un Personal Access Token sur GitHub

1. **Allez sur GitHub** : https://github.com
2. **Cliquez sur votre profil** (en haut à droite) → **Settings**
3. **Scrollez vers le bas** dans le menu de gauche → **Developer settings**
4. **Cliquez sur "Personal access tokens"** → **"Tokens (classic)"**
5. **Cliquez sur "Generate new token"** → **"Generate new token (classic)"**

### Étape 2 : Configurer le Token

**Note** : GitHub vous demandera de vous authentifier à nouveau.

1. **Note** : Donnez un nom descriptif (ex: "AtypikHouse-V2-Render")
2. **Expiration** : Choisissez la durée (90 jours, 1 an, ou "No expiration")
3. **Sélectionnez les permissions** (scopes) :
   - ✅ `repo` (tout cocher dans repo) - **OBLIGATOIRE**
     - Cela donne accès aux repositories
4. **Scrollez en bas** et cliquez sur **"Generate token"**

### Étape 3 : COPIER LE TOKEN IMMÉDIATEMENT

⚠️ **IMPORTANT** : GitHub n'affichera le token qu'une seule fois !
- Copiez-le immédiatement
- Sauvegardez-le dans un endroit sûr
- Il ressemble à : `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Étape 4 : Utiliser le Token

Vous avez **3 options** :

---

## 🔧 Option 1 : Utiliser le Token lors du Push (Simple)

Quand vous faites `git push`, GitHub vous demandera :
- **Username** : `borelkamsu` (votre nom d'utilisateur GitHub)
- **Password** : **Collez votre token** (pas votre mot de passe GitHub !)

```bash
git push origin main
```

Git vous demandera les identifiants, utilisez le token comme mot de passe.

---

## 🔧 Option 2 : Sauvegarder le Token dans Git Credential Manager (Recommandé)

### Sur Windows :

Le Git Credential Manager devrait s'ouvrir automatiquement. Sinon :

1. **Faites le push** :
   ```bash
   git push origin main
   ```

2. **Quand Git demande les identifiants** :
   - **Username** : `borelkamsu`
   - **Password** : Collez votre token (ghp_...)

3. **Windows sauvegardera automatiquement** les identifiants pour les prochaines fois.

### Ou configurez manuellement :

```bash
# Configurer Git pour utiliser le credential manager
git config --global credential.helper manager-core

# Ensuite faites le push (il demandera les identifiants une fois)
git push origin main
```

---

## 🔧 Option 3 : Utiliser SSH (Plus Sécurisé, Plus Permanent)

### Créer une clé SSH :

1. **Ouvrez PowerShell** et exécutez :
   ```powershell
   ssh-keygen -t ed25519 -C "votre-email@example.com"
   ```
   
   Appuyez sur **Entrée** pour accepter l'emplacement par défaut.
   Optionnel : ajoutez une passphrase (recommandé).

2. **Affichez la clé publique** :
   ```powershell
   cat ~/.ssh/id_ed25519.pub
   ```
   
   Copiez TOUT le contenu (commence par `ssh-ed25519 ...`)

3. **Ajoutez la clé sur GitHub** :
   - Allez sur GitHub → Settings → **SSH and GPG keys**
   - Cliquez sur **"New SSH key"**
   - **Title** : "Mon PC - AtypikHouse"
   - **Key** : Collez la clé que vous avez copiée
   - Cliquez sur **"Add SSH key"**

4. **Changez l'URL du remote** :
   ```bash
   git remote set-url origin git@github.com:borelkamsu/Atypikhouse_V2.git
   ```

5. **Testez** :
   ```bash
   git push origin main
   ```

---

## 🚀 Solution Rapide (Pour Aujourd'hui)

Pour push maintenant rapidement :

1. **Créez un token** (voir Étape 1-3 ci-dessus)
2. **Faites** :
   ```bash
   git push origin main
   ```
3. **Quand Git demande les identifiants** :
   - Username : `borelkamsu`
   - Password : Collez votre token (commence par `ghp_`)

---

## 🔄 Après le Push Réussi

Une fois que le push fonctionne :

1. **Render détectera automatiquement** les changements
2. **Render redéploiera** votre application (2-3 minutes)
3. **Vérifiez les logs** dans Render Dashboard pour voir les nouveaux logs détaillés

---

## 📝 Note Importante

- **Le token fonctionne comme un mot de passe** mais est plus sécurisé
- **Ne partagez JAMAIS votre token** publiquement
- **Si vous perdez le token**, créez-en un nouveau (l'ancien sera révoqué)

---

## ❓ Besoin d'Aide ?

Si vous avez des problèmes :
1. Vérifiez que le token a bien la permission `repo`
2. Vérifiez que le token n'a pas expiré
3. Essayez de créer un nouveau token si nécessaire

