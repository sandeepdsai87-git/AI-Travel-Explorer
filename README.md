# AI Travel Explorer

Public baseline of the existing **v14 frontend prototype**, governed by **PRD v0.8**. Seven planning screens are retained. Screens 1–3 have received the latest implementation work; Screen 4 continuation is pending.

## Run locally

Serve the repository with any static server, for example `python -m http.server 8000`, then open `http://localhost:8000/`. No build step or backend is required. A restrictive embedded file preview may prevent outbound API calls; browser success elsewhere does not validate that preview's CSP.

## Current capabilities

- Two entry paths, fixed/flexible duration modes, ordered routes and session-only planning state.
- GeoNames geographic search with a user-supplied authorized username; no account credential is bundled.
- Wikipedia nearby candidates, Wikidata identity/description enrichment and article-linked Wikimedia Commons image metadata.
- Manual experiences, protected must-visits, priorities, coordinate provenance, conflict warnings and shared itinerary state.

Provider coverage, opening hours and subject accuracy are not guaranteed. Visit allowances and itinerary allocation remain illustrative. There are no live transport schedules, seat or booking availability, payments, backend services or production persistence. Original ChatGPT file-preview live access remains PENDING. No CSP bypass is included.

## Documentation and continuation

- [Shared project status and cross-account continuation tracker](PROJECT_STATUS.md) — read before continuing development.
- [PRD v0.8](docs/AI_TRAVEL_EXPLORER_PRD_v0.8.html)
- [v14 checkpoint and Screen 4 handoff](docs/AI_TRAVEL_EXPLORER_v14_Checkpoint_and_Screen4_Handoff.md)
- [Public release audit](docs/BASELINE_AUDIT.md)
- [Artifact hashes](BASELINE_MANIFEST.json)

Do not begin Screen 4 until the continuation scope is explicitly authorized. Preserve the existing implementation and provider boundaries.

## Bounded regression checks

With Node.js installed, run `node tests/run.cjs`. The runner extracts the actual embedded script into a temporary directory and executes the three existing suites. The 54 checks exercise local state and mocked provider contracts; they do not establish current live-provider or browser availability.

## Data and media attribution

GeoNames data, Wikipedia text, Wikidata structured data and Commons files retain their respective terms and source metadata. Commons licenses are per file. Earlier embedded destination-photo fixtures include explicit unverified reuse-rights labels; retaining the exact historical prototype is not a new license clearance. Do not treat all repository assets as freely reusable or deploy them commercially without checking their rights. No blanket code or media license is granted by this migration.

The frontend is byte-for-byte identical to saved v14. Public documentation removes private artifact links and generalizes a dated trip example; application functionality is unchanged.
