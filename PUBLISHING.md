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
npm publish -w @parallel-ui/book-object --access public --dry-run
```

## Local release

```bash
npm publish -w @parallel-ui/book-object --access public
```

## GitHub Actions release

After `NPM_TOKEN` is configured:

1. Open Actions in the `parallel-ui` repository.
2. Run `Publish Book Object`.
3. The workflow will install dependencies, build the package, and publish `@parallel-ui/book-object`.

## Versioning

Before each release, bump the package version in:

- `packages/book-object/package.json`

Then commit and push before publishing.
