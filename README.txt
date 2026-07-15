Aquarium Hub — Dashboard Refactor v1

GitHub upload instructions:
Upload all files and folders in this package to the root of the Aquarium-HUB repository, replacing the existing versions.

Project structure:
- index.html: page structure only
- styles.css: visual styling and responsive layout
- app.js: application data, dashboard logic, navigation, forms, storage, and rendering
- service-worker.js: offline cache
- manifest.webmanifest: installable-app metadata
- images/: bundled product and tester images

Compatibility:
- Existing localStorage keys are unchanged, so saved readings and maintenance tasks remain compatible.
- The current visual design and dashboard features are preserved.
- The service-worker cache name was changed so GitHub Pages loads the refactored files instead of an older cached build.

Dashboard foundation completed:
- Reef at a Glance and weighted tank-health scoring
- Parameter readings, averages, trends, and test dates
- Reading entry and phosphorus-to-phosphate conversion
- Maintenance tasks
- Tank, livestock, equipment, and tester navigation
- Backup import/export and photo storage safeguards


v4 changes: Added change-since-last indicators and shaded target ranges to Nutrients and Major Elements dashboard cards.


V7 update: Dashboard parameter cards now update independently from the latest saved reading for each parameter. Major Elements remains a single combined three-line chart with element-specific scales and colors.


v11: Optimized portrait-phone layout and added explicit orange calcium dots in Major Elements.


v12 changes:
- Nutrient cards now match Major Elements and show latest/previous dates.
- Maintenance uses the actual current date.
- Default view shows the next 7 days; button expands to all 30 days.
- Completion is saved by exact calendar date and task.
