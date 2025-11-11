# File Drop - Einfache Upload-Website

Eine minimalistische, benutzerfreundliche Datei-Upload-Website für Cloudflare Pages mit R2 Storage.

## Features

- ✅ **Sehr einfache Bedienung** - Speziell für betagte Benutzer optimiert
- 📱 **Mobile & Desktop** - Responsive Design für alle Geräte
- 🎯 **Drag & Drop** - Dateien einfach ziehen und ablegen
- 💬 **Optional Nachricht** - Möglichkeit, eine Nachricht hinzuzufügen
- 🔗 **URL Slug Support** - Slug wird automatisch als Metadata gespeichert
- ☁️ **Cloudflare R2** - Zuverlässiger, kostengünstiger Storage

## Setup

### 1. R2 Bucket erstellen

```bash
# Mit Wrangler CLI
wrangler r2 bucket create file-drop-bucket
wrangler r2 bucket create file-drop-bucket-preview
```

Oder im Cloudflare Dashboard:
1. Gehe zu R2
2. Erstelle einen Bucket namens `file-drop-bucket`

### 2. Cloudflare Pages deployen

#### Option A: Mit Wrangler CLI

```bash
# Installiere Wrangler
npm install -g wrangler

# Login
wrangler login

# Deploy
wrangler pages deploy . --project-name=file-drop
```

#### Option B: Git-Integration

1. Push zu GitHub
2. Verbinde Repository mit Cloudflare Pages
3. Build-Einstellungen:
   - **Build command:** (leer lassen)
   - **Build output directory:** `/`
   - **Root directory:** `/`

### 3. R2 Binding konfigurieren

Im Cloudflare Dashboard:
1. Gehe zu Pages → Dein Projekt → Settings → Functions
2. Füge R2 Bucket Binding hinzu:
   - **Variable name:** `FILE_BUCKET`
   - **R2 bucket:** `file-drop-bucket`

Oder mit Wrangler:
```bash
wrangler pages deployment create . --project-name=file-drop --binding FILE_BUCKET=file-drop-bucket
```

## Verwendung

### Einfacher Upload
Besuche einfach die Website: `https://your-project.pages.dev`

### Mit URL Slug
Besuche: `https://your-project.pages.dev/kunde123`

Der Slug wird automatisch als Metadata beim Upload gespeichert.

## Metadata

Jede hochgeladene Datei enthält folgende Metadata:
- `originalName` - Original Dateiname
- `uploadedAt` - Zeitstempel des Uploads
- `contentType` - MIME-Type der Datei
- `size` - Dateigröße in Bytes
- `message` - Optionale Nachricht (falls angegeben)
- `slug` - URL Slug (falls vorhanden)

## Dateien verwalten

### Dateien auflisten
```bash
wrangler r2 object list file-drop-bucket
```

### Datei herunterladen
```bash
wrangler r2 object get file-drop-bucket/FILENAME --file=output.txt
```

### Datei löschen
```bash
wrangler r2 object delete file-drop-bucket/FILENAME
```

### Metadata anzeigen
```bash
wrangler r2 object get file-drop-bucket/FILENAME --file=- --pipe | head -0
```

## Lokale Entwicklung

```bash
# Mit Wrangler Dev
wrangler pages dev . --r2 FILE_BUCKET

# Oder mit miniflare
npm install -D miniflare
npx wrangler pages dev . --r2 FILE_BUCKET
```

## Anpassungen

### Design ändern
Bearbeite die CSS-Styles in `index.html` (Zeilen 9-182)

### Upload-Logik ändern
Bearbeite `functions/api/upload.js`

### Bucket-Namen ändern
Bearbeite `wrangler.toml` und passe die `bucket_name` Werte an

## Sicherheitshinweise

⚠️ Diese einfache Version hat **keine** Authentifizierung. Jeder kann Dateien hochladen.

Für Produktionsumgebungen sollten Sie:
- Rate Limiting hinzufügen
- Dateigrößen-Limits setzen
- Dateityp-Validierung implementieren
- Optional: Passwortschutz oder Authentifizierung

## Kosten

Cloudflare R2:
- Erste 10 GB Storage: **kostenlos**
- Erste 1 Million Class A Operationen/Monat: **kostenlos**
- Erste 10 Millionen Class B Operationen/Monat: **kostenlos**

Cloudflare Pages:
- 500 Builds/Monat: **kostenlos**
- Unlimited Requests: **kostenlos**

## Support

Bei Problemen:
1. Überprüfe die R2 Binding-Konfiguration
2. Schaue in die Browser-Konsole für Fehler
3. Überprüfe Cloudflare Pages Logs

## Lizenz

Siehe LICENSE Datei
