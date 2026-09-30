# Contributing

Thanks for helping improve this project.

## Setup
```bash
nvm use            # Node 22 (see .nvmrc)
npm install
npm run dev
```

## Before opening a PR
```bash
npm run check      # lint + typecheck + content validation + production build
```

## Guidelines
- Keep changes focused; one concern per PR.
- Content lives in `content/*.json` and `lib/data.ts`; `npm run validate` catches broken links/assets.
- Don't add runtime dependencies without a strong reason. The site is static and small on purpose.
- Keep accessibility intact: keyboard focus, contrast (AA), `prefers-reduced-motion`.
- Sample content is placeholder text; improvements to the template code, docs and tooling are welcome.
