/* ============================================================
   LOGS DATABASE — Toutes les données des logs JSON
   ============================================================ */

const LogsDatabase = {
  WHOAMI: {
    command: "WHOAMI",
    markFound: "WHOAMI",
    type: "text",
    text: "╔══════════════════════════════════════════════════════════════╗\n║                                                              ║\n║            FAZBEAR ENTERTAINMENT - SECURITY SYS              ║\n║                       USER DATABASE                          ║\n║                         v1.8                                 ║\n║                                                              ║\n╚══════════════════════════════════════════════════════════════╝\n\n┌──────────────────────────────────────────────────────────────┐\n│                    UTILISATEUR ACTUEL                       │\n└──────────────────────────────────────────────────────────────┘\n  IDENTITÉ\n  └── [ NON DISPONIBLE ]\n  POSTE\n  └── VEILLEUR DE NUIT\n  STATUT\n  └── ACTIF\n  NIVEAU D'AUTORISATION\n  └── 01\n\n════════════════════════════════════════════════════════════════\n\n┌──────────────────────────────────────────────────────────────┐\n│                  UTILISATEUR PRÉCÉDENT                      │\n└──────────────────────────────────────────────────────────────┘\n\n  IDENTITÉ\n  └── [ NON DISPONIBLE ]\n  POSTE\n  └── VEILLEUR DE NUIT\n  STATUT\n  └── ARCHIVÉ\n  DATE DE DÉPART\n  └── INCONNUE\n\n\n════════════════════════════════════════════════════════════════\n\n┌──────────────────────────────────────────────────────────────┐\n│                   RAPPORT DE DÉPART                         │\n└──────────────────────────────────────────────────────────────┘\n\n\n  MOTIF :\n\n  > ABSENCE NON JUSTIFIÉE\n\n\n  DOCUMENT ASSOCIÉ :\n\n  └── AUCUN\n\n\n  RAPPORT FINAL :\n\n  └── NON TRANSMIS\n\n\n════════════════════════════════════════════════════════════════\n\n\n┌──────────────────────────────────────────────────────────────┐\n│                       SYSTÈME                              │\n└──────────────────────────────────────────────────────────────┘\n\n\n  DOSSIER :\n  ⚠ INCOMPLET\n\n\n  INFORMATIONS MANQUANTES :\n  \n  [X] IDENTITÉ\n  [X] DATE DE DÉPART\n  [X] RAPPORT FINAL\n\n\n════════════════════════════════════════════════════════════════\n\n\n> RETOUR AU TERMINAL...",
    glitch: false
  },

  USER: {
    command: "USER",
    markFound: "USER",
    type: "text",
    text: "╔══════════════════════════════════════════════════════════════╗\n║                    USER DATABASE                            ║\n╚══════════════════════════════════════════════════════════════╝\n\nUTILISATEUR ACTUEL :\nChargement...\nUNKNOWN\n\nTentative de récupération :\nAncien utilisateur :\nMICHAEL AFTON\n\nCorrection automatique :\nWILLIAM AFTON\n\nERREUR :\nCorrespondance impossible.\n\nAnalyse comportementale :\nUtilisateur :\nNON IDENTIFIÉ\n\nNouvelle valeur enregistrée :\n\"IT'S HIM\"",
    glitch: false
  },

  LOGS: {
    command: "LOGS",
    markFound: "LOGS",
    type: "text",
    text: "╔══════════════════════════════════════════════════════════════╗\n║          FAZBEAR ENTERTAINMENT - LOST v1.2                   ║\n║             REGISTRE DES OBJETS TROUVÉS                      ║\n╚══════════════════════════════════════════════════════════════╝\n\n> OUVERTURE : INCIDENTS.LOG\n\n════════════════════════════════════════════════════════════════\n\nOBJETS ENREGISTRÉS\n\n N°     DATE         OBJET                 STATUT\n──────────────────────────────────────────────────────────────\n\n 003    12/04/1989   Peluche ours          NON RÉCLAMÉ\n\n 005    18/04/1989   Chaussure enfant      NON RÉCLAMÉ\n\n════════════════════════════════════════════════════════════════\n\nFICHE OBJET N°003\n\n Objet ............... Peluche ours\n Découverte .......... Salle principale\n Réclamé ............. NON\n Durée de stockage ... 87 jours\n Statut .............. ARCHIVÉ\n\nFICHE OBJET N°005\n\n Objet ............... Chaussure enfant\n Découverte .......... Salle d'anniversaire\n Réclamé ............. NON\n Durée de stockage ... 81 jours\n Statut .............. ARCHIVÉ\n\n════════════════════════════════════════════════════════════════\n\nDernière synchronisation : 03/07/1989",
    glitch: false
  },

  ARCHIVE: {
    command: "ARCHIVE",
    markFound: "ARCHIVE",
    type: "text",
    text: "╔══════════════════════════════════════════════════════════════╗\n║         FAZBEAR ENTERTAINMENT - EVENTS v2.1                  ║\n║             ARCHIVES DES FESTIVITÉS                          ║\n╚══════════════════════════════════════════════════════════════╝\n\n> OUVERTURE : ARCHIVE.LOG\n\n════════════════════════════════════════════════════════════════\n\nÉVÉNEMENTS ENREGISTRÉS\n\n DATE         TYPE                 STATUT\n──────────────────────────────────────────────────────────────\n\n 12/04/1989   Anniversaire privé   TERMINÉ\n 21/04/1989   Anniversaire privé   TERMINÉ\n\n════════════════════════════════════════════════════════════════\n\nDOSSIER : 12/04/1989\n Invités enregistrés ......... 47\n Départs enregistrés ......... 47\n Incident déclaré ............ NON\n Clôture de l'événement ...... VALIDÉ\n\nDOSSIER : 21/04/1989\n Invités enregistrés ......... 32\n Départs enregistrés ......... 32\n Incident déclaré ............ NON\n Clôture de l'événement ...... VALIDÉ\n\n════════════════════════════════════════════════════════════════\n\nStatut des archives : Synchronisation OK - Intégrité 100%\nDernière vérification : 03/07/1989",
    glitch: false
  },

  STAFF: {
    command: "STAFF",
    markFound: "STAFF",
    type: "text",
    text: "╔══════════════════════════════════════════════════════════════╗\n║               FAZBEAR ENTERTAINMENT - RH v1.4                ║\n║                     PERSONNEL AUTORISÉ                       ║\n╚══════════════════════════════════════════════════════════════╝\n\n> OUVERTURE : STAFF.LOG\n\n════════════════════════════════════════════════════════════════\n\nEMPLOYÉS ENREGISTRÉS\n\n ID    NOM                  POSTE\n──────────────────────────────────────────────────────────────\n\n 001   Pierre D.            Service\n 002   Marie L.             Cuisine\n 003   Antoine M.           Sécurité\n\n════════════════════════════════════════════════════════════════\n\nNOTE INTERNE N°89-14\n\n ÉTAT ............ ACTIVE\n DATE ............ 03/07/1989\n AUTEUR .......... DIRECTION\n\n──────────────────────────────────────────────────────────────\n\nSuite aux événements de l'été 1989,\naucune information ne doit être\ncommuniquée aux clients.\n\nToutes les demandes doivent être\nredirigées vers la direction.\n\nLes archives de cette période sont\nréservées au personnel autorisé.",
    glitch: false
  },

  SUDO: {
    command: "SUDO",
    markFound: "SUDO",
    type: "text",
    text: "╔══════════════════════════════════════════════════════════════╗\n║           FAZBEAR ENTERTAINMENT - SYS v1.8                   ║\n║              CONTRÔLE DES AUTORISATIONS                      ║\n╚══════════════════════════════════════════════════════════════╝\n\n> EXÉCUTION : SUDO\n\n════════════════════════════════════════════════════════════════\n\nAUTORISATION REFUSÉE\n\nDernier administrateur :\n[SUPPRIMÉ]\n\nDernière connexion :\n1247 jours",
    glitch: false
  },

  CLOSED: {
    command: "CLOSED",
    label: "TRÈS RARE",
    markFound: "CLOSED",
    type: "sequence",
    sequence: [
      { text: "\n╔══════════════════════════════════════════════════════════════╗\n║             PROCÉDURE DE FERMETURE                          ║\n╚══════════════════════════════════════════════════════════════╝\n\nNettoyage ............. OK\nExtinction lumières ... OK\nCuisine ............... OK\nAnimatroniques ........ OK\nInvités ............... OK\n\n--------------------------------------------------------------\n\nAnalyse du bâtiment...", delay: 0, glitch: false },
      { text: "\nAnalyse du bâtiment...\nVérification des accès...", delay: 2500, glitch: false },
      { text: "\nAnalyse du bâtiment...\nVérification des accès...\nContrôle des salles...", delay: 2500, glitch: false },
      { text: "\nAnalyse du bâtiment...\nVérification des accès...\nContrôle des salles...\nRecherche des occupants...", delay: 3000, glitch: false },
      { text: "\nAnalyse terminée.\n\n...", delay: 3500, glitch: false },
      { text: "\nAnalyse terminée.\n\nERREUR", delay: 2000, glitch: true },
      { text: "\nAnalyse terminée.\n\nERREUR\n\n1 enfant est toujours\nprésent dans le bâtiment.", delay: 2800, glitch: true, flash: true, flashDuration: 600 },
      { text: "\nImpossible de fermer\nle restaurant.\n\nNouvelle tentative...", delay: 3500, glitch: true },
      { text: "\nImpossible de fermer\nle restaurant.\n\nNouvelle tentative...\n\nNouvelle tentative...", delay: 2500, glitch: true, flash: true, flashDuration: 800 },
      { text: "\nImpossible de fermer\nle restaurant.\n\nNouvelle tentative...\n\nNouvelle tentative...\n\nNouvelle tentative...", delay: 2500, glitch: true },
      { text: "\nImpossible de fermer\nle restaurant.\n\nNouvelle tentative...\n\nNouvelle tentative...\n\nNouvelle tentative...\n\nÉCHEC.", delay: 2500, glitch: true, flash: true, flashDuration: 1200 },
      { text: "\nLe restaurant reste ouvert.\n\nEn attente...\n\n█", delay: 4000, glitch: true }
    ]
  },

  LOST_OBJECTS: {
    command: "LOST_OBJECTS",
    label: "rare",
    markFound: "LOST_OBJECTS",
    type: "sequence",
    sequence: [
      { text: "\n╔══════════════════════════════════════════════════════════════╗\n║                OBJETS TROUVÉS                               ║\n╚══════════════════════════════════════════════════════════════╝\nN°      OBJET               STATUT\n442     Veste bleue         RENDUE\n443     Voiture             RENDUE\n444     Sac à dos           RENDU\n445     Casquette           EN ATTENTE\n\n--------------------------------------------------------------\n\nPROPRIÉTAIRE :      INCONNU\nTEMPS D'ATTENTE :   4018 jours\nStatut :            Personne n'est revenu.", delay: 0, glitch: false },
      { text: "PARTY", delay: 9200, glitch: true, flash: true, flashDuration: 2000 }
    ]
  },

  BALLOON: {
    command: "BALLOON",
    label: "rare",
    markFound: "BALLOON",
    type: "sequence",
    sequence: [
      { text: "\n╔══════════════════════════════════════════════════════════════╗\n║               INVENTAIRE DÉCORATION                         ║\n╚══════════════════════════════════════════════════════════════╝\n\nROUGE      ████████████████████ 37\nBLEU       ███████████████████████ 42\nVERT       █████████ 18\nJAUNE      █ 1", delay: 0, glitch: false },
      { text: "Objet détecté : BALLON JAUNE\nPosition :      SALLE PRINCIPALE\nAucune demande de décoration enregistrée.", delay: 9200, glitch: true, flash: true, flashDuration: 2000 }
    ]
  },

  TABLES: {
    command: "TABLES",
    label: "rare",
    markFound: "TABLES",
    type: "sequence",
    sequence: [
      { text: "\n╔══════════════════════════════════════════════════════════════╗\n║                PLAN DE LA SALLE                             ║\n╚══════════════════════════════════════════════════════════════╝\n\n            TABLE ANNIVERSAIRE\n\n          ○────○────○\n          │          │\n          ○────○────○\n                 ▲\n             CHAISE DÉPLACÉE\n\n--------------------------------------------------------------\n\nDernière vérification :     26/06\nSignalement maintenance :   AUCUN", delay: 0, glitch: false },
      { text: "\n\nTemps écoulé :  11 ans", delay: 9200, glitch: true, flash: true, flashDuration: 2000 }
    ]
  },

  GUESTS: {
    command: "GUESTS",
    label: "rare",
    markFound: "GUESTS",
    type: "sequence",
    sequence: [
      { text: "\n> OUVERTURE DU FICHIER GUESTS.LOG...\n\nAnalyse de la réservation...\n\n✓ Jeremy\n✓ Susie\n✓ Fritz\n✓ Gabriel\n--------------------------------------------------------------\nINVITÉS PRÉVUS ......... 4\nINVITÉS PRÉSENTS ....... 4", delay: 0, glitch: false },
      { text: "\nERREUR\n\n□ ???????? \n\nUne réservation est incomplète.\n\nLe système attend toujours\nle dernier invité.", delay: 9200, glitch: true, flash: true, flashDuration: 2000 }
    ]
  },

  PARTY: {
    command: "PARTY",
    label: "rare",
    markFound: "PARTY",
    type: "sequence",
    sequence: [
      { text: "\n> OUVERTURE DU FICHIER PARTY.LOG...\n\n--------------------------------------------------------------\n\nDATE      TYPE          INV.   Âge  STATUT\n--------------------------------------------------------------\n\n04/06     ANNIVERSAIRE   11    6 ANS  TERMINÉ\n09/06     ANNIVERSAIRE   15    8 ANS  TERMINÉ\n26/06     ANNIVERSAIRE    4    7 ANS  TERMINÉ", delay: 0, glitch: false },
      { text: "\nERREUR\n26/06     ANNIVERSAIRE    5    7 ANS  INTERROMPU", delay: 9200, glitch: true, flash: true, flashDuration: 2000 }
    ]
  },

  CAMLOG: {
    command: "CAMLOG",
    label: "rare",
    markFound: "CAMLOG",
    type: "sequence",
    sequence: [
      { text: "CAMÉRA 03\n\nArchive disponible.\n\nDate :\n18 avril 1989\n\nHeure :\n18h41", delay: 0, glitch: false },
      { text: "FICHIER CORROMPU", delay: 1200, glitch: true },
      { text: "1 personne détectée", delay: 900, glitch: true, flash: true, flashDuration: 1000 }
    ]
  },

  LOST001: {
    command: "LOST001",
    markFound: "LOST001",
    type: "text",
    text: "╔══════════════════════════════════════════════════════════════╗\n║              DOSSIER OBJET PERDU : LOST001                   ║\n╚══════════════════════════════════════════════════════════════╝\n\nObjet ................. Chaise enfant (zone repas)\n\nStatut ................ Déplacée puis retrouvée.\n\nRéclamation ........... Aucune\n\n════════════════════════════════════════════════════════════════\n\nAnnotation sécurité :\n\n\"Mouvement non expliqué.\"",
    glitch: false
  },

  LOST: {
    command: "LOST",
    label: "fin de nuit seulement",
    markFound: "LOST",
    minHour: 5,
    type: "text",
    text: "╔══════════════════════════════════════════════════════════════╗\n║          FAZBEAR ENTERTAINMENT - LOST v1.2                   ║\n║             REGISTRE DES OBJETS TROUVÉS                      ║\n╚══════════════════════════════════════════════════════════════╝\n\n> OBJETS ACTUELLEMENT EN ATTENTE\n\n════════════════════════════════════════════════════════════════\n\nOBJETS TROUVÉS\n\n Ballon bleu\n Peluche ours\n Casquette rouge\n Bracelet rose\n\n════════════════════════════════════════════════════════════════\n\nEn attente de récupération.",
    glitch: false
  }
};

/* Fonction pour accéder à un log spécifique */
function getLog(commandName) {
    return LogsDatabase[commandName] || null;
}