@echo off
rem Imprime des documents Markdown en PDF, au style carnet de bord.
rem
rem   Glisser un ou plusieurs .md sur ce fichier : le PDF est créé puis ouvert.
rem   Dans un terminal : tools\impression\imprimer.cmd "chemin\vers\fichier.md"
rem   Sans argument : tous les documents de .github\Projet\03 - Technique\
rem
rem Les PDF sont écrits dans .github\Projet\_impression\.
chcp 65001 >nul
setlocal

node "%~dp0imprimer_doc.js" --ouvrir %*
set "CODE=%ERRORLEVEL%"

rem En cas d'erreur, garder la fenêtre ouverte (utile après un glisser-déposer).
if not "%CODE%"=="0" pause

exit /b %CODE%
