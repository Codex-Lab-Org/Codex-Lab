# Codex Lab Student Directory

This repo is the starter project for the Codex Lab student exercise.

It already includes a working student directory and network graph built with Next.js. The goal of the lab is to use the Codex app to add a reusable drawer that opens when a student's name is clicked and shows richer profile information about that student.

## What Students Will Build

Each student should:

1. Add a drawer or side panel that opens from the student directory.
2. Make student names clickable so the drawer opens for the selected person.
3. Add more information about themselves to the data model.
4. Keep the experience polished on desktop and mobile.

Think of this as a shadcn-style `Sheet` or drawer interaction.

Note: this repo does not currently include `shadcn/ui` setup. There is no `components.json` yet, so a custom drawer implementation is completely acceptable for this exercise.

## Stack

- Next.js 16 App Router
- React 19
- Tailwind CSS 4
- Framer Motion
- Vitest
- Playwright

## Local Development

```bash
pnpm install
pnpm dev
```

Then open [http://localhost:3000](http://localhost:3000).

No environment variables are required for the current lab flow. The `.env.example` file is there for future expansion.

## Project Map

- [`app/page.tsx`](./app/page.tsx): app entry point
- [`components/directory-home.tsx`](./components/directory-home.tsx): top-level page composition and selection state
- [`components/member-table.tsx`](./components/member-table.tsx): mobile and desktop directory UI
- [`components/network-graph.tsx`](./components/network-graph.tsx): interactive student network graph
- [`lib/members.ts`](./lib/members.ts): student data and `Member` type
- [`components/member-table.test.tsx`](./components/member-table.test.tsx): unit tests for the directory table
- [`tests/e2e/home.spec.ts`](./tests/e2e/home.spec.ts): Playwright coverage for the home page

## Assignment

### Required Outcome

Build a reusable drawer component that opens when a student name is clicked and displays richer information for that person.

### Suggested Profile Fields

Students can choose their own profile structure, but a good starting point is:

- `headline`
- `bio`
- `favoriteTools`
- `funFact`
- `location`
- `personalSite`

If you add fields, update the `Member` type in [`lib/members.ts`](./lib/members.ts) so the data model stays explicit.

### Acceptance Criteria

- Clicking a student name opens a drawer for that student.
- The drawer works on both desktop and mobile layouts.
- The drawer can be closed with a close button and `Escape`.
- At least one student entry includes real self-written information.
- Existing directory content still works, including social/profile links.
- The page remains readable on small screens.
- `pnpm lint` and `pnpm typecheck` pass before submission.

## Recommended Implementation Path

1. Extend the `Member` type and the relevant student record in [`lib/members.ts`](./lib/members.ts).
2. Create a new component such as `components/member-drawer.tsx`.
3. Use the existing `selectedId` state in [`components/directory-home.tsx`](./components/directory-home.tsx) to control which student is open.
4. Wire [`components/member-table.tsx`](./components/member-table.tsx) to receive `selectedId` and `onSelect`.
5. Replace the plain student name text with an accessible button or other clearly interactive control.
6. Add or update tests in [`components/member-table.test.tsx`](./components/member-table.test.tsx) and [`tests/e2e/home.spec.ts`](./tests/e2e/home.spec.ts).

## Codex App Workflow

### Recommended Git Flow

Create a branch before you start:

```bash
git checkout -b codex/<your-name>-drawer
```

Examples:

- `codex/jason-drawer`
- `codex/mark-profile-panel`

### How To Work In Codex

1. Open the repo in the Codex app.
2. Ask Codex to inspect the current code before editing anything.
3. Be specific about the outcome, the files, and the constraints.
4. Ask Codex to keep changes minimal and preserve the existing visual style.
5. Ask Codex to run verification commands after making changes.
6. Review the diff before you commit.

### Prompting Tips

Good prompts usually include:

- the feature you want
- the files or components to start from
- the behavior that must stay intact
- the commands Codex should run to verify the work

Weak prompt:

```text
Make this better.
```

Strong prompt:

```text
Inspect this repo and add a reusable right-side member drawer that opens when a student name is clicked. Reuse the existing selectedId state in components/directory-home.tsx, keep the current visual language, make the interaction keyboard accessible, and run pnpm lint and pnpm typecheck when you're done.
```

Another useful prompt:

```text
Extend the Member type in lib/members.ts with headline, bio, favoriteTools, and funFact. Add those fields for my student record only, render them in a new member drawer component, and add or update tests for the open/close interaction.
```

## Verification

Run these commands before submitting your work:

```bash
pnpm lint
pnpm typecheck
pnpm test:unit
pnpm test:e2e
```

`pnpm test:e2e` starts its own local dev server through Playwright, so you do not need to manually start a second server for that command.

## Submission Checklist

- Your branch name starts with `codex/`
- A student name opens the drawer
- Your profile content appears in the drawer
- The drawer closes cleanly
- Lint and typecheck pass
- You reviewed the diff before commit

## Current Data Model

The current student dataset lives in [`lib/members.ts`](./lib/members.ts).

Today, each member includes:

- `id`
- `name`
- `university`
- `website`
- `avatar`
- `links`

Part of the exercise is deciding how to evolve that model cleanly.
