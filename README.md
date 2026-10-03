# jacobfrericks.com

Source for [www.jacobfrericks.com](https://www.jacobfrericks.com), a DevOps and DevSecOps portfolio.
The site is built and deployed by GitHub Actions to GitHub Pages.

## Test locally

```sh
npm ci
npm run build && npm run preview   # serves the built site at http://localhost:4321
```

Pull requests run the build, tests, and scans. Merging to `main` updates an open release PR
(managed by release-please from Conventional Commits). Merging that release PR publishes a
new version and deploys it. See [CHANGELOG.md](CHANGELOG.md) for release notes.

## Verify a release

Each release (`vX.Y.Z`) carries the site bundle that was deployed, a CycloneDX SBOM (`site.cdx.json`) of every package
used to build it, and SLSA Build L3 provenance that covers both files.

```sh
gh release download --repo JacobFrericks/jacobfrericks.com --pattern 'site.*'
slsa-verifier verify-artifact site.tar site.cdx.json \
  --provenance-path site.intoto.jsonl \
  --source-uri github.com/JacobFrericks/jacobfrericks.com
```

## License

The code in this repository (workflows, configuration, and site source) is released under the [MIT License](LICENSE).
The written content and personal information on the site are © Jacob Frericks, all rights reserved.

## Security

See [SECURITY.md](SECURITY.md) to report a vulnerability.
