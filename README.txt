RUN4FUN VERSJON 6

Inneholder alle funksjoner fra versjon 5 samt Strava-tilkobling, aktivitetsimport og distansematching.

GITHUB PAGES
Last opp og erstatt index.html, manifest.webmanifest, icon.svg og README.txt. Ikke last Worker-filen til GitHub Pages. Data fra versjon 1–5 migreres automatisk på samme lagringsområde.

CLOUDFLARE
run4fun-strava-worker.js er samme Worker-kode som skal ligge i run4fun-strava. Client Secret skal kun ligge som Cloudflare Secret, aldri i GitHub.

BRUK
1. Trykk Koble til Strava og godkjenn.
2. Trykk Importer fra Strava på ønsket planøkt.
3. Velg aktivitet. Beste distansematch vises øverst.
4. Distanse og moving time fylles inn. Legg til belastning og kommentar.
5. Eksporter backup jevnlig.

MERKNAD
Strava-token lagres lokalt i samme nettleserområde som appdata. Safari og hjemskjerm-app kan på iOS ha separate lagringsområder og må da kobles til Strava hver for seg.
