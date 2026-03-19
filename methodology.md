# Methodology — How I Built This With AI

This project was built as a portfolio piece to explore what a disciplined, AI-assisted development workflow looks like end-to-end. Every stage from ideation to implementation was augmented by AI tooling, with humans staying in the loop at key decision points.

## The Stack

- **AI assistant:** Claude (via Claude Code CLI)
- **Skills used:** `create-prd`, `design-spec-architect`, `ralph-github-create-issues`, `tdd`, `frontend-design`, `theme-factory`
- **Automation:** Ralph loop (dockerised) for autonomous ticket execution
- **Visual QA:** Playwright MCP for screenshot comparison

---

## Stage 1 — Ideation

Started with a manual brainstorm conversation with Claude. I had a rough idea (a postcode-based electricity dashboard) and had already identified the APIs I wanted to use:

- [Carbon Intensity API](https://api.carbonintensity.org.uk) — regional grid intensity + generation mix
- [Octopus Energy API](https://api.octopus.energy) — live unit rates by region
- [Open-Meteo Air Quality API](https://air-quality-api.open-meteo.com) — AQI + pollutants
- [postcodes.io](https://api.postcodes.io) — postcode → lat/lon resolution

The brainstorm shaped the core value proposition: answer "how green and how cheap is my electricity right now?" in one glance.

---

## Stage 2 — PRD

Used the `create-prd` skill to formalise the idea into a structured Product Requirements Document. This covered:

- Tech stack decisions (React 18, Vite, TypeScript strict, Tailwind v4, Radix UI)
- Component hierarchy
- Data-fetching strategy (`usePostcodeData` hook with parallel fetches)
- Static data (LCOE constants from DESNZ *Electricity Generation Costs 2025*)
- Full testing plan (unit, component, E2E)
- Accessibility requirements

The PRD became the single source of truth for all subsequent stages.

---

## Stage 3 — Design

Invoked the `design-spec-architect` agent with the PRD and API endpoints. This agent:

1. Used the `frontend-design` skill to define production-grade UI patterns, layout, and component structure
2. Used the `theme-factory` skill to generate the Ocean Depths dark colour palette and select Plus Jakarta Sans as the typeface
3. Produced a `design-spec.md` as a hard constraint document

The agent then rendered the design spec into a standalone HTML prototype (`designSpecs/electricity-dashboard-mockup.html`), which serves as the visual source of truth for the entire build. Several iterations were made on this mockup before moving to implementation.

---

## Stage 4 — GitHub Issues

Used the `ralph-github-create-issues` skill to convert the PRD into a structured GitHub Issue hierarchy:

- **7 epics** (Foundation → Utils → Services → Hook → Layout → Cards → Integration)
- **33 task sub-issues** linked to their parent epics
- Blocking relations between epics to encode dependency order
- All issues loaded onto a GitHub Projects Kanban board (Backlog → In Progress → In Review → Done)

Each task issue includes acceptance criteria and an implementation plan written collaboratively before any code was touched.

---

## Stage 5 — Implementation (Ralph Loop)

Implementation runs via a **dockerised Ralph loop** — an autonomous Claude agent that works through GitHub Issues branch by branch. Docker isolation means the host machine is never at risk; GitHub means the repo is always the safety net.

Ralph is given full permissions to read, write, and test within the container. It works autonomously until enough tickets are merged to require a human QA pass.

### TDD — Red, Green, Refactor

Every implementation task follows the `tdd` skill's red-green-refactor loop:

1. **Red** — write a failing test that defines the expected behaviour
2. **Green** — write the minimal code to make it pass
3. **Refactor** — clean up without breaking the test

All new component and hook files require a co-located test file (e.g. `Hero.tsx` → `Hero.test.tsx`). Tests run with Vitest + React Testing Library for units/components and Playwright for E2E.

---

## Stage 6 — Visual QA

After every frontend component is implemented, a Playwright-based visual review runs automatically:

1. Opens `designSpecs/electricity-dashboard-mockup.html` in a headless browser and takes a screenshot
2. Starts the dev server and opens `localhost` in the same browser and takes a screenshot
3. Compares both side-by-side to flag any drift from the design spec

This ensures the running app stays faithful to the prototype without requiring manual visual checks after every change.

---

## Stage 7 — Human QA

Once enough tickets accumulate in the Done column, a human QA pass reviews:

- Visual fidelity against the mockup
- Accessibility (keyboard nav, screen reader text, colour contrast)
- Real API responses with live postcodes
- E2E Playwright suite green across all scenarios

Approved tickets are merged to `main`.

---

## Reflections

This workflow demonstrates that AI can own the entire implementation loop when given clear constraints — a tight PRD, a visual source of truth, a test discipline, and an issue hierarchy that encodes dependencies. The human role shifts from writing code to making decisions: what to build, what it should look like, and whether the result meets the bar.
