# Version web, iPhone et clés d'activation

Le jeu est publié sur GitHub Pages, jouable sur iPhone (tactile, hors ligne après une première partie en ligne) et réservé aux testeurs munis d'une clé liée à leur appareil. Electron reste la version PC : la version web n'en dépend pas.

Adresse du site : `https://magend-salocin.github.io/Fnaf-js/`

## Utilisation au quotidien

| Besoin | Commande ou action |
| --- | --- |
| Jouer sur PC | `npm start` |
| Tester sur iPhone sans publier (même Wi-Fi, HTTP, pas de clé, pas de hors ligne) | `npm run web`, puis ouvrir dans Safari l'adresse affichée |
| Publier une nouvelle version | Fusionner `develop` dans `main`, puis `git push` de `main` (le workflow Pages déploie seul). GitHub n'autorise que `main` à publier sur Pages |
| Construire le site en local (contrôle) | `npm run build-web`, résultat dans `_site/` |
| Donner l'accès à quelqu'un | `npm run key -- new XXXX-XXXX "Prénom"`, envoyer la clé affichée (pas de push) |
| Revoir les clés données | `npm run key -- list` |
| Retirer l'accès | `npm run key -- revoke "Prénom"`, puis commit et push |
| Repartir de zéro sur un appareil | Écran d'accueil > Tout effacer : un nouvel identifiant apparaît, il faut une nouvelle clé |

Installer : ouvrir l'adresse du site sur le téléphone. Un écran « Installer l'application » guide le testeur : sur iPhone, Partager > « Sur l'écran d'accueil » ; sur Android, bouton Installer (ou menu ⋮ > « Installer l'application »). L'identifiant et la clé se lisent et se saisissent depuis l'icône : navigateur et application installée ont des données séparées.

## Les briques

### Affichage et contrôles tactiles

- `index.html` fixe la largeur de la page à 1280 px (`<meta name="viewport" content="width=1280">`) : l'iPhone réduit la page à son écran, le jeu garde la mise en page prévue pour 1280x720. En paysage sur un iPhone récent, la hauteur visible fait environ 590 px, au-dessus du minimum de 540 px. Les navigateurs de bureau et Electron ignorent cette balise.
- En portrait sur écran tactile, un écran noir demande de tourner l'appareil (`.rotate-notice`, `style/web.css`).
- Regard dans le bureau : `pointermove` au lieu de `mousemove` (`script/app/main.js`). À la souris rien ne change ; au doigt, on glisse pour regarder, ou on touche un côté de l'écran (`pointerdown` tactile oriente aussi le regard, un simple toucher n'émettant pas de `pointermove`). Les commandes des portes dépassent du bord au repos : comme dans FNAF, on regarde sur le côté pour les atteindre.
- Plan des caméras : ancré en bas (`bottom: 91px`, `style/camera.css`) au lieu de `top: 475px`, qui le faisait sortir de l'écran en 720 px de haut et plus encore sur téléphone (592 px). Sur écran tactile, la zone de chaque bouton est élargie de 8 px de chaque côté (`.camera::after`).
- Terminal : le journal se limite à la hauteur disponible (`.retro-shell-log`) et les blancs du gabarit ne comptent plus (`.retro-shell-content`) ; le texte sortait par le haut, en partie sur PC et entièrement sur téléphone. Sur écran tactile, texte et saisie passent à 22 px et les croix de fermeture à 48 px.
- Lumières : `pointerdown`, `pointerup`, `pointerleave` et `pointercancel` (`script/mechanics/door.js`). Sur iPhone, `mousedown` n'arrive qu'au relâché : la lumière ne restait pas allumée tant qu'on appuie.
- Cassettes : un toucher ou un clic sur une cassette l'insère (`script/mechanics/tape.js`). Le glisser-déposer HTML5 ne marche pas au doigt.
- Terminal : le clavier de l'iPhone s'ouvre en touchant le terminal ; le bouton ✕ remplace Échap.
- `style/web.css` bloque défilement, zoom, sélection de texte et menu au toucher long sur la zone de jeu, pas dans les panneaux (terminal, journal).

### Serveur local (`npm run web`)

`tools/web-server.js` sert `index.html` et les dossiers que le jeu charge (`script/`, `style/`, `templates/`, `images/`, `audio/`, `ressources/`, `web/`), sur toutes les interfaces réseau. Tout autre chemin répond 404 (`package.json`, `.git/`, clé privée). Il gère les requêtes partielles (`Range`) : sans elles, Safari ne lit pas l'audio. Le PC doit rester allumé.

### Publication GitHub Pages

| Fichier | Rôle |
| --- | --- |
| `.github/workflows/pages.yml` | À chaque push sur `main` (ou manuellement, onglet Actions) : `node tools/build-web.js`, puis déploiement |
| `tools/build-web.js` | Construit `_site/` : `index.html`, les dossiers du jeu sans `script/core/unused/`, `ressources/voix/` (sources des voix) ni `images/atlas/src/`, `web/`, `sw.js` à la racine, et `precache-manifest.js` |

Réglage unique sur GitHub : Settings > Pages > Source : GitHub Actions.

Le site fait environ 450 Mo, sous la limite de 1 Go de Pages.

### Mode hors ligne

| Fichier | Rôle |
| --- | --- |
| `web/sw.js` | Service worker, copié à la racine du site pour couvrir tout le jeu |
| `precache-manifest.js` | Généré au build : liste des fichiers de code et deux empreintes, `version` (code) et `mediaVersion` (images et sons) |
| `script/web/offline_mode.js` | Enregistre le service worker, seulement en HTTPS hors Electron |

Stratégie choisie pour ne pas imposer 450 Mo au premier lancement :

- le code (HTML, JS, CSS, JSON, TXT, moins de 1 Mo) est téléchargé à l'installation du service worker ;
- chaque image ou son est mis en cache la première fois que le jeu le charge. Les balises `<audio>` de `index.html` déclenchent ce chargement dès l'ouverture de la page, donc presque tous les sons sont en cache après un premier lancement en ligne. Les images de salles et d'événements ne le sont qu'une fois vues.

Conséquence : hors ligne, une image jamais affichée en ligne manque. Pour un testeur, jouer une nuit en ligne suffit à remplir l'essentiel.

Safari lit l'audio par requêtes partielles et attend une réponse 206. Le service worker découpe la réponse en cache ; à la première écoute, il laisse passer la requête partielle et met le fichier entier en cache en parallèle.

Les loaders lisent leurs JSON en `XMLHttpRequest` synchrone, et les navigateurs ne font pas passer ces requêtes par le service worker : hors ligne, le jeu démarrait sans données (vérifié sous Chromium). Le build intègre donc tous les JSON et TXT dans `script/web/preloaded_files.js` (environ 350 Ko, mis en cache avec le code) et l'ajoute à `index.html` ; `script/web/preloaded_xhr.js` sert alors les requêtes synchrones depuis la mémoire. Sans ce fichier (Electron, `npm run web`), le relais ne fait rien.

Une nouvelle version publiée est téléchargée au lancement suivant avec réseau, puis utilisée au lancement d'après. Le cache des médias n'est vidé que si une image ou un son a changé.

### Clés d'activation liées à l'appareil

État actuel : désactivées (`ACCESS_KEY_REQUIRED = false` en tête de `script/web/access_gate.js`), le temps de valider le jeu sur iPhone. Le site s'ouvre directement sur le jeu, sans écran d'installation ni écran de clé. Pour réactiver : remettre `true`, puis publier. Les clés déjà données restent valables.

Principe : signature numérique. L'organisateur signe l'identifiant de l'appareil avec une clé privée ; le jeu vérifie la signature avec la clé publique. Le code est public : sans la clé privée, personne ne fabrique de clé valide, et une clé ne marche que pour l'identifiant signé.

| Fichier | Rôle |
| --- | --- |
| `script/web/access_keys.js` | Identifiant d'appareil (8 caractères sans 0/O ni 1/I), texte signé `fnaf-js:device:<ID>`, vérification ECDSA P-256 / SHA-256 avec Web Crypto. Script classique pour le jeu, module CommonJS pour l'outil |
| `script/web/access_gate.js` | Écran blanc « Test en cours » (FR ou EN selon la langue enregistrée ou celle du téléphone) : identifiant, bouton Copier, champ de clé, mémorisation, revérification à chaque lancement |
| `script/web/access_public_key.js` | Clé publique (JWK), générée par `init`, publiée |
| `script/web/revoked_devices.js` | Identifiants révoqués, générés par `revoke`, publiés |
| `tools/access-key.js` | `init`, `new`, `list`, `revoke` |
| `access-private-key.local.pem` | Clé privée : jamais versionnée (`.gitignore`), exclue du build Electron, à sauvegarder |
| `access-devices.local.json` | Qui a quel appareil et quelle clé : jamais versionné, à sauvegarder |

L'écran n'apparaît qu'en HTTPS hors Electron : ni dans `npm start`, ni avec `npm run web`. La clé collée est nettoyée (espaces, retours à la ligne) ; elle est sensible à la casse.

Écran d'installation : sur écran tactile (`pointer: coarse`) hors application installée (`navigator.standalone` sur iPhone, `display-mode: standalone` ou `fullscreen` ailleurs) et sans clé valide, il remplace l'écran de clé. Sur iPhone, il donne la marche à suivre (Safari ne permet pas d'installer par un bouton). Sur Android, il affiche un bouton Installer quand le navigateur envoie `beforeinstallprompt`, sinon la marche à suivre par le menu. Chrome n'envoie cet événement qu'avec un manifeste complet (icônes 192 et 512 px) et un service worker actif ; au tout premier chargement, le bouton peut donc n'apparaître qu'après quelques secondes. Le lien « Continuer dans le navigateur » mène quand même à l'écran de clé. Une clé déjà valide dans le navigateur ne déclenche pas l'écran.

Tant qu'un de ces écrans est affiché, le reste de la page est masqué (`html.access-pending`) et la page prend la largeur réelle de l'écran. L'écran n'est pas un calque `position: fixed` : sur iPhone, un calque fixe avec le clavier ouvert décale les zones tactiles, et les boutons ne répondaient plus.

Le panneau debug et le lien vers l'éditeur de logs sont masqués sur le site publié (`isDevToolsEnabled()`, `script/debug/debug.js`). Ils restent disponibles avec `npm run web`.

Limites assumées :

- Tout effacer, ou l'effacement des données Safari, change l'identifiant : il faut une nouvelle clé.
- Une révocation n'agit qu'après la mise à jour du cache sur l'appareil.
- L'écran recouvre le jeu sans l'empêcher de se charger : quelqu'un de déterminé peut le retirer, et tous les fichiers du site restent téléchargeables directement. La clé filtre les testeurs, elle ne protège pas le contenu.

### Tout effacer

Lien sur l'écran d'accueil, PC et web. Double confirmation, puis `clearAllData()` (`script/core/reset_data.js`) : `localStorage` (progression, options, langue, identifiant et clé), `sessionStorage`, caches et désinscription du service worker. Le jeu se relance ensuite.

## Tester

1. `npm run web`, ouvrir l'adresse sur l'iPhone : rendu en paysage, regard au doigt, lumières maintenues, portes, caméras, cassettes, terminal, son.
2. Après publication, depuis l'icône : identifiant, clé, relance (la clé est retenue).
3. Jouer une nuit en ligne, fermer l'application, passer en mode avion, relancer.

Vérifié sous Chromium (Electron servant `_site/` en HTTPS simulé) : écran de clé, clé acceptée puis retenue, clé d'un autre appareil ou révoquée refusée, debug masqué, service worker actif, rechargement hors ligne avec données chargées et nuit lancée sans erreur. Reste à vérifier sur un vrai iPhone : tactile, son, hors ligne.

## Problèmes connus et solutions

| Symptôme | Cause | Solution |
| --- | --- | --- |
| Site en 404 | Pages non activé, le workflow échoue à `configure-pages` | Settings > Pages > Source : GitHub Actions, puis relancer le workflow (Actions > Pages > Run workflow) |
| `EADDRINUSE` au lancement de `npm run web` | Port 8080 déjà pris | Arrêter l'autre serveur, ou `npm run web -- --port 8081` |
| Pas de son avec `npm run web` sur iPhone | Serveur sans requêtes partielles | Géré par `tools/web-server.js` ; vérifier que c'est bien lui qui sert |
| Pas de hors ligne ni de clé avec `npm run web` | Service worker et Web Crypto exigent HTTPS | Normal : ils ne concernent que le site publié |
| Clé refusée sur iPhone | Identifiant lu dans Safari mais clé collée dans l'icône (ou l'inverse), ou clé retapée à la main | Tout faire depuis l'icône ; copier-coller la clé |
| Boutons Valider et Copier inactifs sur téléphone | Règle globale `h1` de `style/start-screen.css` (absolu, 500x400 px, blanc) : le titre invisible de l'écran de clé recouvrait les boutons | `.access-title` remet `position`, taille et couleur à zéro (`style/web.css`). Tester au toucher réel (CDP `Input.dispatchTouchEvent`), pas avec `.click()` qui ignore ce qui recouvre |
| Hors ligne, le jeu s'ouvre sans textes ni salles | XHR synchrones hors service worker | `preloaded_files.js` doit être dans `_site/index.html` : le build s'arrête si la balise `preloaded_xhr.js` manque dans `index.html` |
| Sons absents avant le premier toucher | Safari bloque le son tant que l'utilisateur n'a pas touché l'écran | Le choix de la langue sert de premier toucher |

## Dépôt public : précautions

- Le dépôt est public et contient du contenu de la franchise d'origine (titre, noms, musique, images). Pages le rend téléchargeable par n'importe qui qui connaît l'adresse, avec ou sans clé. Publication décidée en connaissance de cause.
- Un fichier supprimé reste dans l'historique : le retirer avec `git filter-repo --path <dossier> --invert-paths`, puis `git push --force`, après avoir sauvegardé le dépôt (`git bundle create sauvegarde.bundle --all`).
- L'adresse e-mail des commits est publique : activer l'adresse masquée de GitHub (Settings > Emails).
- Mention sur l'écran de clé : projet personnel, non commercial, à des fins de découverte.
