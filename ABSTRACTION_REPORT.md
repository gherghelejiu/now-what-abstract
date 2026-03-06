# Abstraction Layer Report

Started: 2026-03-06T08:30:44.950040+00:00
Finished: 2026-03-06T08:38:03.043983+00:00

## What was done
All direct Convex backend calls are now routed through `IBackendProvider`.
The original Convex SDK is preserved inside `src/backend/convex/ConvexProvider.ts`.

## Structure
```
src/backend/
  types.ts                ← domain DTOs, no provider imports
  IBackendProvider.ts     ← the interface every provider must implement
  index.ts                ← change ONE import here to swap backends
  convex/
    ConvexProvider.ts     ← original Convex SDK calls, encapsulated
    index.ts
```

## To add a new backend
1. `src/backend/<name>/MyProvider.ts` — implement `IBackendProvider`
2. Update the import in `src/backend/index.ts`
3. Done — no other files need to change

## Next steps
- `npx tsc --noEmit` — verify TypeScript compiles
- Search `// TODO: remove if switching backend provider` for tricky spots
- Run your test suite to confirm runtime behaviour is unchanged