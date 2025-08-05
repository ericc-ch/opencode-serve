# Deployment Guide

This documentation site is configured to work both locally and on GitHub Pages with the subpath `/opencode-serve`.

## Local Development

For local development and testing:

```bash
# Build for local development (no subpath)
bun run build:docs

# Serve locally
bun run serve:docs

# Visit http://localhost:3000
```

## GitHub Pages Deployment

For deployment to `ericc-ch.github.io/opencode-serve`:

```bash
# Build for production (with /opencode-serve subpath)
bun run build:docs:production

# Deploy the dist/ folder to GitHub Pages
```

## Configuration

The site automatically detects the environment:

- **Development**: Uses `http://localhost:3000` with no subpath
- **Production**: Uses `https://ericc-ch.github.io/opencode-serve` with `/opencode-serve` subpath

## Navigation Links

- **Local**: `/`, `/sessions/`, `/api-reference/`, etc.
- **Production**: `/opencode-serve/`, `/opencode-serve/sessions/`, `/opencode-serve/api-reference/`, etc.

## Metadata & SEO

All pages include:
- Open Graph tags for social sharing
- Twitter Card metadata  
- Canonical URLs pointing to production domain
- JSON-LD structured data for search engines

## Files Generated

- `dist/index.html` - Homepage
- `dist/{page-name}/index.html` - Individual documentation pages
- `dist/opencode-openapi.json` - OpenAPI specification

## GitHub Pages Setup

1. Create repository `opencode-serve` under `ericc-ch` account
2. Enable GitHub Pages from the `main` branch / `docs` folder (or upload dist contents)
3. The site will be available at `https://ericc-ch.github.io/opencode-serve`