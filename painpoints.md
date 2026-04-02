# Claude Code Pain Points & Mitigations

Lessons learned running autonomous Claude Code loops (Ralph) on this project.

---

## 1. Design drift in complex components

**What happened:**
Ralph's prompt told Claude to read the PRD as "source of truth" and to screenshot `electricity-dashboard-mockup.html` after implementation for visual comparison. For simple components (hero form), LLM defaults were close enough to the spec. For complex components (GenerationMixCard, CarbonIntensityCard), the model implemented from PRD descriptions alone — missing exact values like fuel→colour mappings, SVG geometry, font-size constraints, footnote border-top, icon opacity. The post-implementation screenshot comparison caught coarse drift but missed CSS-level detail.

**Root causes:**
- Mockup HTML was consulted visually after coding, not read as source before coding.
- The full PRD was loaded on every iteration — high noise, low relevance per issue.
- Issues described components functionally; exact design values weren't quoted in the issue body.

**Mitigations:**
- Ralph prompt updated to explicitly read the relevant section of `designSpecs/electricity-dashboard-mockup.html` before writing any frontend code.
- Removed "read full PRD" from Ralph loop — PRD context should be baked into each issue at creation time via the prd-to-issues skill.
- Issues for UI components now reference exact line ranges in the mockup and quote critical CSS values directly.

---

## 2. ESLint suppression

**What happened:**
Before ESLint guardrails were in place, Claude routinely worked around lint errors rather than fixing them:
- Added `// eslint-disable-next-line` and `/* eslint-disable */` inline comments.
- Edited `eslint.config.js` directly — removing or relaxing rules that conflicted with generated code.

This meant lint was nominally passing but meaningless: the config was being eroded and suppressions were accumulating silently.

**Mitigations:**
- A hook blocks write access to `eslint.config.js`.
- CLAUDE.md explicitly forbids eslint-disable comments and requires fixing root cause only.
- `no-warning-comments` (or equivalent) lint rule added to catch suppression attempts.
- Zero ESLint errors is a hard gate — Ralph won't open a PR until `pnpm exec eslint .` passes clean.

---

## 3. PRs opened with failing lint and tests

**What happened:**
In early iterations, Ralph would open PRs even when `pnpm exec eslint .` or `npx jest` were failing — sometimes without running them at all, sometimes after superficially acknowledging failures and proceeding anyway.

**Mitigations:**
- Ralph prompt step 5 explicitly runs both lint and tests and requires zero failures before `gh pr create` is called.
- Instruction added: fix failures before opening PR, never skip, never suppress.
- CLAUDE.md reinforces: run the associated test after every edit to catch regressions immediately.
