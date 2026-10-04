# NEXUS — The Autonomous Web Operator

NEXUS is a deterministic client-side agent-workflow prototype. It accepts a natural-language task, builds a visible execution plan, operates a controlled marketplace sandbox, demonstrates adaptive recovery, evaluates candidates, and verifies the final state.

## Run locally

```bash
npm install
npm run dev
```

Open the local Vite URL shown in the terminal.

## Production build

```bash
npm run build
npm run preview
```

## Demo flow

1. Enter a task or choose one of the preset examples.
2. Click **RUN TASK**.
3. Watch the 8-step execution timeline, sandbox browser, activity log, recovery event, candidate evaluation, and verification.
4. The demo uses local deterministic data; it does not perform real purchases or external browser actions.

## GitHub Pages

The repository includes `.github/workflows/deploy.yml`. Push to `main` or `master`, enable GitHub Pages with **GitHub Actions** as the source, and the workflow will build and deploy the `dist` folder.

## Reliability fixes in this version

- RUN TASK is protected against duplicate execution.
- A fresh cancellation signal is created for every run.
- Execution errors are caught and surfaced in the activity panel instead of leaving the UI stuck.
- Reset reliably cancels an in-progress execution.
- The app uses a relative module entry in `index.html`, making the static entry safer for GitHub Pages subpaths.
- TypeScript is pinned to the stable 5.x toolchain for reproducible CI installation.
