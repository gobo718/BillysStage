# Pass 2.4 Mashup Resolution Behavior Contract

1. A valid pair resolves by canonical ID, independent of ingredient order.
2. `A + A` is a valid exact pair and must resolve without special casing.
3. Resolution returns the original inventory row, not a reconstructed copy.
4. Missing, incomplete, or malformed pairs resolve to `null`.
5. Exact resolution must not silently substitute a row sharing only one ingredient.
6. Presentation code may apply an explicitly named fallback after exact resolution fails, but that fallback is not a valid-pair result.
7. Canonical identity remains the sole key used by the resolution index.
8. Future consumers must call the shared resolver rather than scan the inventory independently.
