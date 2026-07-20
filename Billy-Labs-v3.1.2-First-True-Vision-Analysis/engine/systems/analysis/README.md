# Analysis Jobs

Reusable Curator analysis-job foundation introduced in v3.1.0.

- One-item analysis is exposed now.
- Jobs already model total/completed/flagged/failed counts for future selected and bulk scans.
- Results are review suggestions only.
- The current analyzer is deterministic and local; it validates the workflow without pretending to perform remote computer vision.
- A future AI/vision provider should replace only the analysis adapter, not the queue, progress, or review lifecycle.
