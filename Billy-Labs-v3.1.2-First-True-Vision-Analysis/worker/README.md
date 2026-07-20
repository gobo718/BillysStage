# Billy Labs Worker — v2.4.0

This Worker powers live blurblet publishing and the existing cloud foundations.

## One-time activation

1. Install dependencies: `npm install`
2. Create D1: `npm run db:create`
3. Copy the returned database ID into `wrangler.toml`.
4. Apply migrations: `npm run db:migrate:remote`
5. Create the Curator key: `npx wrangler secret put CURATOR_PUBLISH_KEY`
6. Deploy: `npm run deploy`
7. Open **Curator → Settings** on the website, enter the Worker URL and the same publish key, then test the connection.
8. Download `billy-cloud-config.js` from that screen and replace the public site's copy once.

After activation, **Update Blurblet Only** writes directly to D1 and public mashup pages retrieve the published text from the Worker.

## Endpoints

- `GET /api/health`
- `GET /api/blurblets/:mashupId`
- `PUT /api/curator/blurblets/:mashupId`
- `POST /api/devices/register`
- `GET /api/devices/:deviceId`
- `GET|PUT /api/users/:userId/favorites`
- `GET|PUT /api/users/:userId/progress`


## v3.1.2 vision analysis secrets

Set these Worker secrets before deploying real visual analysis:

```sh
npx wrangler secret put OPENAI_API_KEY
npx wrangler secret put CURATOR_PUBLISH_KEY
```

Optional model override:

```sh
npx wrangler secret put OPENAI_VISION_MODEL
```

The default model is `gpt-4.1-mini`. The browser sends only the canonical mashup ID and rendered artwork URL. Ingredient names and canonical labels are deliberately excluded from the vision request.
