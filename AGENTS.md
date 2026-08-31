# Agent notes

## Repos

| Repo                                             | Role                                                        |
| ------------------------------------------------ | ----------------------------------------------------------- |
| `jajera/aws-event-driven-serverless-walkthrough` | This docs site (GitHub Pages)                               |
| `jajera/event-driven-serverless-platform-demo`   | Source Terraform and Lambda code this walkthrough documents |

Do not invent AWS account IDs, S3 bucket names, or custom domains for the lab. Use placeholder values from the demo only.

## Docs source of truth

Walkthrough steps live in `src/content/docs/**/*.mdx`. Keep sidebar slugs in `astro.config.mjs` aligned with those files.

## Site URL

Production docs: `https://aws-event-driven-serverless-walkthrough.johna.kiwi` (Pages + Route 53 CNAME via johna-kiwi-infra `sites.yaml`).
