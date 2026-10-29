# Experiment 5 — Git Workflow and GitHub Actions CI

## Repository and branches

The project is a monorepo: `server/` contains the Express API and its Jest/Supertest tests; `client/` contains the React/Vite application. The workflow preserves `main` and develops through `develop` and `feature/ci-pipeline`.

Branch flow:

```text
main
└── develop
    └── feature/ci-pipeline
```

The feature branch contains the CI workflow and this experiment documentation. It is merged into `develop`; this exercise does not merge into `main`.

Commands used for the feature workflow:

```bash
git switch -c develop main
git switch -c feature/ci-pipeline develop
git add .github/workflows/ci.yml docs/experiment-5
git commit -m "Add Git workflow and CI experiment documentation"
git switch develop
git merge --no-ff feature/ci-pipeline
```

## Controlled documentation merge-conflict demonstration

The conflict uses only `docs/experiment-5/conflict-demo.md`. Two branches start from `develop`, change its `Resolution note:` line to different harmless documentation text, and commit independently.

```bash
git switch develop
git switch -c demo/conflict-a
# Change the Resolution note line to: "Resolution note: Keep branch A wording."
git add docs/experiment-5/conflict-demo.md
git commit -m "Document conflict branch A wording"

git switch develop
git switch -c demo/conflict-b
# Change the same Resolution note line to: "Resolution note: Keep branch B wording."
git add docs/experiment-5/conflict-demo.md
git commit -m "Document conflict branch B wording"

git switch demo/conflict-a
git merge --no-commit demo/conflict-b
# Git reports a conflict because both branches changed the same line.
```

Git marks the competing lines with `<<<<<<<`, `=======`, and `>>>>>>>`. Resolve the conflict by replacing those markers and both competing lines with the agreed neutral line:

```text
Resolution note: Keep the final wording clear and neutral.
```

Then finish the merge and include the resolved demonstration in `develop`:

```bash
git add docs/experiment-5/conflict-demo.md
git commit -m "Resolve documentation merge conflict"
git switch develop
git merge --no-ff demo/conflict-a
git log --oneline --graph --decorate --all
```

No application source, authentication logic, middleware, or database configuration is involved in this demonstration.

## Continuous integration

`.github/workflows/ci.yml` runs for pushes to `main`, `develop`, and `feature/**`, and for pull requests targeting `main` or `develop`. It uses Node.js 20 and the checked-in npm lockfiles:

1. The backend job runs `npm ci` in `server/`, then `npm test`.
2. The frontend job runs `npm ci` in `client/`, then `npm run build`.
3. The frontend job depends on the backend job, so a failed backend test prevents the workflow from reporting success.

The workflow requests read-only repository contents permission. It does not need or expose deployment credentials. The backend test JWT secret is a non-production CI-only placeholder.

The frontend package has no automated test script. CI therefore verifies that the frontend production build succeeds; it does not claim to run frontend unit tests.

## Local verification

Run from the repository root:

```bash
cd server && npm ci && npm test
cd ../client && npm ci && npm run build
```

Recorded results:

- Backend: 16 Jest/Supertest tests passed.
- Frontend: Vite production build passed.
- Git: verify `git diff --check`, branch graph, and clean working tree after local commits.
- GitHub Actions: not observed in GitHub during this exercise because changes are not pushed.

## Screenshot checklist

- [ ] `git branch -a` showing `main`, `develop`, `feature/ci-pipeline`, and conflict-demo branches.
- [ ] `git log --oneline --graph --decorate --all` showing the feature merge and conflict-resolution merge.
- [ ] The merge-conflict markers in the documentation file before resolution.
- [ ] The resolved documentation line and the conflict-resolution commit.
- [ ] A passing backend test job and frontend build job in GitHub Actions after a future push.

