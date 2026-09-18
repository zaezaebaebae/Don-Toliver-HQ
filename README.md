# Don Toliver HQ

A Next.js dashboard for Spotify listening data and a live Don Toliver discovery feed.

## Start locally

1. Copy `.env.example` to `.env.local` and populate the Spotify, PostgreSQL, and session values.
2. In the Spotify developer dashboard, add the exact value of `SPOTIFY_REDIRECT_URI` as a redirect URI. The app needs **Web API** access and the `user-read-recently-played` scope.
3. Create the tables and start the application:

```bash
npm install
npx prisma migrate dev --name init
npm run dev
```

Spotify's public API exposes the 50 most recent plays, not complete lifetime playback history. Each sync filters that history by Don Toliver's artist ID (`4Gso3d4zSPftj9dYyYB722`) and persists a dated snapshot. The dashboard’s listening figures therefore faithfully describe the latest available Spotify history; a production deployment can maintain a scheduled per-user sync to build a longer-lived aggregate.

## Discovery scheduling

`GET /api/cron/releases` is protected by `Authorization: Bearer $CRON_SECRET`. Vercel invokes it every six hours according to `vercel.json`; QStash can call the same endpoint with that header. The poll uses Spotify for official releases and optionally uses YouTube Data API, SoundCloud, and the public r/DonToliver JSON feed. New database records trigger the configured Resend email alert according to each listener’s notification preference.

Required optional discovery keys are documented in `.env.example`. If a source key is empty, only that source is skipped; the rest of the poll still runs.
