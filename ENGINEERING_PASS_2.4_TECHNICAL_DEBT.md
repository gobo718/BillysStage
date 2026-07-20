# Pass 2.4 Technical Debt

- The 147,000-row browser dataset is still shipped as one global JavaScript array. The resolver removes repeated scans but does not reduce download or parse cost.
- Authored profile/demo content contains known nonexistent pairs and therefore retains presentation fallbacks. A future content pass should decide whether to replace those references.
- The resolver cache assumes the dataset array is immutable after first resolution. That matches current production behavior; mutable inventories would require explicit index invalidation.
- Resolution does not yet expose diagnostics for duplicate canonical IDs because Pass 2.2 already blocks them at release validation.
