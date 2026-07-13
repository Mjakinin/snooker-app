# Snooker Scoreboard

Eigenstaendige Astro-App fuer ein oeffentliches Snooker-Scoreboard.

<img width="1919" height="1079" alt="grafik" src="https://github.com/user-attachments/assets/c97e4566-9d63-43be-b923-2aaf7adb13e4" />

## Funktionen

- Kurze Startseite unter `/`
- Scoreboard unter `/scoreboard`
- Bis zu 20 Spieler
- Punktebuttons fuer Snooker-Werte und Strafen
- Automatische Sortierung 2 Sekunden nach einer Punkteaenderung
- Responsive Layouts fuer Desktop, Tablet und Smartphone

## Lokal starten

```bash
npm install
npm run dev
```

Die App laeuft danach lokal unter der URL, die Astro im Terminal ausgibt.

## Pruefen und bauen

```bash
npm run check
npm run build
npm run preview
```

## Netlify

Build Command:

```bash
npm run build
```

Publish Directory:

```bash
dist
```

Environment Variables werden nicht benoetigt.

Die App nutzt statische Astro-Routen. Eine SPA-Redirect-Regel ist daher nicht erforderlich.

## Custom Domain

Geplante Domain:

```text
snooker.maxim.tk
```

Bei externem DNS muss ein CNAME fuer `snooker` auf die Netlify-Subdomain der Site gesetzt werden, zum Beispiel:

```text
snooker CNAME snooker-app.netlify.app
```

Danach in Netlify HTTPS/TLS fuer die Custom Domain aktivieren und `/scoreboard` direkt pruefen.
