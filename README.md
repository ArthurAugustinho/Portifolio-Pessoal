# Portfolio — Arthur Augustinho

Personal portfolio of Arthur Augustinho, a full-stack developer based in Europe. The goal is to show the projects clearly, better than a GitHub profile does, for recruiters, tech leads and freelance clients. The site is in English only.

## Stack

- Next.js 16 (App Router, static export), React 19, strict TypeScript
- CSS Modules on top of design tokens (`app/tokens.css`), Archivo variable font through `next/font`
- Project case studies in MDX, compiled with `@mdx-js/mdx` and validated with Zod
- GSAP for motion (hero, route, carousel), with a global pause control; a small canvas for the particle background
- Contact form handled by a Cloudflare Worker (Resend for email, Turnstile against spam)
- Hosting on Cloudflare, with the static export served as Worker assets

## Running locally

```bash
npm ci
npm run dev
```

The site runs without any environment variable. Copy `.env.example` to `.env` only to try the contact form (it needs Resend and Turnstile keys) or to change the site URL.

Before committing:

```bash
npm run lint && npm run typecheck && npm run build
```

`npm run build` writes the static site to `out/`. `npm run worker:deploy` builds and deploys it with Wrangler.

## How it works

- **Static first.** Every piece of content is in the exported HTML, in its final form. Motion is a layer on top: it can be paused from the header, and it starts paused for visitors who prefer reduced motion.
- **Content is data.** Projects live in `content/projetos/*.mdx` and the profile text in `content/perfil.ts`. Technologies and their icons come from one registry, `lib/tecnologias.ts`; a project that names a technology outside it fails the build.
- **No placeholder text in production.** Unwritten text is marked `TODO:`. With `NEXT_PUBLIC_INDEXAVEL=true`, the build fails while any `TODO:` is left.
- **Security headers** (CSP, HSTS and others) are set in `public/_headers`.

## Documentation

- `docs/decisions/`: architecture decision records, with the reasons and the alternatives that were ruled out
- `docs/redesign/`: the specification and the plan of the current design
- `design-system/portfolio/MASTER.md`: tokens, typography, motion and what is not allowed
- `CLAUDE.md`: conventions for working on this repository
