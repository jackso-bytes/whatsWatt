- In all interactions and commit messages be extremely concise. Sacrifice grammar for the sake of concision
- Always prefix commit messages with `[claude]` (e.g. `[claude] feat(#36): add thing`)

## What is What's What

Single-page React app.

Goal: show real-time electricity signal per postcode:

- how green
- how cheap

## TECH STACK

- React 18 + Vite
- TypeScript (strict)
- Tailwind CSS v4 (CSS vars)
- Radix UI primitives
- Vitest + React Testing Library
- Playwright (E2E)

## Testing

- All new component and hook files must have a corresponding test file.
- Tests live alongside the source file (e.g. `Foo.tsx` → `Foo.test.tsx`).
- always use the tdd skill found here ~/.claude/skills/tdd
- always run the associated test after editing to ensure no regression

## TypeScript

- No `any` types. If a type is complex or unclear, ask before guessing.
- No type errors or ESLint violations in submitted edits. Run `mcp__ide__getDiagnostics` before submitting.

# Linting

- zero ESLint errors required
- never suppress via ignores or inline disables
- fix root cause only
- run `npx prettier --write <file>` after editing any file

## General

- Package manager: `pnpm`
- Run tests: `npx jest` (not `pnpm test`, which doesn't support `--testPathPatterns`)

## Design Guidance

- Reference `design-guidance.md`
