# Publishing

## One-time setup

1. Create an npm organization or scope that can publish `@parallel-ui/*`.
2. Log in locally with `npm login`.
3. In GitHub, add repository secret `NPM_TOKEN`.
   - Generate it from npm as an automation token with publish permission.

## Local verification

```bash
npm ci
npm run build:book-object
npm run changeset
npm run version-packages
npm publish -w @parallel-ui/book-object --access public --dry-run
```

## Local release

```bash
npm run version-packages
npm publish -w @parallel-ui/book-object --access public
```

## GitHub Actions release

After `NPM_TOKEN` is configured:

1. Open Actions in the `parallel-ui` repository.
2. Preferred: let the `Release` workflow open or update the release PR from changesets.
3. After the release PR is merged, the workflow publishes the package automatically.
4. `Publish Book Object` remains available as a manual fallback.

## Versioning

Before each release:

1. Add a changeset with `npm run changeset`
2. Commit and push it
3. Let the `Release` workflow generate the version PR, or run `npm run version-packages` locally
