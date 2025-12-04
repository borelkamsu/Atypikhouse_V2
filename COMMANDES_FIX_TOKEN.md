# 🔧 Commandes pour Résoudre le Problème du Token

## ⚠️ ÉTAPE 1 : Révoquer le Token IMMÉDIATEMENT

**Avant tout, révoquez votre token compromis :**
1. Allez sur : https://github.com/settings/tokens
2. Trouvez votre token
3. Cliquez sur "Delete" ou "Revoke"

## 📝 ÉTAPE 2 : Commandes PowerShell à Exécuter

### 1. Vérifier l'état actuel

```powershell
git status
```

### 2. Si les fichiers sont déjà supprimés, ajouter la suppression

```powershell
git add -A
git status
```

### 3. Créer un nouveau commit qui supprime les fichiers

```powershell
git commit -m "Remove files containing exposed token"
```

### 4. Si le push bloque encore (le token est dans un commit précédent)

Réécrire le dernier commit pour retirer les fichiers :

```powershell
# Voir les derniers commits
git log --oneline -3

# Réinitialiser le dernier commit (garder les changements)
git reset --soft HEAD~1

# Supprimer les fichiers s'ils existent encore
Remove-Item PUSH_AVEC_TOKEN.md -ErrorAction SilentlyContinue
Remove-Item SECURITE_TOKEN.md -ErrorAction SilentlyContinue

# Ajouter tous les changements SAUF ces fichiers
git add .

# Recréer le commit
git commit -m "Improve property loading logic and error handling"

# Essayer de push
git push origin main
```

### 5. Si ça ne marche toujours pas

Amender tous les commits qui contiennent le token :

```powershell
# Voir le commit problématique
git log --all --full-history -- PUSH_AVEC_TOKEN.md SECURITE_TOKEN.md

# Retirer les fichiers de l'index
git rm --cached PUSH_AVEC_TOKEN.md SECURITE_TOKEN.md

# Amender le dernier commit
git commit --amend -m "Improve property loading logic"

# Force push (ATTENTION : seulement si vous êtes sûr)
git push origin main --force
```

## 🎯 Solution la Plus Simple

Si vous voulez une solution rapide :

```powershell
# 1. Supprimer les fichiers du dernier commit
git reset --soft HEAD~1

# 2. Vérifier que les fichiers sont supprimés
Remove-Item PUSH_AVEC_TOKEN.md -ErrorAction SilentlyContinue
Remove-Item SECURITE_TOKEN.md -ErrorAction SilentlyContinue

# 3. Recréer le commit sans ces fichiers
git add -A
git commit -m "Fix: Improve property loading and create about/reviews pages"

# 4. Push
git push origin main
```

## 🔐 Après avoir Push

1. ✅ Créez un nouveau token sur GitHub
2. ✅ Utilisez ce nouveau token pour les prochains pushs
3. ✅ Ne partagez JAMAIS votre token publiquement


