# jacobfrericks.com

Source for [www.jacobfrericks.com](https://www.jacobfrericks.com), a DevOps and DevSecOps portfolio.
The site is built and deployed by GitHub Actions to GitHub Pages.

## Test locally

```sh
npm ci
npm run build && npm run preview   # serves the built site at http://localhost:4321
```

Pull requests run the build only. Merging to `main` deploys.

## Verify a release

Each deploy from `main` publishes the site bundle and its SLSA Build L3 provenance as a release.

```sh
gh release download --repo JacobFrericks/jacobfrericks.com --pattern 'site.*'
slsa-verifier verify-artifact site.tar \
  --provenance-path site.intoto.jsonl \
  --source-uri github.com/JacobFrericks/jacobfrericks.com
```

## License

The code in this repository (workflows, configuration, and site source) is released under the [MIT License](LICENSE).
The written content and personal information on the site are © Jacob Frericks, all rights reserved.

## Security

See [SECURITY.md](SECURITY.md) to report a vulnerability.
