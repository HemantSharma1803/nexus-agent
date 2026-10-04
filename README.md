# NEXUS — The Autonomous Web Operator

> **Give NEXUS a task. It handles the web.**

NEXUS is a hackathon prototype that demonstrates an agent-style workflow: accept a natural-language goal, present an execution plan, update a controlled browser-like marketplace sandbox, handle a simulated interface change, and verify the resulting application state.

> **Prototype scope:** the current version runs a deterministic workflow against an in-app sample catalog. It does not control arbitrary external websites, use Playwright/Selenium, access real accounts, or place real orders. The sandbox is deliberately isolated so the demo is repeatable and safe.

## What it demonstrates

- **Goal to workflow:** a task is interpreted and represented as a sequence of observable steps.
- **Visible operation:** search, price filtering, sorting, product selection, and cart changes update the NEXUS Market interface.
- **Constraint-based selection:** products are selected from the local catalog using price, availability, and rating information.
- **Adaptive recovery demo:** when enabled, the sandbox changes the rating control label and the workflow demonstrates recovery to an equivalent control. This is a deterministic simulation, not general-purpose visual/DOM recovery.
- **Verification summary:** the app checks its local sandbox result and shows a task completion summary.
- **Local task history:** completed tasks and browser-session summaries are saved in browser `localStorage` on that device.

## Demo scenarios

Use the example chips in the task input to load a prepared task:

1. **Shopping research** — find a highly rated keyboard within a budget and add the match to the sandbox cart.
2. **Compare products** — compare candidates and prepare a recommendation without changing the cart.
3. **Find & verify** — find a keyboard meeting the sample rating and price requirements and verify its stock status.
4. **Data extraction** — inspect the sample catalog and compile a leading match.

The catalog contains nine fictional sample products. Prices, ratings, reviews, and stock counts are demo data, not live marketplace information.

## Tech stack

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- Lucide icons

The deployed demo is a static client-side application. It does not require API keys or a backend service.

## Run locally

Requirements: Node.js 22 or a compatible current LTS release, and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite in your browser. To create and preview a production build:

```bash
npm run build
npm run preview
```

`npm run build` runs TypeScript checking before Vite creates the production files in `dist/`.

## Deploy to GitHub Pages

A GitHub Actions workflow is included at `.github/workflows/deploy.yml`. It installs dependencies, type-checks and builds the project, uploads `dist/`, and deploys it to GitHub Pages when code is pushed to `main` or `master` (or when manually started).

1. Create a GitHub repository and upload the **contents** of this project ZIP to the repository root (so `package.json`, `index.html`, and `src/` are at the root).
2. Commit and push to `main` or `master`.
3. In the repository, open **Settings → Pages** and select **GitHub Actions** as the build and deployment source.
4. Open the **Actions** tab and wait for the workflow's build and deploy jobs to complete.
5. The Pages URL will appear in the workflow deployment and in **Settings → Pages**.

Vite uses relative asset paths for compatibility with repository-based Pages URLs. The workflow deploys the built static app; it does not deploy an Express server.

## Project structure

```text
.
├── .github/
│   └── workflows/
│       └── deploy.yml
├── public/
│   └── .nojekyll
├── src/
│   ├── agent/          # Deterministic task execution flow
│   ├── components/     # Workspace, sandbox, history, and settings UI
│   ├── data/           # Fictional sandbox catalog
│   ├── types/          # Shared TypeScript models
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Safety and limitations

- NEXUS Market is an in-app simulation and must not be represented as Amazon, Flipkart, or a live shopping site.
- No real purchases, external logins, or third-party account actions are performed.
- Task history is stored in the current browser's local storage and is not synchronized across devices.
- Adaptive recovery demonstrates a known, simulated label change; it is not a claim of robust recovery on arbitrary websites.
- An external browser-control backend, live website connectors, and production-grade agent permissions are outside this prototype's current scope.

## Resetting the demo

Use **Reset** on the Run Task screen or **Reset Demo** in Agent Settings to clear the current sandbox state. The settings reset also clears locally saved task history and sessions.

## Hackathon presentation

Recommended walkthrough: choose a prepared scenario → run the task → show the plan and sandbox changing → point out the simulated interface change and recovery → inspect the selected candidate and verified outcome. Explain clearly that the current build is a deterministic sandbox prototype and describe arbitrary-site browser control as future work, not an existing capability.

## Future scope

- A permissioned browser-control service for user-approved websites
- Robust element identification and recovery across changing interfaces
- Explicit confirmation gates for consequential actions
- Live evidence capture and audit trails
- Secure server-side execution and configurable integrations

## License

No license is currently specified. Add a license file before redistributing the project as open source.
