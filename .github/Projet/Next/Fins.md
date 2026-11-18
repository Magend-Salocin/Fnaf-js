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

À trancher : la Bible réserve Effacement aux joueurs qui corrigent. Un joueur qui n'a presque rien trouvé mais n'a rien corrigé tombe ici en A. L'autre option est de l'envoyer en B.

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

Après-fin, après la fin de bande et un long silence : la Machine reprend et veut supprimer le dossier cinq. La Mémoire refuse. Sommée de s'identifier, elle n'a aucune trace d'installation ; son origine est le « coin des cadeaux ». « Je n'ai pas été installée. J'étais là avant vous. J'étais la première. » Elle a donné un ancrage à chacun des quatre, n'avait rien trouvé pour la cinquième, et cette nuit quelqu'un a cherché avec elle. La Machine tente deux fois de la supprimer, échoue (« Tu effaces depuis huit ans. Moi, je donne. »), manque d'autorité et s'arrête. Coupure de courant. « Cinq profils. Cinq ancrages. Dossier cinq. Une place. » Boîte à musique.

Le joueur qui connaît FNAF reconnaît la Marionnette (Prize Corner, première victime, « give gifts, give life ») ; les autres entendent seulement que la mémoire gagne sur l'effacement.

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
| Coin des cadeaux, « J'étais la première », « Moi, je donne », boîte à musique (après-fin C) | Charlie, Bible section 9 |
| Huit ans, quatre mois, dix-huit jours (C) | Du 26/06/1985 au matin du 13/11/1993 |

## Production audio

Générés le 18/11/2026 avec `tools/voix/generer_voix.js` : `ressources/voix/sorties/fin_{A,B,C}.wav`, environ 4 min 05, 1 min 45 et 4 min 30 (dont 1 min 45 d'après-fin).

Ajouts dans `ressources/voix/config.json` (à l'essai) :

- profils `gabriel`, `jeremy`, `fritz`, `susie` (B, C) : Hortense rapide, aiguë (1.35, 1.42, 1.5, 1.6) ;
- profils `fantome` et `fantomes` (A) : voix d'enfants, Hortense rapide, aiguë (1.45, chœur de 1.3 à 1.68), légère modulation métallique, coupures. Une première version grave et lente a été écartée : les fantômes restent des voix d'enfants ;
- bruitages `CARILLON` (`chimes 2.wav`, le carillon de 6 h), `BOUGIES` (`whoosh.wav`), `PORTE QUI SE FERME`, `PAS QUI S'ÉLOIGNENT`, `COUPS CONTRE LA PORTE` (`DOOR_POUNDING`), `COUPURE DE COURANT` (`powerdown.wav`), `BOÎTE À MUSIQUE` (`music box.wav`).

Moteur : `script/mechanics/ending.js` joue encore deux vidéos absentes (`TAPE_ERREUR_08.mp4`, `09.mp4`) d'après les cassettes écoutées. À remplacer par le choix A, B, C ci-dessus.
