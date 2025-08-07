# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server at localhost:4321
npm run dev

# Build production site to ./dist/
npm run build

# Preview production build locally
npm run preview

# Type-check TypeScript/Astro files
npm run astro check
```

## Architecture Overview

This is an Astro-based blog starter template configured as a GitHub Pages site at `luv20100918.github.io`.

### Key Technologies
- **Astro 5.12** - Static site generator with content collections
- **MDX Support** - Write blog posts in Markdown or MDX
- **TypeScript** - Strict mode enabled with null checks

### Content Management
- Blog posts are managed through Astro's Content Collections API
- Posts located in `src/content/blog/` as `.md` or `.mdx` files
- Frontmatter schema enforced via Zod in `src/content.config.ts`:
  - `title` (string, required)
  - `description` (string, required)
  - `pubDate` (date, required)
  - `updatedDate` (date, optional)
  - `heroImage` (image, optional)

### Routing Structure
- Pages in `src/pages/` map directly to routes
- Dynamic blog post routing via `src/pages/blog/[...slug].astro`
- RSS feed generated at `/rss.xml`

### Site Configuration
- Site URL: `https://luv20100918.github.io` (configured in `astro.config.mjs`)
- Global constants in `src/consts.ts` (SITE_TITLE, SITE_DESCRIPTION)
- Markdown syntax highlighting: GitHub Dark theme with line wrapping
- Integrations: MDX, Sitemap, RSS Feed