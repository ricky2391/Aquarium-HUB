Aquarium HUB v25 — Strict Tab Isolation & Cleanup

Tab contents:
- Dashboard: overview, parameters, trends, quick actions, and upcoming maintenance.
- Readings: test entry and reading history only.
- Maintenance: recommendations, checks, feeding, water changes, salt mixing, observations, and schedule.
- Livestock: fish, invertebrates, corals, quarantine, and livestock history only.
- Equipment: system profile, targets, installed equipment, and inventory only.
- Testers: tester guides and testing summary only.

Fixes:
- Split Livestock and Equipment rendering into independent functions and containers.
- Added strict CSS isolation so inactive tabs cannot display or occupy space.
- Corrected the app self-check to use the current tab and container IDs.
- Added cache-busted CSS/JavaScript URLs and a new service-worker cache.
- Removed four unused image assets and the broken unused Apple icon reference.
- Preserved all existing local-storage keys and saved user data.
