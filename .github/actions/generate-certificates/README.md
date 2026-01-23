# Generate SSL Certificates Action

Composite action that generates self-signed SSL certificates for development and testing, then uploads them as workflow artifacts.

## Description

This action consolidates certificate generation logic that was duplicated across workflows. It:

1. Creates the certificate directory if it doesn't exist
2. Generates a self-signed SSL certificate and key using OpenSSL
3. Optionally displays certificate information
4. Uploads the certificates as a workflow artifact for use by dependent jobs

## Usage

### Basic Usage

```yaml
- name: 🔐 Generate and Upload Certificates
  uses: ./.github/actions/generate-certificates
```

### With Certificate Info Display

```yaml
- name: 🔐 Generate and Upload Certificates
  uses: ./.github/actions/generate-certificates
  with:
    show-cert-info: 'true'
```

### Custom Artifact Name

```yaml
- name: 🔐 Generate and Upload Certificates
  uses: ./.github/actions/generate-certificates
  with:
    artifact-name: 'my-custom-certs'
```

## Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `show-cert-info` | Whether to display certificate information | No | `false` |
| `artifact-name` | Name for the uploaded artifact | No | `thunder-certificates` |

## Outputs

### Files Created
- `target/out/.cert/server.key` - Private key
- `target/out/.cert/server.cert` - SSL certificate

### Artifact Uploaded
- Name: Value of `artifact-name` input (default: `thunder-certificates`)
- Contents: Both the certificate and private key files

## Certificate Details

- **Type**: Self-signed X.509 certificate
- **Validity**: 365 days
- **Key Size**: RSA 2048-bit
- **Subject**: `/O=WSO2/OU=Thunder/CN=localhost`
- **Purpose**: Development and testing only

## Downloading Certificates in Later Jobs

```yaml
- name: 📥 Download Shared Certificates
  uses: actions/download-artifact@v4
  with:
    name: thunder-certificates
    path: target/out/.cert/
```

## Prerequisites

- OpenSSL must be available (standard on ubuntu-latest and macos-latest runners)

## Notes

- Certificates are generated fresh for each workflow run
- These are self-signed certificates for development/testing only
- Not suitable for production use
- This action replaces ~25 lines of duplicated code in workflows

## Related

- Used by: `nightly-build-validation.yml`, `release-builder.yml`
- Downloaded by: Sample packaging jobs
