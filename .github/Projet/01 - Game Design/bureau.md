Findings (ordre de gravité)

High — Désynchronisation probable pendant le scroll fluide
Le recalage des overlays de portes est fait dans updateOfficeDoorVisibility(), mais cette fonction n’est appelée que quand la direction ou l’état officeLookIsMoving change, pas à chaque frame. Pendant un glissement continu, drawX du fond bouge en continu alors que left/width des overlays peuvent rester figés jusqu’au prochain changement d’état.
Référence logique d’update: camera.js:79
Appel conditionnel seulement: camera.js:100
Recalage des overlays: door.js:128
Medium — Espace de coordonnées canvas/DOM incohérent
Le canvas interne est dimensionné en window.innerWidth/innerHeight, mais l’élément affiché est en 98vw/98vh. Le fond et les overlays ne partagent donc pas exactement le même repère visuel, ce qui peut créer un petit décalage latéral (surtout visible aux bords).
Canvas interne: game.js:108
Taille CSS canvas: style.css:705
Ancrage overlays basé sur canvas.width: door.js:129
Low — Code mort / dette technique autour des contrôles supprimés
La feature n’utilise plus les boutons de regard, mais le code continue de gérer office-look-controls et d’essayer d’attacher des listeners associés. Ça ne casse pas le jeu (checks null), mais ça brouille le comportement et complique les futures modifs.
Gestion controls fantôme: camera.js:38
Listeners optionnels restants: main.js:108
Questions / hypothèses

Tu veux bien confirmer que le comportement final voulu est: boutons porte/lumière attachés aux bords de l’image, visibles quand l’image les amène dans le cadre, sans disparition “logique” liée à gauche/centre/droite ?
Si oui, je recommande de corriger d’abord le point 1 (sync frame-by-frame), puis le point 2 (alignement exact des repères).
Résumé court
La feature est proche du bon design, mais il reste un risque majeur de désynchro pendant le glissement, et un risque moyen de décalage visuel lié au 98vw/98vh vs canvas.width/height. Aucun test automatisé n’est en place sur ce flux, donc risque de régression élevé tant que ces deux points ne sont pas verrouillés.