# Journal des voix et du son

Trace des décisions prises le 17/11/2026 sur les voix générées : ce qui a été essayé, retenu, écarté, et pourquoi. Le fonctionnement de l'outil est dans `ressources/voix/README.md`, la distribution des rôles dans [Casting_Voix.md](Casting_Voix.md).

---

## 1. Outil

- Génération par les voix Windows, sans dépendance : System.Speech pour Hortense, Windows.Media.SpeechSynthesis pour Julie et Paul. Aucune voix d'enfant n'est installée sous Windows en français.
- ffmpeg et sox sont absents de la machine : tous les traitements (hauteur, filtres, inversion, mixage) sont écrits en JavaScript dans `tools/voix/generer_voix.js`.
- Textes, réglages et audios dans `ressources/voix/`, versionnés. Sorties en WAV (pas d'encodeur MP3), 83 Mo pour 24 fichiers.

## 2. Voix de Cassidy

| Essai | Résultat | Décision |
| --- | --- | --- |
| Hortense, `pitch="x-high"`, ralentie de 25 % | 3 min 34 pour l'appel C, trop lent | Écarté |
| Vitesse `0%` | Windows interprète mal la valeur : 7 min 36 | Ne jamais utiliser de pourcentage, écrire `medium` |
| Vitesse `medium` | Fluide, naturel | Retenu |
| `pitch="x-high"` | Aucun effet audible avec Hortense | Gardé dans la config, sans effet |
| Hauteur +20 %, +30 %, +40 %, +30 % avec filtre téléphone | +20 % suffit à rajeunir la voix sans effet dessin animé | **+20 % retenu** |

La hauteur est décalée sans changer la durée (étirement WSOLA puis ré-échantillonnage) : le timbre monte avec la note, c'est ce qui rajeunit.

## 3. Appels de la nuit 5

- Trois versions selon l'enquête (A Conviction, B Doute, C Reconnaissance). Textes dans [Appel_Nuit5.md](Appel_Nuit5.md).
- Convention d'écriture proposée par l'auteur : les passages entre parenthèses restent à l'endroit, le reste est inversé. Le joueur entend « Allô ? », « Je ne veux pas être oubliée », « C'est moi » sans rien faire ; le reste demande d'inverser l'audio.
- Écarté : taper le texte à l'envers pour que la synthèse le lise à l'envers. Une synthèse qui lit des lettres inversées produit un charabia qui ne redonne pas la phrase une fois retourné. On génère à l'endroit et on inverse l'audio.
- Durées : A 1 min 35, B 2 min, C 2 min 32. C est plus long car il annonce la nuit 5 paisible.

## 4. Voix du système

L'IA qui parle dans les cassettes est devenue deux voix opposées, à l'image de la Mémoire et de l'Oubli de la Bible.

| Proposition | Voix | Décision |
| --- | --- | --- |
| 1. Machine Fazbear | Paul, plus grave, numérique 8 kHz 8 bits, modulation métallique, bande étroite | **Retenue** : le système qui corrige et supprime |
| 2. Mémoire du bâtiment, version écho | Julie, ralentie, écho long | Écartée : l'écho est insupportable, le ralenti ne marche pas |
| 2a. Mémoire, bande numérique | Julie, numérique 11 kHz 10 bits | Écartée au profit de 2b |
| 2b. Mémoire corrompue | Julie, numérique 7 kHz 7 bits, coupures et répétitions | **Retenue** : le système qui restaure, et se casse en parlant |
| 3. Écho de Cassidy | Hortense grave et métallique | Écartée : idée forte, mais les dialogues avec Cassidy se distinguaient mal |

Règle tirée de ces essais : pas d'écho, pas de ralenti. La dégradation passe par le numérique, pas par l'espace.

Les accidents de la Mémoire dépendent d'une graine : une même génération donne toujours le même résultat.

## 5. Bruitages et mixage

| Étape | Problème | Solution |
| --- | --- | --- |
| Bruitages en série | La voix attendait la fin de chaque bruitage | Bruitages sur une piste séparée : la réplique démarre en même temps que le bruitage |
| Superposition | La statique couvrait les répliques | Les bruitages baissent de moitié pendant que quelqu'un parle |
| Bruitages consécutifs | Sans réplique entre eux, ils partaient tous ensemble (ERREUR_01 réduite à 5 s) | Enchaînés avec un léger chevauchement ; seul le dernier avant une réplique démarre avec elle |
| Sons de `audio/hidden/` | En 24 bits, stéréo, parfois sans taille de données | Lecteur WAV élargi |

Les bruitages sont reconnus par mot-clé dans les indications des cassettes (75 motifs). Approximations à vérifier à l'oreille : la porte (tiroir de four), tables et chaise (`block.wav`), interrupteur et clic (bip du terminal), musique d'anniversaire (`circus.wav`).

## 6. Casting

Voir [Casting_Voix.md](Casting_Voix.md). En résumé : trois familles de son (archives 1985 sur bande magnétique, système numérique dégradé, présent 1993 en voix nette), dix profils, six comédiens suffisent pour de vraies séances.

Choix d'harmonisation faits à cette occasion : les employés anonymes des cassettes deviennent Pierre D. et Marie L. (CANON_LOGS), le superviseur est un seul personnage, le « Encore... » de FRT_03 est Fritz, l'adulte de ERREUR_03 est Michael.

## 7. Historique des commits

| Commit | Contenu |
| --- | --- |
| `eb60f02` | Générateur et appels de Cassidy |
| `248bdb7` | Voix de la machine et de la mémoire, cassettes 07 à 09 |
| `7a57c5d` | Bruitages sur une piste séparée |
| `629869f` | Casting complet et 21 cassettes |
