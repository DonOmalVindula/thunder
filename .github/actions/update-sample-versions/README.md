# Update Sample Apps Version Action

Composite action that updates the version field in package.json for all sample applications.

## Description

This action consolidates the version update logic that was duplicated in the release workflow. It:

1. Normalizes the version format (removes 'v' prefix if present)
2. Updates the version in all sample app package.json files:
   - react-vanilla-sample (main and server)
   - react-sdk-sample
   - react-api-based-sample
3. Ensures no git tags are created
4. Allows setting the same version multiple times

## Usage

### Basic Usage

```yaml
- name: 📝 Update Sample Apps Version
  uses: ./.github/actions/update-sample-versions
  with:
    version: '1.2.3'
```

### With v Prefix (automatically removed)

```yaml
- name: 📝 Update Sample Apps Version
  uses: ./.github/actions/update-sample-versions
  with:
    version: 'v1.2.3'
```

### From Build Output

```yaml
- name: 📝 Update Sample Apps Version
  uses: ./.github/actions/update-sample-versions
  with:
    version: ${{ needs.build-thunder.outputs.version }}
```

## Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `version` | Version to set (can include or exclude v prefix) | Yes | - |

## Version Format

The action handles both formats:
- `1.2.3` - Direct semver format
- `v1.2.3` - Git tag format (v prefix is automatically stripped)

Both formats result in `1.2.3` being set in package.json files.

## Sample Apps Updated

1. **react-vanilla-sample**
   - Path: `samples/apps/react-vanilla-sample/package.json`
   - Path: `samples/apps/react-vanilla-sample/server/package.json`
   - Tool: npm

2. **react-sdk-sample**
   - Path: `samples/apps/react-sdk-sample/package.json`
   - Tool: pnpm

3. **react-api-based-sample**
   - Path: `samples/apps/react-api-based-sample/package.json`
   - Tool: pnpm

## Flags Used

- `--no-git-tag-version`: Prevents creating a git tag
- `--allow-same-version`: Allows setting the same version again (useful for rebuilds)

## Prerequisites

- Node.js must be installed
- npm must be available (for react-vanilla-sample)
- pnpm must be installed (for react-sdk-sample and react-api-based-sample)
- Must be run from the repository root

## Verification

After running this action, you can verify the versions:

```bash
# Check react-vanilla-sample
cat samples/apps/react-vanilla-sample/package.json | grep version
cat samples/apps/react-vanilla-sample/server/package.json | grep version

# Check react-sdk-sample
cat samples/apps/react-sdk-sample/package.json | grep version

# Check react-api-based-sample
cat samples/apps/react-api-based-sample/package.json | grep version
```

## Notes

- This action does not create git commits or tags
- The version changes are temporary within the workflow run
- Replaces ~40 lines of duplicated code per job in the release workflow
- Only needed for release builds, not for validation builds

## Related

- Used by: `release-builder.yml` (package-samples-linux and package-samples-macos jobs)
- Not used by: `nightly-build-validation.yml` (validation doesn't need versioning)
