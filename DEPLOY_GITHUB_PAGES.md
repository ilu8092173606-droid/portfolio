# GitHub Pages deployment

The `pages.yml` workflow builds and publishes the portfolio to GitHub Pages on every push to `master`. It supports project pages at `/portfolio/` and the custom domain in `public/CNAME` at the domain root. GitHub Pages serves the static portfolio; the PHP studio, API, and private-document unlock are not included in the Pages artifact.

## One-time GitHub setup

1. In the repository, open **Settings → Pages** and choose **GitHub Actions** as the build and deployment source.
2. Set the custom domain to `bittusingh.online` and save it.
3. Wait for the Pages workflow to finish. The public URL is `https://bittusingh.online/` once DNS is pointed to GitHub.

## DNS records for the apex domain

At the domain's DNS provider, add these `A` records for `@`:

| Type | Host | Value |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |

To use `www.bittusingh.online` too, add a `CNAME` record with host `www` and value `ilu8092173606-droid.github.io`. DNS changes can take time to propagate. Enable **Enforce HTTPS** in the Pages settings after GitHub verifies the domain and provisions its certificate.
