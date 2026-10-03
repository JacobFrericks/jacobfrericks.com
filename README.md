# jacobfrericks.com

Source for [www.jacobfrericks.com](https://www.jacobfrericks.com), a DevOps and DevSecOps portfolio.
The site is built and deployed by GitHub Actions to GitHub Pages.

## Test locally

```sh
npm ci
npm run build && npm run preview   # serves the built site at http://localhost:4321
```

Pull requests run the build only. Merging to `main` deploys.
