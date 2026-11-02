# Public baseline audit — 2 November 2026

## Scope

Only the saved v14 frontend, authoritative PRD v0.8, checkpoint/continuation handoff, existing regression suites and migration documentation are included. No runtime environment, browser sessions, logs, credential files, screenshots or personal booking documents are included.

## Findings and resolution

- No embedded API keys, access tokens, passwords, private keys, personal email addresses, phone numbers or booking identifiers were found in the selected artifact text.
- The frontend's GeoNames username is empty by default and configured at runtime. It remains byte-identical to saved v14; no application behavior changed.
- Private ChatGPT artifact links/identifiers and a local runtime workspace path were removed from the public handoff. Equivalent repository-relative references are provided.
- The PRD's exact future trip-date/group example was generalized to an illustrative five-day sample group. Capability requirements and route example are retained. The source PRD hash records the exact retrieved artifact; the public-copy hash records the documentation-only sanitization.
- Public geographic coordinates, sample destinations, creator credits and third-party source links are intentional product data. Historical embedded photo fixture reuse rights remain unverified; no licensing clearance is claimed.
- `.gitignore` excludes common credential/configuration files and generated local files. Only the explicit staged inventory is eligible for publication.

## Validation boundary

The migration runs 54 bounded local/mocked regression assertions and verifies frontend byte identity. No fresh live API or browser acceptance cycle is claimed. Previous browser evidence and outstanding limitations remain in the checkpoint handoff. GitHub commit/tag verification is performed after publication; the external migration report supplies their exact identifiers.
