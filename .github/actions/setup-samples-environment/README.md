# Setup Samples Environment Action

Composite action that sets up a complete environment for building and packaging sample applications.

## Description

This action consolidates environment setup logic that was duplicated across sample packaging jobs. It:

1. Sets up the Go environment
2. Sets up the Node.js environment
3. Installs pnpm package manager
4. Optionally downloads shared SSL certificates

## Usage

### Basic Usage

```yaml
- name: ⚙️ Setup Samples Environment
  uses: ./.github/actions/setup-samples-environment
```

### Custom Configuration

```yaml
- name: ⚙️ Setup Samples Environment
  uses: ./.github/actions/setup-samples-environment
  with:
    node-version: '20.x'
    pnpm-version: '9.x'
    download-certificates: 'true'
```

### Without Certificate Download

```yaml
- name: ⚙️ Setup Samples Environment
  uses: ./.github/actions/setup-samples-environment
  with:
    download-certificates: 'false'
```

## Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `node-version` | Node.js version to use | No | `lts/*` |
| `pnpm-version` | pnpm version to use | No | `9.x` |
| `download-certificates` | Whether to download shared certificates | No | `true` |
| `certificate-artifact-name` | Name of certificate artifact to download | No | `thunder-certificates` |

## What Gets Set Up

### 1. Go Environment
- Uses the custom `.github/actions/setup-go` action
- Installs Go with project-specific configuration

### 2. Node.js Environment
- Uses the custom `.github/actions/setup-node` action
- Installs Node.js LTS (or specified version)
- Configures npm package manager
- Sets dependency path for caching

### 3. pnpm Package Manager
- Installs pnpm version 9.x (or specified version)
- Configured with `run_install: false` for manual control

### 4. SSL Certificates (Optional)
- Downloads certificates from workflow artifacts
- Places them in `target/out/.cert/`
- Can be disabled with `download-certificates: 'false'`

## Prerequisites

- Must be run after a job that generates and uploads certificates (if `download-certificates` is `true`)
- Repository must contain `.github/actions/setup-go` and `.github/actions/setup-node` actions

## Verification

After running this action, you should be able to:

```bash
# Check Go is available
go version

# Check Node.js is available
node --version

# Check pnpm is available
pnpm --version

# Check certificates exist (if downloaded)
ls -la target/out/.cert/
```

## Notes

- Replaces ~15-20 lines of duplicated setup code per job
- Ensures consistent environment setup across all sample packaging jobs
- Certificates download can be disabled for jobs that don't need them

## Related

- Used by: Sample packaging jobs in `nightly-build-validation.yml`, `release-builder.yml`
- Requires: `.github/actions/setup-go`, `.github/actions/setup-node`
- Certificate source: Output from `.github/actions/generate-certificates`
