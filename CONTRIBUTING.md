# Contributing

## Development

```bash
npm install
npm run build:book-object
```

## Release flow

1. Make the code change.
2. Add a changeset with `npm run changeset`.
3. Commit and push.
4. Merge to `main`.
5. Run the publish workflow or publish locally.

## Expectations

- Keep package APIs framework-appropriate and documented.
- Do not commit generated `.tgz` files.
- Validate with `npm run build:book-object` before opening a PR.
