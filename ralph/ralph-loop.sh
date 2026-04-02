#!/bin/bash
set -e

if [ -z "$1" ]; then
  echo "Usage: $0 <iterations>"
  exit 1
fi

for ((i=1; i<=$1; i++)); do
  echo "Iteration $i"
  echo "--------------------------------"
  result=$(claude -p "\
0. Read designSpecs/whats-watt-PRD.md in full — it is the source of truth for tech stack, design decisions, and acceptance criteria. Adhere to it throughout. \
1. Check the GitHub project board at https://github.com/users/jackso-bytes/projects/2. \
Find the highest-priority unstarted issue — use your judgement on priority, do not just pick the first one. \
Only pick an issue whose epic blockers are all done. \
2. Create a new branch from dev for that issue using conventional commits naming. \
3. For frontend components: open designSpecs/electricity-dashboard-mockup.html in Playwright and screenshot it, start the dev server and screenshot localhost, compare both and fix any visual drift before proceeding. \
4. Implement the issue following its plan and acceptance criteria. Use the tdd skill as described in CLAUDE.md: red-green-refactor on every implementation task. \
5. Run 'pnpm exec eslint .' and 'npx jest --config jest.config.cjs' and confirm BOTH pass with zero errors before continuing. Fix any failures before opening a PR — do not open a PR with failing lint or tests. NEVER add files to the eslint ignores list to silence errors — and NEVER use eslint-disable comments to suppress errors — fix the root cause instead. NEVER leave camelCase stub files alongside kebab-case canonical files. \
6. Make small commits following conventional commits. As you go, tick off acceptance criteria in the GitHub issue AND in the PR body. \
7. Push the branch, open a PR targeting dev using 'gh pr create' with the body passed inline via --body flag or heredoc — never write the PR body to a file and commit it. Move the issue to 'In Review' on the board. \
8. Check whether any other open issues are CONCRETELY blocked right now by this PR being unmerged — meaning they directly import from, or require as a runtime dependency, the specific files just written. \
Only output <needs-review>PR #NUMBER ready for QA — blocking N issues</needs-review> if at least one other issue cannot even be started without this PR merged. \
If nothing is concretely blocked, do NOT output needs-review — just continue to the next iteration. \
ONLY WORK ON A SINGLE ISSUE PER ITERATION. \
  echo "$result"

  if [[ "$result" == *"<promise>COMPLETE</promise>"* ]]; then
    echo "PRD complete, exiting."
    exit 0
  fi

  if [[ "$result" == *"<needs-review>"* ]]; then
    echo ""
    echo "⏸  Paused for QA. Review and merge the PR above, then re-run the loop."
    exit 0
  fi
done
