# NeoBrutal Dashboard

Next.js 15 dashboard scaffold with:

- App Router + TypeScript
- Tailwind CSS
- TanStack Query
- TanStack Table
- Recharts
- URL-backed typed filters
- Mocked dashboard contracts and widget data
- Vitest smoke coverage

## Run

```bash
npm install
npm run dev
```

## Validate

```bash
npm run build
npm run test
```

## Notes

- The overview route lives at `/`.
- A lightweight drill-down route lives at `/campaigns/[campaignId]`.
- Search params are the source of truth for dashboard filters.
- Mock data currently lives in `lib/mock-dashboard.ts`.
