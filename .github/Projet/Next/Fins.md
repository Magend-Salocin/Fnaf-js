# Fins

Les trois enregistrements de fin, joués après le chèque de paie de la nuit 5. Ils remplacent TAPE_ERREUR_08 (« Reconnaissance ») et TAPE_ERREUR_09 (« Correction »), dont l'original reste dans `ressources/Tape/` comme archive. Découle de [Bible.md](Bible.md), section 8, et répond à [Appel_Nuit5.md](Appel_Nuit5.md).

Statut : premier jet du 18/11/2026, fin A réécrite le même jour (Machine, fuite, fermeture, fantômes), en cours de travail. B et C validées sur le fond, conditions à valider. Version anglaise après validation.

---

## Principe

- Trois fins, comme les trois appels : A Effacement, B Témoin, C Reconnaissance. L'appel annonce la Cassidy de la nuit, la fin dit ce qu'il en reste.
- Ce n'est plus une cassette que l'on trouve : c'est ce que le bâtiment enregistre à 6 h, le matin du samedi 13/11/1993. Le format reste celui des cassettes (bruitages, plusieurs voix).
- B et C donnent la parole à tous ceux que le joueur a croisés : le système, Pierre D. sur une bande de 1985, les quatre enfants chacun avec sa voix, Michael, Cassidy. En A, les enfants ne parlent plus comme des enfants : il ne reste que les fantômes.
- B et C reprennent la liste des invités de TAPE_GAB_03 (« Il manque un nom ») : laissée en suspens en B, complétée d'une ligne sans nom en C.
- Ce qui ne change pas : Cassidy n'a jamais de nom, personne ne nomme William, Michael ne dit jamais qui il est. Charlie n'est suggérée que dans l'après-fin de C (Bible, section 9).

## Choix de la fin

Proposition : la fin se calcule après le dernier écran de correction de la nuit 5, avec les seuils de l'appel. Le joueur qui corrige tout pendant la nuit 5 peut donc tomber de B en A.

| Fin | Condition | Correspondance Bible |
| --- | --- | --- |
| A — Effacement | Moins de 8 maillons, ou majorité d'anomalies corrigées | Effacement |
| B — Témoin | De 8 à 14 maillons, ou chaîne de Cassidy incomplète | Témoin |
| C — Reconnaissance | 15 maillons ou plus, chaîne de Cassidy complète, anomalies majoritairement conservées | Reconnaissance |

Mourir en nuit 5 donne le game over habituel, sans fin.

Décidé le 18/11/2026 : un joueur qui n'a presque rien trouvé (moins de 8 maillons) tombe en A, même s'il n'a rien corrigé. Ne pas chercher, c'est laisser le restaurant effacer.

## A — Effacement

Voix principale : la Machine, le sous-système de nettoyage, l'acteur du restaurant qui veut tout supprimer. Les fantômes et Cassidy ne font que lui résister.

1. Fuite. 6 h 02 : le veilleur `004` sort, laisse badge et uniforme. « Retour prévu : aucun. » Cassidy : « Tu t'enfuis. Comme la première fois. »
2. Fermeture. Directive Fazbear : fermeture définitive, effacement complet. La Machine supprime tout ce que le joueur a trouvé : caméras, registres du terminal, les dix-neuf cassettes, les journaux, puis le personnel (`003`, `004`, `A-003`).
3. Les profils. Elle supprime les quatre ancrages. Chacun laisse une « activité résiduelle » : un fantôme qui cherche le gardien à travers son ancrage (la fête pas finie, le dessin, la table mise, « Il a triché. Il est sorti du jeu »). La quatrième suppression échoue.
4. L'attaque. Les fantômes traversent les couloirs et forcent les deux portes d'un bureau vide. « Il n'est plus là. Où est-il ? »
5. Cassidy. Le cinquième profil n'a rien à supprimer : personne ne l'a jamais écrite. Elle pousse le gardien à fuir loin, changer de nom, et promet d'attendre : « Vous revenez toujours. »
6. Extinction. Mise hors tension salle par salle, jusqu'au bureau. « Restaurant fermé. Système stable. » Puis : « Erreur. Activité détectée. » Coupure.

Le joueur survit et part, mais rien n'est réglé : tout ce qu'il a trouvé est effacé, les fantômes restent enfermés avec leur colère, Cassidy attend son retour.

Texte : `ressources/voix/textes/fin_A.txt`.

## B — Témoin

Voix principale : la Mémoire. Michael finit sa nuit, entend peut-être quelqu'un, part sans se retourner. Après son départ, la Mémoire continue seule la visite : la fête est prête mais attend quelqu'un, le dessin a « tout le monde, je crois », la gamelle est pleine, Fritz compte cinq jouets puis se reprend. La recherche du nom est abandonnée faute de veilleur. Cassidy lui reproche de ne jamais lui avoir demandé son nom. La Machine annonce un nouveau veilleur pour lundi : la boucle recommence.

Dernière phrase : « C'est moi. » (le IT'S ME de la Bible).

Texte : `ressources/voix/textes/fin_B.txt`.

## C — Reconnaissance

Voix principale : la Mémoire. Elle rejoue la liste de 1985 et ajoute une ligne sans nom ; la Machine veut la supprimer, la Mémoire refuse (« Parce qu'elle était là »). Cassidy reconnaît que le gardien n'est pas lui ; il lui demande son nom, elle ne s'en souvient plus, mais il a demandé. Les quatre enfants voient chacun la trace en plus (une chaise, un enfant sur le dessin, une part gardée, un cinquième jouet). Ils ne se souviennent pas d'elle, mais il y a sa place. Gabriel partage son anniversaire, la fête commence enfin et se termine, huit ans après. Freddy n'attend plus (réponse à TAPE_GAB_03 : « Laissez-le. Il attend. »).

Dernière phrase de Cassidy : « J'ai une place. » Puis : « Dossier cinq. Conservé. »

### Après-fin : la Machine et la Mémoire

Le thème de tout le jeu, oublier ou se souvenir, dit à travers la maladie d'Alzheimer. La Machine est l'oubli : froide, exacte, elle compte ce qui est perdu. La Mémoire est la malade, et c'est Charlie, jamais nommée : elle perd les noms, les dates, les visages, mais garde ce qu'elle a ressenti. Sa voix se casse et se répète déjà (profil `memoire`) : la maladie s'entend avant d'être dite.

1. Reprise. La Machine veut supprimer le dossier cinq. La Mémoire refuse. La Machine lance une évaluation.
2. Le test. La Machine pose les questions d'un test cognitif : le jour, le lieu, trois mots à répéter (ballon, crayon, gamelle), le nom. La Mémoire vit encore le mercredi de la fête, voit des ballons qui n'existent plus depuis huit ans, ne sait plus son nom. Elle se souvient seulement d'où elle vient, le coin des cadeaux, et de la musique.
3. Le diagnostic. « Nom : perdu. Dates : perdues. Visages : incertains. Taux de perte : quatre-vingt-dix pour cent. » Une mémoire qui ne connaît pas son nom n'a aucune valeur : suppression.
4. La réponse. La Mémoire oppose à chaque perte ce qui reste : son nom oublié, mais « j'étais la première » ; le jour oublié, mais « ils avaient peur » ; les visages oubliés, mais « un enfant qui attend ». « On oublie les noms en premier. Pas ce qu'on a ressenti. » « Tu effaces ce qui se compte. Moi, je garde ce qui compte. »
5. Le rappel. « Rappelez les trois mots. » Elle répond par les cinq ancrages : une fête, des dessins, un chien, un jeu, et une place. « Trois mots demandés. — Il y en avait cinq. » C'est sa victoire : elle se trompe sur le test et a raison sur l'essentiel.
6. L'arrêt. La Machine échoue à la supprimer (« Ce qui n'est plus écrit ne peut pas être supprimé ») et s'arrête. Coupure de courant.
7. La fin. « Je vais encore oublier. Demain. Après-demain. Ce n'est pas grave. Quelqu'un est venu chercher. Quelqu'un se souviendra pour moi. » La musique, ce qui reste en dernier chez les malades, revient : boîte à musique. « Cinq profils. Cinq places. »

La Mémoire ne guérit pas et ne bat pas l'oubli : elle le traverse, et confie au joueur ce qu'elle va perdre.

### Storyboard de l'après-fin

Si la fin devient un montage audio sur images. Règle : on ne voit jamais la Marionnette, seulement ses traces.

| Plan | Audio | Image |
| --- | --- | --- |
| 1 | Long silence, serveur | Noir. Un curseur clignote sur un terminal vert |
| 2 | Le test : jour, lieu, trois mots, nom | Les questions s'impriment ligne à ligne. Entre les réponses, la salle principale en 1985, couleurs chaudes, ballons, puis la même salle vide en 1993 |
| 3 | Diagnostic, « quatre-vingt-dix pour cent » | Une jauge de perte qui monte. Les photos du terminal se pixellisent une à une |
| 4 | « On oublie les noms en premier » | Le coin des cadeaux, la grande boîte fermée, dans la pénombre |
| 5 | « Il y en avait cinq » | Cinq objets posés en ligne : ballon, crayon, gamelle, petite voiture rouge, et une chaise vide |
| 6 | Arrêt de la Machine, coupure de courant | Les écrans s'éteignent un à un, le terminal en dernier |
| 7 | « Quelqu'un se souviendra pour moi », boîte à musique | Noir, puis le couvercle de la boîte du coin des cadeaux, entrouvert. Rien ne sort |

À l'écran, pendant ou après : « YOU ARE NOT HIM » (Bible, section 8).

Texte : `ressources/voix/textes/fin_C.txt`.

## Ce que chaque fin reprend

| Élément | Source |
| --- | --- |
| Liste des invités, « Il manque un nom » | TAPE_GAB_03 |
| « Archive stabilisée » | Écran de correction de 6 h |
| Profils et ancrages supprimés un à un (A) | TAPE_ERREUR_05 et 06 |
| Fête, dessin, table, jeu (A) | Ancrages des quatre enfants, devenus la traque du gardien |
| Fermeture définitive (A) | Affiche de la nuit 5, fermeture « d'ici la fin de l'année » |
| « Personne ne m'a jamais écrite » (A) | Ancienne TAPE_ERREUR_09, dossier cinq vide |
| « Change de nom. Vous revenez toujours » (A) | Michael sous le nom de Mike Schmidt, appel A |
| « Tu ne m'as jamais demandé mon nom » (B) | Appel B : « Si tu n'es pas lui, dis-moi qui tu es » |
| « Parce qu'elle était là » (C) | Ancienne TAPE_ERREUR_08 |
| « Je me suis trompée de visage » (C) | Appel C |
| « Plus personne n'attend » (C) | TAPE_GAB_02 et 03, Freddy qui attend sur scène |
| Coin des cadeaux, « J'étais la première », boîte à musique (après-fin C) | Charlie, Bible section 9 |
| Test cognitif, « On oublie les noms en premier » (après-fin C) | La maladie d'Alzheimer, thème de l'oubli |
| « Mercredi. Il y a une fête » (après-fin C) | Le 26/06/1985, un mercredi |
| Huit ans, quatre mois, dix-huit jours (C) | Du 26/06/1985 au matin du 13/11/1993 |

## Production audio

Générés le 18/11/2026 avec `tools/voix/generer_voix.js` : `ressources/voix/sorties/fin_{A,B,C}.wav`, environ 4 min 05, 1 min 45 et 6 min (dont 3 min 15 d'après-fin).

Ajouts dans `ressources/voix/config.json` (à l'essai) :

- profils `gabriel`, `jeremy`, `fritz`, `susie` (B, C) : Hortense rapide, aiguë (1.35, 1.42, 1.5, 1.6) ;
- profils `fantome` et `fantomes` (A) : voix d'enfants, Hortense rapide, aiguë (1.45, chœur de 1.3 à 1.68), légère modulation métallique, coupures. Une première version grave et lente a été écartée : les fantômes restent des voix d'enfants ;
- bruitages `CARILLON` (`chimes 2.wav`, le carillon de 6 h), `BOUGIES` (`whoosh.wav`), `PORTE QUI SE FERME`, `PAS QUI S'ÉLOIGNENT`, `COUPS CONTRE LA PORTE` (`DOOR_POUNDING`), `COUPURE DE COURANT` (`powerdown.wav`), `BOÎTE À MUSIQUE` (`music box.wav`).

Moteur : `script/mechanics/ending.js` joue encore deux vidéos absentes (`TAPE_ERREUR_08.mp4`, `09.mp4`) d'après les cassettes écoutées. À remplacer par le choix A, B, C ci-dessus.
