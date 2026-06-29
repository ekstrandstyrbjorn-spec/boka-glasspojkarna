# Task 1: Project Bootstrap

## Context
You are implementing the first task of boka.glasspojkarna.se — a premium Next.js 15 booking experience for Glasspojkarna's party packages. The project directory is `C:/claude code` and git has already been initialized there with one empty commit.

## Your job
Scaffold the Next.js 15 project INTO the current directory and install all dependencies. Do NOT create a subdirectory.

## Steps to complete

### Step 1: Scaffold Next.js project in current directory
Run this from `C:/claude code`:
```bash
pnpm create next-app@latest . --typescript --tailwind --app --import-alias="@/*" --no-eslint --no-src-dir
```
When prompted about existing files, say yes to proceed.

### Step 2: Install additional dependencies
```bash
pnpm add framer-motion zustand
pnpm add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom
```

### Step 3: Write vitest.config.ts (in project root, replacing any existing)
```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, '.') },
  },
})
```

### Step 4: Write vitest.setup.ts (in project root)
```ts
import '@testing-library/jest-dom'
```

### Step 5: Add test scripts to package.json
Add to the scripts section:
```json
"test": "vitest",
"test:run": "vitest run"
```

### Step 6: Write .env.example (in project root)
```
BOOQABLE_API_KEY=your_api_key_here
BOOQABLE_SUBDOMAIN=your_subdomain_here
NEXT_PUBLIC_SITE_URL=https://boka.glasspojkarna.se
NEXT_PUBLIC_WEB3FORMS_KEY=your_web3forms_key_here
```

### Step 7: Write .env.local (in project root — will be git-ignored)
```
BOOQABLE_API_KEY=placeholder_will_be_filled_later
BOOQABLE_SUBDOMAIN=glasspojkarna
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_WEB3FORMS_KEY=placeholder
```

### Step 8: Verify dev server starts
```bash
pnpm dev
```
Expected: server running at http://localhost:3000. Stop it with Ctrl+C.

### Step 9: Verify test runner works
```bash
pnpm test:run
```
Expected: "No test files found" or similar — not an error.

### Step 10: Commit everything
```bash
git add .
git commit -m "feat: bootstrap Next.js 15 project with Tailwind, Framer Motion, Vitest"
```

## Report
Write your full report to: `C:/claude code/.superpowers/sdd/task-1-report.md`

Include:
- What you did
- Any deviations from the steps above (and why)
- Test command run and output
- Commits made (full SHA)

Then reply with:
- Status: DONE / BLOCKED / NEEDS_CONTEXT
- Commits: (short SHAs)
- Tests: (one-line summary)
- Concerns: (any, or "none")
