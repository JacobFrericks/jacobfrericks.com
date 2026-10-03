# Contributing

Thanks for your interest. This is a personal portfolio site, but bug reports and fixes are welcome.

## How to contribute

1. **Open an issue** for a bug or idea: https://github.com/JacobFrericks/jacobfrericks.com/issues
   For a security problem, follow [SECURITY.md](SECURITY.md) instead.
2. **Open a pull request** from a branch. Keep it small and focused on one change.
3. **Wait for the checks.** Every pull request must pass the build, tests, linter, and security scans
   (Gitleaks, Semgrep, Trivy, zizmor) before it can merge.
4. **Review.** The owner reviews and merges. Changes reach the live site in the next release.

## Requirements for a pull request

- All required checks pass.
- **New functionality comes with tests.** Bug fixes come with a test that would have caught the bug.
- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/)
  (`feat:`, `fix:`, `docs:`, `ci:`, `test:`, `chore:`). Release notes are generated from them.
- GitHub Actions are pinned by full commit SHA, with the version in a comment.
- Dependencies are pinned to exact versions in `package.json`.
- No secrets, credentials, or personal data in the code or commit history.

## Run it locally

```sh
npm ci
npm run build
npm test
npm run preview   # http://localhost:4321
```
