# Implementation Plan: Event-Driven Serverless Walkthrough

## Overview

This plan implements the Astro Starlight documentation site for the event-driven serverless platform walkthrough. Tasks are ordered to scaffold the project first, then add content progressively, expanding the sidebar as each wave lands so `astro build` passes at every checkpoint.

The final site has 32 content pages across 10 sidebar sections plus the splash page. Content is sourced from `event-driven-serverless-platform-demo` (`docs/ARCHITECTURE.md`, `docs/WALKTHROUGH.md`, `terraform/`, `services/`, `web/`).

## Tasks

- [ ] 1. Scaffold project root configuration files
  - [ ] 1.1 Create `package.json` with dependencies and npm scripts
    - Define project metadata (`name`, `version`, `private: true`)
    - Add dependencies: `astro` ^6.4.x, `@astrojs/starlight` ^0.40.0, `starlight-theme-vintage` ^0.1.0, `starlight-base-path` ^0.1.1, `sharp` ^0.34.0
    - Add devDependencies: `prettier` ^3.5.0, `markdownlint-cli2` ^0.22.1, `typescript` ^5.8.0
    - Add overrides: `esbuild` ^0.28.1, `js-yaml` ^4.2.0, `markdown-it` ^14.2.0
    - Define scripts: `dev` (`astro dev`), `build` (`astro build`), `preview` (`astro preview`), `validate` (`prettier --check . && markdownlint-cli2 "src/**/*.mdx"`), `test` (`astro build`), `format` (`prettier --write .`), `lint` (`markdownlint-cli2 "src/**/*.mdx"`)
    - _Requirements: 1.1, 1.2, 1.4, 1.5, 1.6_

  - [ ] 1.2 Create `.nvmrc`, `.prettierrc`, `.prettierignore`, `.markdownlint.json`, and `.gitignore`
    - `.nvmrc`: `22`
    - `.prettierrc`: semicolons enabled, double quotes, tab width 2, trailing commas `all`
    - `.prettierignore`: exclude `dist/`, `node_modules/`, `.astro/`
    - `.markdownlint.json`: `default: true`, `MD013: false`, `MD033: false`, `MD041: false` (match reference project)
    - `.gitignore`: `node_modules/`, `dist/`, `.astro/`
    - _Requirements: 1.1, 1.7, 17.1, 17.2_

  - [ ] 1.3 Create `tsconfig.json`
    - Extend `astro/tsconfigs/strict`
    - Set `baseUrl: "."` and `paths: { "@/*": ["src/*"] }`
    - _Requirements: 1.3_

  - [ ] 1.4 Create `astro.config.mjs` with base Starlight configuration
    - Set `site` to `https://jajera.github.io`
    - Set `base` to `/aws-event-driven-serverless-walkthrough/`
    - Configure Starlight with title, description, favicon, plugins (`starlightThemeVintage`, `starlightBasePath`)
    - Configure `social` array with GitHub link to `https://github.com/jajera/aws-event-driven-serverless-walkthrough`
    - Configure `editLink` with base URL pointing to the repository main branch
    - Define sidebar with **Home link only** initially; expand in tasks 2.3, 4.4, 5.6, 6.10, 8.6, and 9.10 toward the design target state
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.6, 2.7, 4.2_

  - [ ] 1.5 Create `src/content.config.ts`, `src/env.d.ts`, and `public/favicon.svg`
    - `src/content.config.ts`: define docs collection with `docsLoader` and `docsSchema`, extend schema to require `description`
    - `src/env.d.ts`: Astro type reference
    - `public/favicon.svg`: minimal SVG favicon
    - _Requirements: 16.4_

  - [ ] 1.6 Create all section subdirectories under `src/content/docs/`
    - Create: `introduction/`, `prerequisites/`, `architecture/`, `deploy/`, `verification/`, `data-contract/`, `usage/`, `development/`, `troubleshooting/`, `reference/`
    - _Requirements: 16.1_

- [ ] 2. Create splash page and Introduction section
  - [ ] 2.1 Create `src/content/docs/index.mdx` (splash page)
    - Use `template: splash` layout with hero tagline and actions (Get Started → `/introduction/project-overview/`, View Demo Repo → `https://github.com/jajera/event-driven-serverless-platform-demo`)
    - Import `Card` and `CardGrid` from `@astrojs/starlight/components`
    - Add card grid linking to Architecture, Deploy, Verification, and Usage entry pages
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 4.5_

  - [ ] 2.2 Create `src/content/docs/introduction/project-overview.mdx`
    - Include `title` and `description` frontmatter
    - Describe platform purpose and three layers: Ingest, Processing, Presentation
    - Describe GNSS RINEX ingestion, PyTECGg TEC calibration, and interactive visualization
    - List AWS services used (S3, Lambda, SQS, DynamoDB, API Gateway, Amplify, EventBridge Scheduler, CloudWatch, ECR, SNS)
    - Include architecture diagram (mermaid adapted from Demo_Repo `docs/ARCHITECTURE.md`)
    - Identify `event-driven-serverless-platform-demo` as the Demo_Repo readers clone
    - Source: `docs/ARCHITECTURE.md`
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

  - [ ] 2.3 Expand sidebar in `astro.config.mjs`: add Introduction section
    - Add group with slug `introduction/project-overview`
    - Sidebar must reference only pages that exist (Home + Introduction)
    - _Requirements: 4.1, 18.1, 18.2, 18.3_

- [ ] 3. Checkpoint — Verify base build works
  - Run `npm install`, then `npm run build`
  - Confirm sidebar includes Home and Introduction only; build exits 0
  - Ask the user if questions arise

- [ ] 4. Create Prerequisites and Architecture sections
  - [ ] 4.1 Create `src/content/docs/prerequisites/tools-and-accounts.mdx`
    - List required tools with minimum versions: AWS CLI, Terraform (>= 1.6), Docker with `buildx`, Python (>= 3.14), Node.js (>= 20), npm, curl, zip
    - Include verification commands for each tool
    - List AWS account permissions for S3, Lambda, IAM, SQS, DynamoDB, API Gateway, Amplify, EventBridge Scheduler, CloudWatch, ECR, SNS
    - Note Terraform commands run from Demo_Repo root with `-chdir=terraform`
    - Source: `docs/WALKTHROUGH.md` (Prerequisites), `terraform/versions.tf`
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

  - [ ] 4.2 Create `src/content/docs/architecture/system-overview.mdx`
    - Document high-level system architecture and data flow
    - Describe five Terraform modules: `ingest`, `ingest-scheduler`, `processing`, `presentation`, `observability`
    - Document key design decisions: Terraform-only provisioning, prefix-based catalog discovery, external processor container image, SQS standard queues
    - Do **not** document AWS Batch, batch-dispatcher, S3 Annotations, or annotations-indexer (out of scope in current demo)
    - Source: `docs/ARCHITECTURE.md`
    - _Requirements: 7.1, 7.5, 7.6_

  - [ ] 4.3 Create `src/content/docs/architecture/infrastructure-layers.mdx`
    - Document Ingest layer: EventBridge Scheduler (`ingest-scheduler` module), Ingest_Sync_Lambda, GeoNet source, Data_Lake_Bucket raw prefix
    - Document Processing layer: Process_Queue, Reprocess_Queue, DLQs, S3 notifications, Processor_Lambda container, DynamoDB Jobs_Table
    - Document Presentation layer: API Gateway (`/catalog`, `/query`, `/reprocess`), Query/Reprocess Lambdas, Amplify portal
    - Document Observability module: CloudWatch alarms, SNS topic, `event-driven-platform` dashboard
    - Source: `docs/ARCHITECTURE.md`
    - _Requirements: 7.2, 7.3, 7.4, 7.7_

  - [ ] 4.4 Expand sidebar: add Prerequisites and Architecture sections
    - Add slugs per design file-to-slug mapping
    - _Requirements: 4.1, 18.1, 18.2_

- [ ] 5. Create Deploy section
  - [ ] 5.1 Create `src/content/docs/deploy/terraform-init.mdx`
    - Document `terraform -chdir=terraform init`
    - Document plan review with `-var="region=ap-southeast-2"` (or reader's region)
    - Source: `docs/WALKTHROUGH.md`
    - _Requirements: 8.1, 8.2_

  - [ ] 5.2 Create `src/content/docs/deploy/ecr-processor-image.mdx`
    - Document ECR repository creation: `terraform -chdir=terraform apply -target=module.processing[0].aws_ecr_repository.processor_image`
    - Document mirroring with `./scripts/sync-processor-image.sh` from Demo_Repo root
    - Cross-reference terraform-init prerequisite
    - Source: `docs/WALKTHROUGH.md`
    - _Requirements: 8.1, 8.3, 8.6_

  - [ ] 5.3 Create `src/content/docs/deploy/staged-apply.mdx`
    - Document staged apply: `-target=module.processing`, then `-target=module.ingest_scheduler`, then full reconcile
    - Cross-reference ECR/image step prerequisite
    - Source: `docs/WALKTHROUGH.md`
    - _Requirements: 8.1, 8.4, 8.6_

  - [ ] 5.4 Create `src/content/docs/deploy/amplify-portal.mdx`
    - Document `deploy_amplify_on_apply` variable and manual `./scripts/deploy-amplify.sh` fallback
    - Document `VITE_API_URL`, `AMPLIFY_APP_ID`, and `WEB_SOURCE_DIR` exports for manual deploy
    - Source: `docs/WALKTHROUGH.md`
    - _Requirements: 8.1, 8.7_

  - [ ] 5.5 Create `src/content/docs/deploy/cors-lockdown.mdx`
    - Document post-deploy CORS lockdown using `amplify_domain` from `terraform output -raw cors_domain`
    - Cross-reference Amplify deploy prerequisite
    - Source: `docs/WALKTHROUGH.md`
    - _Requirements: 8.1, 8.5, 8.6_

  - [ ] 5.6 Expand sidebar: add Deploy section (5 pages)
    - _Requirements: 4.1, 18.1, 18.2_

- [ ] 6. Create Verification section
  - [ ] 6.1 Create `src/content/docs/verification/eventbridge-scheduler.mdx`
    - AWS CLI commands to verify scheduler (`aws scheduler list-schedules`)
    - Link to Troubleshooting on failure
    - Source: `docs/WALKTHROUGH.md`
    - _Requirements: 9.1, 9.2, 9.5_

  - [ ] 6.2 Create `src/content/docs/verification/manual-ingest.mdx`
    - Document `aws lambda invoke` for ingest-sync
    - Source: `docs/WALKTHROUGH.md`
    - _Requirements: 9.1, 9.2_

  - [ ] 6.3 Create `src/content/docs/verification/sqs-queues.mdx`
    - Verify Process_Queue and Reprocess_Queue depth via `terraform output` queue URLs
    - Source: `docs/WALKTHROUGH.md`
    - _Requirements: 9.1, 9.2, 9.3_

  - [ ] 6.4 Create `src/content/docs/verification/processor-lambda.mdx`
    - Verify processor Lambda state and concurrency/throttle context
    - Link to Troubleshooting for failures
    - Source: `docs/WALKTHROUGH.md`
    - _Requirements: 9.1, 9.2, 9.5_

  - [ ] 6.5 Create `src/content/docs/verification/s3-processed-output.mdx`
    - Verify `processed/tec/` keys in Data_Lake_Bucket
    - Source: `docs/WALKTHROUGH.md`
    - _Requirements: 9.1, 9.2_

  - [ ] 6.6 Create `src/content/docs/verification/rest-api.mdx`
    - Document `/catalog`, `/query`, and `POST /reprocess` checks with curl examples using `terraform output -raw api_url`
    - Source: `docs/WALKTHROUGH.md`
    - _Requirements: 9.1, 9.2, 9.4_

  - [ ] 6.7 Create `src/content/docs/verification/reprocess-workflow.mdx`
    - Document job submission, `GET /reprocess/{job_id}` polling, and Reprocess_Queue depth check
    - Source: `docs/WALKTHROUGH.md`
    - _Requirements: 9.1, 9.2_

  - [ ] 6.8 Create `src/content/docs/verification/portal.mdx`
    - Verify Amplify app URL via `terraform output -raw app_url`
    - Source: `docs/WALKTHROUGH.md`
    - _Requirements: 9.1, 9.2_

  - [ ] 6.9 Create `src/content/docs/verification/alarms-dashboard.mdx`
    - Document SNS subscription, alarm names, and `cloudwatch_dashboard_name` output
    - Link to Troubleshooting for alarm states
    - Source: `docs/WALKTHROUGH.md`
    - _Requirements: 9.1, 9.2, 9.5_

  - [ ] 6.10 Expand sidebar: add Verification section (9 pages)
    - _Requirements: 4.1, 18.1, 18.2_

- [ ] 7. Checkpoint — Verify build with Deploy and Verification content
  - Run `npm run build`; confirm all sidebar slugs through Verification resolve
  - Ask the user if questions arise

- [ ] 8. Create Data Contract section
  - [ ] 8.1 Create `src/content/docs/data-contract/sqs-message-schemas.mdx`
    - Document normalized SQS body: `bucket`, `key`, `event_time`, `attempt`, `trace_id`, optional `job_id` and `parameters`
    - Provide ingest and reprocess example payloads
    - Source: `docs/ARCHITECTURE.md`
    - _Requirements: 10.1, 10.2, 10.4_

  - [ ] 8.2 Create `src/content/docs/data-contract/dynamodb-jobs-table.mdx`
    - Document Jobs_Table schema and status lifecycle
    - Source: `docs/ARCHITECTURE.md`
    - _Requirements: 10.1, 10.2_

  - [ ] 8.3 Create `src/content/docs/data-contract/s3-key-patterns.mdx`
    - Document raw and processed key patterns
    - Source: `docs/ARCHITECTURE.md`
    - _Requirements: 10.1, 10.2, 10.5_

  - [ ] 8.4 Create `src/content/docs/data-contract/parquet-output.mdx`
    - Document Parquet columns (`epoch`, `sv`, `vtec`, etc.)
    - Source: `docs/ARCHITECTURE.md`
    - _Requirements: 10.1, 10.2_

  - [ ] 8.5 Create `src/content/docs/data-contract/api-response-schemas.mdx`
    - Document `/catalog`, `/query`, `/reprocess` request and response formats
    - Document allowed reprocess parameter overrides
    - Source: `docs/ARCHITECTURE.md`, service handler code
    - _Requirements: 10.1, 10.2, 10.3, 10.6_

  - [ ] 8.6 Expand sidebar: add Data Contract section (5 pages)
    - _Requirements: 4.1, 18.1, 18.2_

- [ ] 9. Create Usage, Development, Troubleshooting, and Reference sections
  - [ ] 9.1 Create `src/content/docs/usage/rest-api-usage.mdx`
    - Example curl for `/catalog`, `/query`, `/reprocess`; distinguish API Gateway URL from Amplify app URL
    - Source: `docs/WALKTHROUGH.md`
    - _Requirements: 11.1, 11.2, 11.3, 11.5_

  - [ ] 9.2 Create `src/content/docs/usage/portal-usage.mdx`
    - Describe station browser, time-series charts, IPP map, parameter panel
    - Source: `docs/WALKTHROUGH.md`, `web/src/`
    - _Requirements: 11.1, 11.4, 11.5_

  - [ ] 9.3 Create `src/content/docs/usage/manual-ingest.mdx`
    - Document manual ingest and status verification procedures
    - Source: `docs/WALKTHROUGH.md`
    - _Requirements: 11.1_

  - [ ] 9.4 Create `src/content/docs/development/local-setup.mdx`
    - Python 3.14 zip Lambdas in `services/ingest-sync/`, `services/query-api/`, `services/reprocess-api/`
    - Note Processor_Lambda is external container image (`ghcr.io/platformfuzz/tec-processor-image`)
    - Portal dev in `web/` with Vitest; `terraform validate` and pytest procedures
    - Source: Demo_Repo `services/`, `web/`
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

  - [ ] 9.5 Create `src/content/docs/troubleshooting/common-issues.mdx`
    - Organize by component: ingest, processing, API, portal, observability
    - Cover throttling, queue backlog, DLQ, CORS, empty catalog/query results
    - Cross-reference Deploy pages using `/aws-event-driven-serverless-walkthrough/{slug}/` link format
    - _Requirements: 13.1, 13.2, 13.3, 13.4_

  - [ ] 9.6 Create `src/content/docs/reference/environment-variables.mdx`
    - List Lambda and script environment variables with purpose
    - Source: `docs/ARCHITECTURE.md`, `terraform/modules/`
    - _Requirements: 14.1_

  - [ ] 9.7 Create `src/content/docs/reference/terraform-variables.mdx`
    - List key inputs: `region`, `lookback_hours`, `schedule_expression`, `processor_image_tag`, concurrency limits
    - Source: `terraform/variables.tf`
    - _Requirements: 14.1, 14.2_

  - [ ] 9.8 Create `src/content/docs/reference/terraform-outputs.mdx`
    - List: `api_url`, `app_url`, `bucket_name`, `queue_url`, `alarm_topic_arn`, `cloudwatch_dashboard_name`
    - Source: `terraform/outputs.tf`
    - _Requirements: 14.1, 14.3_

  - [ ] 9.9 Create `src/content/docs/reference/teardown.mdx`
    - Empty Data_Lake_Bucket, then `terraform destroy`
    - Source: `docs/WALKTHROUGH.md`
    - _Requirements: 14.1, 14.4_

  - [ ] 9.10 Expand sidebar: add Usage, Development, Troubleshooting, and Reference sections
    - Sidebar must match design target state exactly (10 section groups + Home)
    - _Requirements: 4.1, 18.1, 18.2, 18.3, 18.4_

- [ ] 10. Final validation and build verification
  - [ ] 10.1 Run `npm run validate` and fix any formatting or lint issues
    - `prettier --check .` and `markdownlint-cli2 "src/**/*.mdx"` must exit 0
    - _Requirements: 17.1, 17.2, 17.3_

  - [ ] 10.2 Run `npm run build` and verify successful build
    - All 32 sidebar slugs resolve; no broken imports or references
    - _Requirements: 15.3, 15.4, 17.4, 18.4_

  - [ ] 10.3 Manual review against design checklist
    - Confirm walkthrough commands match current demo deployment
    - Confirm Processor Lambda and prefix-based catalog documented (not Batch/Annotations)
    - Confirm splash CardGrid and Demo_Repo links work
    - _Requirements: 3.4, 5.6, 7.6, 11.5, 14.4_

- [ ] 11. Final checkpoint — Ensure all validation and build checks pass
  - `npm run validate` and `npm run build` both exit 0
  - Ask the user if questions arise

## Notes

- This is a content-only documentation site — no runtime code, APIs, or infrastructure changes in the Demo_Repo
- Property-based testing is not applicable; validation relies on `prettier`, `markdownlint-cli2`, and `astro build`
- **Incremental sidebar**: expand `astro.config.mjs` in tasks 2.3, 4.4, 5.6, 6.10, 8.6, and 9.10 so each checkpoint build only references existing pages
- All MDX files require `title` and `description` frontmatter
- Prose cross-links use `/aws-event-driven-serverless-walkthrough/{slug}/`; hero/sidebar/card links use root-relative paths
- CI/deploy workflows in `.github/workflows/` already exist and require no modification
- Do not document out-of-scope demo features: AWS Batch, batch-dispatcher, S3 Annotations, annotations-indexer

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2", "1.3"] },
    { "id": 1, "tasks": ["1.4", "1.5", "1.6"] },
    { "id": 2, "tasks": ["2.1", "2.2", "2.3"] },
    { "id": 3, "tasks": ["4.1", "4.2", "4.3", "4.4"] },
    { "id": 4, "tasks": ["5.1", "5.2", "5.3", "5.4", "5.5", "5.6"] },
    {
      "id": 5,
      "tasks": [
        "6.1",
        "6.2",
        "6.3",
        "6.4",
        "6.5",
        "6.6",
        "6.7",
        "6.8",
        "6.9",
        "6.10"
      ]
    },
    { "id": 6, "tasks": ["8.1", "8.2", "8.3", "8.4", "8.5", "8.6"] },
    {
      "id": 7,
      "tasks": [
        "9.1",
        "9.2",
        "9.3",
        "9.4",
        "9.5",
        "9.6",
        "9.7",
        "9.8",
        "9.9",
        "9.10"
      ]
    },
    { "id": 8, "tasks": ["10.1", "10.2", "10.3"] }
  ],
  "checkpoints": [
    { "after": "2.3", "task": "3", "gate": "npm run build" },
    { "after": "6.10", "task": "7", "gate": "npm run build" },
    {
      "after": "10.3",
      "task": "11",
      "gate": "npm run validate && npm run build"
    }
  ]
}
```
