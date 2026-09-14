HALVMARATON WEB-APP VERSJON 5

NYTT
- Lokal lagring med støtte for data fra versjon 1–4.
- Eksport av komplett sikkerhetskopi til JSON-fil.
- Import av sikkerhetskopi med kontroll av antall utførte økter før lokal data erstattes.
- Visning av dato og klokkeslett for siste backup.
- Grønn status når backup er nyere enn 7 dager.
- Tydelig advarsel når backup mangler eller er minst 7 dager gammel.
- Offline service worker avregistreres og gammel HM2026-cache ryddes, uten å slette localStorage-dataene.

FØR OPPDATERING
Eksporter gjerne en sikkerhetskopi fra eksisterende app hvis knappen finnes. Ikke slett Safari-nettstedsdata.

OPPDATER GITHUB PAGES
1. Pakk ut ZIP-filen.
2. Åpne repositoryet på GitHub.
3. Velg Add file og Upload files.
4. Last opp og erstatt index.html, manifest.webmanifest og icon.svg.
5. Last gjerne også opp README.txt.
6. Du kan slette sw.js fra repoet. Versjon 5 avregistrerer den gamle service workeren automatisk.
7. Commit changes og vent 1–3 minutter.
8. Åpne URL-en i Safari først. Når versjon 5 vises, lukk og åpne hjemskjerm-appen.

BACKUP PÅ IPHONE
Trykk Eksporter sikkerhetskopi. iPhone åpner delings-/nedlastingsflyt. Velg Lagre i Filer og gjerne iCloud Drive. Appen registrerer tidspunktet når eksporten startes. Kontroller at filen faktisk finnes i Filer.

VIKTIG
En nettapp kan ikke skrive lydløst til Filer eller iCloud Drive. Du må godkjenne lagringen. Lokal treningsdata beholdes fortsatt i Safari localStorage.
