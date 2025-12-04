# 🔍 Diagnostic de l'Erreur 500 - Inscription Propriétaire

## ❌ Problème

Vous obtenez une erreur **500 (Internal Server Error)** lors de l'inscription d'un propriétaire :
```
POST https://atypikhouse-v2.onrender.com/api/hosts/register 500 (Internal Server Error)
```

## ✅ Modifications Apportées

J'ai amélioré le code pour mieux diagnostiquer le problème :

### 1. **Logging Détaillé des Données Reçues**
- Les données reçues sont maintenant loggées (sans le mot de passe)
- Affiche si tous les champs requis sont présents

### 2. **Validation Améliorée**
- Nettoyage automatique du SIRET (retire espaces et tirets)
- Validation plus stricte du format SIRET (14 chiffres exactement)
- Messages d'erreur de validation plus détaillés

### 3. **Gestion des Erreurs MongoDB**
- Détection spécifique des erreurs MongoDB
- Logging du code d'erreur et du type d'erreur

## 🔧 Comment Diagnostiquer

### Étape 1 : Vérifier les Logs sur Render

1. Allez sur votre dashboard Render : https://dashboard.render.com
2. Sélectionnez votre service `atypikhouse-v2`
3. Cliquez sur l'onglet **"Logs"**
4. Essayez de créer un compte propriétaire à nouveau
5. Regardez les nouveaux logs détaillés

Vous devriez voir des messages comme :

**Si ça fonctionne :**
```
✅ Connexion MongoDB réussie
📥 Données reçues pour inscription hôte: { firstName: '...', ... }
```

**Si la validation échoue :**
```
❌ Erreur de validation Zod: [...]
```

**Si la connexion MongoDB échoue :**
```
❌ Erreur de connexion MongoDB: [détails]
❌ Erreur MongoDB détectée: { code: ..., codeName: ..., message: ... }
```

### Étape 2 : Causes Probables

#### 1. **Problème de Validation**

**Symptômes** :
- Erreur 400 avec message "Données invalides"
- Logs montrent "Erreur de validation Zod"

**Solutions** :
- Vérifiez que le **SIRET contient exactement 14 chiffres** (sans espaces ni tirets)
- Vérifiez que tous les champs obligatoires sont remplis :
  - Prénom (min 2 caractères)
  - Nom (min 2 caractères)
  - Email (format valide)
  - Mot de passe (min 6 caractères)
  - Téléphone (min 10 caractères)
  - SIRET (exactement 14 chiffres)
  - Nom de l'entreprise (min 2 caractères)

#### 2. **Problème de Connexion MongoDB**

**Symptômes** :
- Erreur 500 avec "Erreur lors de l'inscription d'un hôte"
- Logs montrent "Erreur MongoDB détectée"

**Solutions** :
- Vérifiez `MONGODB_URI` dans Render
- Vérifiez Network Access dans MongoDB Atlas
- Vérifiez que le cluster n'est pas en pause

#### 3. **Email Déjà Utilisé**

**Symptômes** :
- Erreur 400 avec "Cet email est déjà utilisé"
- Pas d'erreur dans les logs (comportement normal)

**Solutions** :
- Utilisez un autre email
- Ou connectez-vous avec cet email existant

## 📋 Checklist

Avant de tester à nouveau, vérifiez :

- [ ] **MONGODB_URI** est définie dans Render
- [ ] **Network Access** dans MongoDB Atlas autorise les IPs de Render
- [ ] Le **SIRET** est exactement 14 chiffres (pas d'espaces, pas de tirets)
- [ ] Tous les champs obligatoires sont remplis
- [ ] Le format de l'email est valide
- [ ] Le mot de passe a au moins 6 caractères

## 🚀 Après Avoir Vérifié

1. **Push les modifications** :
   ```bash
   git add .
   git commit -m "Improve host registration error handling and validation"
   git push origin main
   ```

2. **Attendez le redéploiement** sur Render (2-3 minutes)

3. **Vérifiez les logs** dans Render Dashboard

4. **Testez l'inscription** à nouveau

5. **Regardez les nouveaux logs** qui afficheront :
   - Les données reçues (sans mot de passe)
   - L'erreur exacte si validation échoue
   - Les détails de l'erreur MongoDB si connexion échoue

## 📊 Messages de Log Attendu

### ✅ Succès :
```
✅ Connexion MongoDB réussie
📥 Données reçues pour inscription hôte: {...}
```

### ❌ Validation Échouée :
```
❌ Erreur de validation Zod: [
  { path: ['siret'], message: 'Le SIRET doit contenir 14 chiffres' }
]
```

### ❌ MongoDB Échouée :
```
❌ Erreur de connexion MongoDB: [message d'erreur]
❌ Erreur MongoDB détectée: { code: ..., codeName: ..., message: ... }
Environment check: { hasMongodbUri: true, hasJwtSecret: true, nodeEnv: 'production' }
```

## 💡 Astuce

Les nouveaux logs vous diront **exactement** quel champ pose problème et pourquoi. C'est beaucoup plus facile de résoudre le problème maintenant !

