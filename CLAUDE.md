- In all interactions and commit messages be extremely concise. Sacrifice grammar for the sake of concision

## What is What's What

Single-page React app.

Goal: show real-time electricity signal per postcode:

- how green
- how cheap

Design source of truth:
`electricity-dashboard-mockup.html`

Design rules:

- Ocean Depths dark theme
- Plus Jakarta Sans
- teal/green palette
- card-based UI
- mobile-first → 2-col desktop

## TECH STACK

- React 18 + Vite
- TypeScript (strict)
- Tailwind CSS v4 (CSS vars)
- Radix UI primitives
- Vitest + React Testing Library
- Playwright (E2E)
- localStorage (postcode)
- useState / useReducer only

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

## General

- Package manager: `pnpm`
- Run tests: `npx jest` (not `pnpm test`, which doesn't support `--testPathPatterns`)

## Plans

- At the end of each plan give me a list of unresolved questions and ask them before asking for plan review. Make the questions extremely concise, sacrifice grammar for the sake of concision.
- Step 0 of every accepted plan: create a GH issue from the plan using `gh issue create`.
