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

## First-Time Setup (macOS)

These steps are for students starting from a mostly clean Mac. If you already have `git`, `brew`, `gh`, `node`, and `pnpm`, you can skip to [Local Development](#local-development).

### 1. Install Apple Command Line Tools

This gives you Git and other developer tools that many JavaScript packages expect.

```bash
xcode-select --install
```

After that finishes, confirm Git is available:

```bash
git --version
```

### 2. Install Homebrew

Homebrew is the package manager we will use for the rest of the setup.

Official site: [brew.sh](https://brew.sh/)

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

When the installer finishes, follow the exact "Next steps" it prints in Terminal so `brew` is added to your shell correctly. The command differs between Apple Silicon and Intel Macs.

Then verify it worked:

```bash
brew --version
```

### 3. Install GitHub CLI

GitHub CLI makes it much easier to clone the repo, authenticate Git, and push your branch.

Official site: [cli.github.com](https://cli.github.com/)

```bash
brew install gh
gh auth login
gh auth status
```

Recommended options during `gh auth login`:

- Choose `GitHub.com`
- Choose `HTTPS`
- Say `yes` when it asks whether Git should authenticate with your GitHub credentials

### 4. Install Node.js

Install the current LTS version of Node.js from the official download page:

- [Node.js download page](https://nodejs.org/en/download)

As of March 11, 2026, the Node.js site lists `v24.14.0` as LTS.

After installing it, confirm both Node and npm are available:

```bash
node --version
npm --version
```

If you prefer, you can also install Node with Homebrew. The official installer is usually the least confusing option for students.

### 5. Install pnpm

This repo uses `pnpm` as its package manager.

Official docs: [pnpm installation](https://pnpm.io/installation)

Recommended setup:

```bash
npm install --global corepack@latest
corepack enable pnpm
pnpm --version
```

If you want a Homebrew-based fallback instead, pnpm's docs also support:

```bash
brew install pnpm
```

### 6. Clone the Repository

If you have GitHub CLI set up:

```bash
gh repo clone danielapassos/Codex-Lab
cd Codex-Lab
```

If you prefer plain Git:

```bash
git clone https://github.com/danielapassos/Codex-Lab.git
cd Codex-Lab
```

### 7. Install Dependencies

```bash
pnpm install
```

### 8. Open the Repo in Codex

Once the repo is on your machine, open the `Codex-Lab` folder in the Codex app and start working from there.

## Local Development

```bash
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
