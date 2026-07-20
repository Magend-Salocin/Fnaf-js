Description du Projet FNAF
C'est une implémentation web interactive de "Five Nights at Freddy's 1", créée par Nicolas Berger. Un jeu d'horreur classique où tu dois survivre 5 nuits en gérant des ressources limitées face à des animatroniques agressifs.


Fnaf 3d
https://www.youtube.com/watch?v=nxiM1f1AUJc
https://www.youtube.com/watch?v=2Y-LG1OeoTg
https://the-fnaf-fan-game.fandom.com/wiki/Five_Nights_at_Freddy%27s:_In_Real_Time
https://the-fnaf-fan-game.fandom.com/wiki/Supply_Closet_(Five_Nights_at_Freddy%27s:_In_Real_Time)

Ressource
https://game-icons.net/
https://www.spriters-resource.com/pc_computer/fivenightsatfreddys/
https://freddy-fazbears-pizza.fandom.com/wiki/Five_Nights_at_Freddy%27s_Wiki




audio fr
https://www.youtube.com/watch?v=nxiM1f1AUJc

treejs assembly
https://www.reddit.com/r/threejs/comments/1s3a7bm/first_month_working_on_my_star_fox_inspired_game/
https://dev.to/m1kc3b/from-2500-to-1000000-particles-supercharging-a-threejs-demo-with-webassembly-24b



https://www.youtube.com/watch?v=DvSqlVTBcaE

https://www.snokido.fr/jeu/five-nights-at-freddys


Convert image to ascci
https://manytools.org/hacker-tools/convert-images-to-ascii-art/go/

🎮 Concept du Jeu
Tu joues le rôle d'un gardien de nuit dans une pizzeria animée. Chaque nuit (12h AM à 6h AM), des animatroniques s'échappent et tentent d'attaquer. Tu dois:

Surveiller les caméras pour suivre leurs mouvements
Fermer les portes pour les bloquer
Allumer les lumières pour les repousser
Gérer l'électricité (ressource limitée)
📁 Architecture du Projet
Technologie: HTML5, CSS3, JavaScript vanilla (pas de framework)

Structure des fichiers:
script/ - Code JavaScript principal

main.js - Boucle du jeu et gestion des événements
game.js - Logique de jeu (nuits, score)
camera.js - Système de caméras de surveillance
door.js - Système des portes et lumières
animatronic.js - Comportement des animatroniques
foxy.js - Nouveau: Mécanisme Foxy avec phases (Inactif → Tête sortie → Course d'attaque)
sounds.js - Gestion audio
assets.js - Chargement des ressources
render.js - Rendu graphique
translations.js - Support multilingue (FR/EN)
style/ - CSS

Interface du jeu, caméras, écran de démarrage
images/ - Ressources visuelles

Caméras, portes, animatroniques, salles (Show Stage, Pirate Cove, Kitchen, etc.)
audio/ - Sons du jeu

Musique, bruits d'attaque, sons de portes
🎯 Mécanique de Jeu
Animatroniques
Freddy, Bonnie, Chica, Foxy - Chacun avec comportement et attaques uniques
Foxy a un système à 4 phases:
Phase 1 - Inactif dans Pirate Cove
Phase 2 - Tête sortie du rideau (menace moyenne)
Phase 3 - Course d'attaque (critique)
Phase 4 - Retrait/cooldown
Ressources
Électricité - Utilisée pour portes, lumières, caméras
Agressivité AI - Augmente avec les nuits, influence la fréquence des attaques
Progression
5 nuits à survivre jusqu'à 6h du matin
L'IA devient plus agressif chaque nuit

🌐 Fonctionnalités
✅ Système de caméras - 10 points de vue (Show Stage, Dining Area, Pirate Cove, Kitchen, etc.)
✅ Gestion d'électricité - Ressource partagée entre caméras, portes et lumières
✅ Animations et GIFs - Séquences visuelles pour les attaques
✅ Son multicanal - Musique, ambiance, bruits d'attaque
✅ Support multilingue - Français et Anglais
✅ Système de debug - 7 boutons pour tester Foxy et les mécaniques
✅ Écran de transition - Entre les nuits avec animations

