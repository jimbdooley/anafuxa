# anafuxa

Initial skeleton for a pure JavaScript web-based engineering tool for analyzing and editing FUXA projects.

## Current scope

This scaffold provides:

- A minimal `Node.js` + `Express` static server
- A plain HTML/CSS/JavaScript frontend in `public/`
- Four client-side navigation sections:
  - Home / Summarize for AI
  - Tag Insights
  - Script Insights
  - Tag Edit
- A basic local file picker for FUXA project JSON files
- A simple translation system for English, Spanish, and Chinese
- A `localStorage`-backed settings object for language and future preferences
- Placeholder UI for future client-side validation and TOON generation

No FUXA parsing, analysis, TOON conversion, tag editing, or server-side project processing is implemented yet.

## Architecture notes

- FUXA project files are intended to be processed entirely in the browser.
- The Express server serves static files only.
- There is no backend API, database, authentication layer, C++ build pipeline, or WebAssembly dependency.

## Project structure

```text
anafuxa/
  package.json
  server.js
  public/
    index.html
    css/
      styles.css
    js/
      app.js
      strings.js
```

## Run the app

Install dependencies:

```bash
npm install
```

Start the server:

```bash
npm start
```

Then open:

```text
http://localhost:3000
```

## Frontend notes

- `public/js/strings.js` contains the translation data and string helpers.
- `public/js/app.js` contains UI behavior and settings persistence.
- Settings are stored in `localStorage` under:

```text
anafuxa.settings
```

## Status

This is currently a pure JS application shell intended for future browser-side FUXA tooling.
