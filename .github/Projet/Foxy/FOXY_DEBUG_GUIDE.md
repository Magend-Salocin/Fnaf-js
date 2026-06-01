# Guide de Débogage - Mécanisme de Foxy

## Vue d'ensemble
Le mécanisme de Foxy a été intégré dans le jeu avec 3 phases distinctes et un système d'agressivité dynamique basé sur le niveau d'IA de la nuit.

## Boutons de Debug Foxy

### 1. **Foxy: Phase 1 (Inactif)** 🟢
- Force Foxy en phase 1 (inactif dans Pirate Cove)
- Définit l'agressivité à 10%
- Réinitialise le compteur de temps dans la phase

### 2. **Foxy: Phase 2 (Tête Sortie)** 🟡
- Force Foxy en phase 2 (tête sortie de Pirate Cove)
- Définit l'agressivité à 50%
- Réinitialise le compteur de temps dans la phase
- **Action requise**: Le joueur doit fermer la porte Est ou Foxy passera à la Phase 3!

### 3. **Foxy: Phase 3 (Course!)** 🔴
- Force Foxy en phase 3 (en pleine attaque dans le couloir Est)
- Définit l'agressivité à 100%
- **Situation critique**: Le joueur DOIT fermer la porte Est immédiatement!

### 4. **Vérifier Pirate Cove** 🔵
- Simule le joueur vérifiant Pirate Cove via la caméra
- Réinitialise le compteur de temps depuis la dernière vérification à 0
- Réduit l'agressivité de 30%
- **Conseil**: Vérifier régulièrement Pirate Cove pour maintenir Foxy inactif!

### 5. **Fermer Porte Est** ⬜
- Force la fermeture de la porte Est
- Peut arrêter Foxy s'il est en Phase 2 ou 3
- **Important**: Cette action consomme de l'énergie dans le jeu réel!

### 6. **Ouvrir Porte Est** ⬛
- Force l'ouverture de la porte Est
- Permet à Foxy de progresser vers ses phases plus agressives
- **Danger**: Laisser la porte ouverte quand Foxy est en Phase 2/3 = Game Over!

### 7. **Reset Foxy** ⚪
- Réinitialise complètement Foxy pour une nouvelle nuit
- Remet toutes les valeurs à 0
- Efface l'historique des sons
- Utilisé automatiquement au démarrage de chaque nuit

## Phases de Foxy Expliquées

### Phase 1: INACTIF
```
Couleur: VERT (#00ff00)
Localisation: Pirate Cove (cachette)
Agressivité: Augmente lentement si non vérifié
Bruit: Grattements métalliques occasionnels
Menace: Faible
Durée typique: Variable (dépend du joueur et de l'IA)
```

### Phase 2: TETE_SORTIE
```
Couleur: JAUNE (#ffff00)
Localisation: Tête sortie de Pirate Cove
Agressivité: Moyenne à Élevée
Bruit: Son de rideau qui s'ouvre
Menace: Moyenne - Peut attaquer s'il n'y a pas d'action!
Durée: Quelques secondes minimum avant Phase 3
Contre-mesure: Fermer la porte Est!
```

### Phase 3: COURSE
```
Couleur: ROUGE (#ff0000)
Localisation: Course dans le couloir Est (Cam 1B)
Agressivité: Maximale
Bruit: Son de course rapide
Menace: CRITIQUE - Game Over imminent!
Durée: Quelques secondes avant attaque
Contre-mesure: FERMER LA PORTE EST MAINTENANT!
```

### Phase 4: RETRAIT
```
Couleur: BLEU (#0088ff)
Localisation: Retour à Pirate Cove (en cooldown)
Agressivité: En diminution
Bruit: Son de retrait
Menace: Aucune (pour le moment)
Durée: Cooldown de 60 ticks
Résultat: Retour à Phase 1 après le cooldown
```

## Affichage du Statut

Le statut de Foxy s'affiche dans le coin supérieur droit de l'écran avec:
- **Statut actuel**: Description textuelle de la phase et du danger
- **Agressivité**: Niveau actuel (0-100%)
- **Dernier scan**: Temps écoulé depuis la dernière vérification de Pirate Cove

### Codes Couleur du Statut
| Phase | Couleur | Signification |
|-------|---------|---------------|
| INACTIF | 🟢 Vert | Sûr pour le moment |
| TETE_SORTIE | 🟡 Jaune | Vigilance requise! |
| COURSE | 🔴 Rouge | DANGER! Ferme la porte! |
| RETRAIT | 🔵 Bleu | Foxy se retire (cooldown) |

## Stratégie de Survie

### Avant Phase 2
1. Vérifier régulièrement Pirate Cove (Cam 1C)
2. Observer l'agressivité dans le statut
3. Agir avant que Foxy ne passe à Phase 2

### Pendant Phase 2
1. Fermer IMMÉDIATEMENT la porte Est
2. Maintenir la porte fermée
3. Écouter le bruit de retrait
4. Rouvrir la porte une fois que Foxy est parti

### Pendant Phase 3
1. Fermer la porte Est EN URGENCE
2. Ne pas la rouvrir tant qu'on n'entend pas Foxy se retirer
3. Consommation d'énergie très rapide

## Variables à Surveiller

- **Agressivité**: Augmente constamment, réduite par les vérifications
- **Temps depuis check**: Temps depuis la dernière vérification de Pirate Cove
- **Phase actuelle**: Détermine le niveau de menace
- **Cooldown**: En cours après un retrait réussi

## Intégration avec le Jeu

### Niveau d'IA par Nuit
| Nuit | Niveau Foxy | Difficulté |
|------|-------------|-----------|
| 1 | 0 | Foxy inactif |
| 2 | 2 | Léger |
| 3 | 4 | Moyen |
| 4 | 6 | Difficile |
| 5 | 8 | Très difficile |
| 6 | 12 | Cauchemar |

### Consommation d'Énergie
- Vérifier Pirate Cove: -1% par vérification
- Fermer/Ouvrir porte Est: -1% par action
- (Nota: Valeurs basées sur le système existant du jeu)

## Dépannage

**Q: Foxy n'apparaît pas/statut ne s'affiche pas?**
- Vérifier que le script foxy.js est chargé
- Ouvrir la console (F12) pour les erreurs
- Relancer le jeu

**Q: Les boutons ne fonctionnent pas?**
- Vérifier que les écouteurs d'événements sont attachés
- Vérifier que le jeu a démarré
- Vérifier la console pour les erreurs JavaScript

**Q: Foxy reste bloqué dans une phase?**
- Utiliser le bouton "Reset Foxy"
- Vérifier que la porte Est se ferme/ouvre correctement
- Vérifier que Pirate Cove peut être vérifié

## Points d'Intégration Future

1. **Animations visuelles**: Ajouter des sprites de Foxy dans le couloir
2. **Caméra 1B**: Afficher Foxy qui court quand en Phase 3
3. **Caméra 1C**: Afficher différents états de Foxy dans Pirate Cove
4. **Sons ambient**: Grattements occasionnels pendant Phase 1
5. **Notifications**: Alertes visuelles quand Foxy change de phase
