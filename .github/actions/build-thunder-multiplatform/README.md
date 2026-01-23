# Build Thunder Multi-Platform Action

Composite action that builds Thunder frontend and backend for all supported platforms.

## Description

This action consolidates the multi-platform build logic that was previously duplicated across multiple workflows. It:

1. Builds the frontend once (platform-agnostic)
2. Builds the backend for each supported platform:
   - Windows (amd64)
   - Linux (amd64, arm64)
   - Darwin/macOS (amd64, arm64)

## Usage

```yaml
- name: 🔨 Build Thunder for All Platforms
  uses: ./.github/actions/build-thunder-multiplatform
```

## Prerequisites

- Go environment must be set up
- Node.js environment must be set up (for frontend)
- Makefile targets `build_frontend` and `build_backend` must be available

## Outputs

This action creates build artifacts in the `target/dist/` directory:
- `thunder-*-win-*.zip` (Windows)
- `thunder-*-linux-*.zip` (Linux amd64/arm64)
- `thunder-*-macos-*.zip` (Darwin amd64/arm64)

## Notes

- The frontend is built once and reused for all platforms
- A 1-second delay is added between backend builds to prevent resource contention
- This action replaces ~30 lines of duplicated bash code in workflows

## Related

- Used by: `nightly-build-validation.yml`, `release-builder.yml`
- Requires: Proper Go and Node.js setup before calling
