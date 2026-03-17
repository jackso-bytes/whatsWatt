- In all interactions and commit messages be extremely concise. Sacrifice grammar for the sake of concision

## Testing

- All new component and hook files must have a corresponding test file.
- Tests live alongside the source file (e.g. `Foo.tsx` → `Foo.test.tsx`).
- always use the tdd skill found here ~/.claude/skills/tdd
- always run the associated test after editing to ensure no regression

## TypeScript

- No `any` types. If a type is complex or unclear, ask before guessing.
- No type errors or ESLint violations in submitted edits. Run `mcp__ide__getDiagnostics` before submitting.

## General

- Package manager: `pnpm`
- Run tests: `npx jest` (not `pnpm test`, which doesn't support `--testPathPatterns`)

## Plans

- At the end of each plan give me a list of unresolved questions and ask them before asking for plan review. Make the questions extremely concise, sacrifice grammar for the sake of concision.
- Step 0 of every accepted plan: create a GH issue from the plan using `gh issue create`.
