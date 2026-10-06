# ROMA Pairing Web

WhatsApp session generator with a **Vercel frontend** and a persistent **Render Baileys backend**.

## Architecture

- **Vercel** serves the UI from `public/` and proxies `/api/*`.
- **Render** runs the long-lived Express + Baileys process.
- **MongoDB** stores encrypted Baileys auth state and session metadata.
- The generated `ROMA~...` Session ID can be supplied to the separate ROMA MD bot as `SESSION_ID`.

Vercel should not run the Baileys process itself because the WhatsApp connection needs a long-lived WebSocket/background process.

## 1. Deploy the backend on Render

Create a Render Web Service from this repository. The included `render.yaml` and `Dockerfile` are ready for it.

Set these Render environment variables:

```env
MONGODB_URI=mongodb+srv://...
SESSION_ENCRYPTION_KEY=64_hex_characters
INTERNAL_SECRET=change_this_to_a_long_random_secret
SESSION_PREFIX=ROMA~
PORT=10000
```

After deploy, copy the Render service URL, for example:

```
https://roma-pairing-web.onrender.com
```

## 2. Deploy the frontend on Vercel

Import the same repository into Vercel.

Set this Vercel environment variable:

```env
ROMA_API_BASE=https://YOUR-RENDER-SERVICE.onrender.com
```

The Vercel function in `api/[...path].js` forwards pairing/status requests to that Render backend.

No Baileys process runs on Vercel.

## 3. Use the generated session

Open the Vercel URL, generate a Pair Code or QR, complete WhatsApp linking, and copy the generated `ROMA~...` Session ID into the ROMA MD bot's `SESSION_ID` environment variable.

Keep the Session ID, MongoDB URI, and encryption key private.

## Local development

```bash
npm install
cp .env.example .env
npm start
```

For local frontend + backend, leave `ROMA_API_BASE` empty so the browser talks to the same local Express server.
