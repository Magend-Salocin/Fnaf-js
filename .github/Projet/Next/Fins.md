# Fins

Les trois enregistrements de fin, joués après le chèque de paie de la nuit 5. Ils remplacent TAPE_ERREUR_08 (« Reconnaissance ») et TAPE_ERREUR_09 (« Correction »), dont l'original reste dans `ressources/Tape/` comme archive. Découle de [Bible.md](Bible.md), section 8, et répond à [Appel_Nuit5.md](Appel_Nuit5.md).

Statut : premier jet du 18/11/2026, textes et conditions à valider. Version anglaise après validation.

---

## Principe

- Trois fins, comme les trois appels : A Effacement, B Témoin, C Reconnaissance. L'appel annonce la Cassidy de la nuit, la fin dit ce qu'il en reste.
- Ce n'est plus une cassette que l'on trouve : c'est ce que le bâtiment enregistre à 6 h, le matin du samedi 13/11/1993. Le format reste celui des cassettes (bruitages, plusieurs voix).
- Chaque fin donne la parole à tous ceux que le joueur a croisés : le système, Pierre D. sur une bande de 1985, les quatre enfants chacun avec sa voix, Michael, Cassidy.
- Le même fil revient dans les trois : la liste des invités de TAPE_GAB_03 (« Il manque un nom »). Elle est corrigée en A, laissée en suspens en B, complétée d'une ligne sans nom en C.
- Ce qui ne change pas : Cassidy n'a jamais de nom, personne ne nomme William, Michael ne dit jamais qui il est, aucune voix ne désigne Charlie (l'ancienne réplique « Avec les autres » de la voix « puppet » disparaît).

## Choix de la fin

Proposition : la fin se calcule après le dernier écran de correction de la nuit 5, avec les seuils de l'appel. Le joueur qui corrige tout pendant la nuit 5 peut donc tomber de B en A.

| Fin | Condition | Correspondance Bible |
| --- | --- | --- |
| A — Effacement | Moins de 8 maillons, ou majorité d'anomalies corrigées | Effacement |
| B — Témoin | De 8 à 14 maillons, ou chaîne de Cassidy incomplète | Témoin |
| C — Reconnaissance | 15 maillons ou plus, chaîne de Cassidy complète, anomalies majoritairement conservées | Reconnaissance |

Mourir en nuit 5 donne le game over habituel, sans fin.

À trancher : la Bible réserve Effacement aux joueurs qui corrigent. Un joueur qui n'a presque rien trouvé mais n'a rien corrigé tombe ici en A. L'autre option est de l'envoyer en B.

## A — Effacement

Voix principale : la Machine. Le système stabilise les archives une à une ; chaque enfant est coupé au milieu de sa phrase. Il ne reste rien du cinquième profil à effacer. Cassidy, toujours sûre d'avoir reconnu William, le regarde partir une seconde fois et promet d'attendre. Pierre relit la liste des invités et la trouve correcte : plus personne ne remarque qu'il manque un nom. La musique d'anniversaire démarre, puis est coupée.

Dernière phrase : « Système stable. »

Texte : `ressources/voix/textes/fin_A.txt`.

## B — Témoin

Voix principale : la Mémoire. Michael finit sa nuit, entend peut-être quelqu'un, part sans se retourner. Après son départ, la Mémoire continue seule la visite : la fête est prête mais attend quelqu'un, le dessin a « tout le monde, je crois », la gamelle est pleine, Fritz compte cinq jouets puis se reprend. La recherche du nom est abandonnée faute de veilleur. Cassidy lui reproche de ne jamais lui avoir demandé son nom. La Machine annonce un nouveau veilleur pour lundi : la boucle recommence.

Dernière phrase : « C'est moi. » (le IT'S ME de la Bible).

Texte : `ressources/voix/textes/fin_B.txt`.

## C — Reconnaissance

Voix principale : la Mémoire. Elle rejoue la liste de 1985 et ajoute une ligne sans nom ; la Machine veut la supprimer, la Mémoire refuse (« Parce qu'elle était là »). Cassidy reconnaît que le gardien n'est pas lui ; il lui demande son nom, elle ne s'en souvient plus, mais il a demandé. Les quatre enfants voient chacun la trace en plus (une chaise, un enfant sur le dessin, une part gardée, un cinquième jouet). Ils ne se souviennent pas d'elle, mais il y a sa place. Gabriel partage son anniversaire, la fête commence enfin et se termine, huit ans après. Freddy n'attend plus (réponse à TAPE_GAB_03 : « Laissez-le. Il attend. »).

Dernière phrase de Cassidy : « J'ai une place. » Puis : « Dossier cinq. Conservé. »

À l'écran, pendant ou après : « YOU ARE NOT HIM » (Bible, section 8).

Texte : `ressources/voix/textes/fin_C.txt`.

## Ce que chaque fin reprend

| Élément | Source |
| --- | --- |
| Liste des invités, « Il manque un nom » | TAPE_GAB_03 |
| « Archive stabilisée » | Écran de correction de 6 h |
| « Restaurant prêt pour les prochains visiteurs » | TAPE_JER_02 |
| Gâteau, dessin pas fini, chien attendu, « Encore » | Ancrages des quatre enfants, TAPE_FRT_03 |
| « Je t'ai reconnu », « Tu t'en vas. Encore » (A) | Appel A, la fuite de William en 1985 |
| « Tu ne m'as jamais demandé mon nom » (B) | Appel B : « Si tu n'es pas lui, dis-moi qui tu es » |
| « Parce qu'elle était là » (C) | Ancienne TAPE_ERREUR_08 |
| « Je me suis trompée de visage » (C) | Appel C |
| « Plus personne n'attend » (C) | TAPE_GAB_02 et 03, Freddy qui attend sur scène |
| Huit ans, quatre mois, dix-huit jours (C) | Du 26/06/1985 au matin du 13/11/1993 |

## Production audio

Générés le 18/11/2026 avec `tools/voix/generer_voix.js` : `ressources/voix/sorties/fin_{A,B,C}.wav`, environ 2 min 05, 1 min 55 et 2 min 55.

Ajouts dans `ressources/voix/config.json` (à l'essai) :

- profils `gabriel`, `jeremy`, `fritz`, `susie` : Hortense, chacun à la hauteur de sa voix dans le chœur `enfants` (1.08, 1.15, 1.28, 1.4) ;
- bruitages `CARILLON` (`chimes 2.wav`, le carillon de 6 h), `BOUGIES` (`whoosh.wav`), `PORTE QUI SE FERME`, `PAS QUI S'ÉLOIGNENT`.

Moteur : `script/mechanics/ending.js` joue encore deux vidéos absentes (`TAPE_ERREUR_08.mp4`, `09.mp4`) d'après les cassettes écoutées. À remplacer par le choix A, B, C ci-dessus.
