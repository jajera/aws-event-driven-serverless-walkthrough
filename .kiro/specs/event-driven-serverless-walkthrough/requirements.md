# Requirements Document

## Introduction

This document defines the requirements for the Event-Driven Serverless Walkthrough documentation site — a progressive, phase-based guide covering architecture, deployment, verification, data contracts, usage, and troubleshooting for the `event-driven-serverless-platform-demo` project.

The site uses Astro Starlight and follows the structure and style established by the `aws-iot-walkthrough` reference project. Content files are `.mdx` in `src/content/docs/`, the sidebar is configured in `astro.config.mjs`, and the site must pass `prettier --check` and `markdownlint-cli2` validation.

This specification covers documentation structure and content quality only. It does not require changing runtime behavior in the demo platform or Terraform modules.

## Glossary

- **Site**: The Astro Starlight documentation site published at https://jajera.github.io/aws-event-driven-serverless-walkthrough/
- **Demo_Repo**: The source repository `event-driven-serverless-platform-demo` from which walkthrough commands are run
- **Starlight**: The Astro documentation theme (version 0.40.x) used to render MDX content as a structured documentation site
- **Sidebar**: The left-hand navigation panel organizing documentation pages into logical phases, defined in the `sidebar` array of `astro.config.mjs`
- **Content_File**: A `.mdx` file located under `src/content/docs/` that represents one documentation page
- **Section**: A top-level sidebar group containing one or more Content_Files
- **Splash_Page**: The landing page (`index.mdx`) using Starlight hero and card-grid components to introduce the walkthrough
- **Build_System**: The Node.js 22 toolchain comprising Astro, TypeScript, Prettier, and markdownlint
- **CI_Pipeline**: The GitHub Actions workflow that runs validation and build checks on pull requests
- **Deploy_Pipeline**: The GitHub Actions workflow that builds and deploys the site to GitHub Pages on push to main
- **Base_Path**: The URL path prefix (`/aws-event-driven-serverless-walkthrough/`) required for GitHub Pages project sites
- **Validation_Scripts**: The npm scripts (`validate`, `format`, `lint`) that enforce code style and markdown quality
- **Ingest_Sync_Lambda**: The Lambda function that syncs RINEX files from GeoNet open data into the private data lake on a schedule
- **Processor_Lambda**: The Lambda container image (`ghcr.io/platformfuzz/tec-processor-image`, mirrored to ECR) that consumes SQS messages and runs PyTECGg calibration
- **Process_Queue**: The SQS standard queue receiving S3 ObjectCreated notifications for new raw RINEX files
- **Reprocess_Queue**: The SQS standard queue receiving reprocessing job messages from the Reprocess API
- **Data_Lake_Bucket**: The private S3 bucket holding raw RINEX under `raw/rinexhourly/` and processed TEC output under `processed/tec/`

## Requirements

### Requirement 1: Project Scaffolding

**User Story:** As a developer, I want the documentation site scaffolded with the correct Astro Starlight stack, so that it matches the reference project conventions and builds successfully.

#### Acceptance Criteria

1. THE Build_System SHALL use Node.js 22 as specified in a `.nvmrc` file
2. THE Build_System SHALL use Astro 6 with Starlight 0.40.x, `starlight-theme-vintage`, and `starlight-base-path` as dependencies
3. THE Build_System SHALL use TypeScript in strict mode for site configuration
4. THE Build_System SHALL include npm scripts for `dev`, `build`, `preview`, `validate`, `test`, `format`, and `lint` commands
5. WHEN the `validate` script is executed, THE Build_System SHALL run Prettier checks and markdownlint checks
6. WHEN the `test` script is executed, THE Build_System SHALL run the Astro build command
7. THE Build_System SHALL configure Prettier with semicolons enabled, double quotes, tab width of 2, and trailing commas set to `all`

### Requirement 2: Site Configuration and Base Path

**User Story:** As a developer, I want the site configured with the correct base path and metadata, so that it deploys correctly to GitHub Pages at the expected URL.

#### Acceptance Criteria

1. THE Site SHALL configure the base path to `/aws-event-driven-serverless-walkthrough/`
2. THE Site SHALL set the site URL to `https://jajera.github.io`
3. THE Site SHALL set the title to "Event-Driven Serverless Walkthrough"
4. THE Site SHALL use `starlight-theme-vintage` for visual styling
5. THE Site SHALL configure the Sidebar with sections matching the defined documentation phases
6. THE Site SHALL include a GitHub social link pointing to `https://github.com/jajera/aws-event-driven-serverless-walkthrough`
7. THE Site SHALL configure an `editLink` base URL pointing to the repository `main` branch

### Requirement 3: Splash Page

**User Story:** As a visitor, I want a landing page with a hero section and navigation cards, so that I can quickly understand the project scope and navigate to specific sections.

#### Acceptance Criteria

1. THE Splash_Page SHALL display a hero section with the project title and a brief description of the event-driven serverless GNSS platform
2. THE Splash_Page SHALL display a card grid linking to major documentation sections
3. THE Splash_Page SHALL use the Starlight splash template layout
4. THE Splash_Page SHALL link to the Demo_Repo as the hands-on deployment target

### Requirement 4: Sidebar Navigation Structure

**User Story:** As a reader, I want documentation organized in a progressive sidebar, so that I can follow the walkthrough in logical order from introduction to reference.

#### Acceptance Criteria

1. THE Sidebar SHALL contain the following top-level Sections in order: Introduction, Prerequisites, Architecture, Deploy, Verification, Data Contract, Usage, Development, Troubleshooting, Reference
2. THE Sidebar SHALL render the Home splash page as a non-collapsible entry positioned before the first Section, using link value `/`
3. WHEN a Section contains multiple pages, THE Sidebar SHALL group those pages under a collapsible heading
4. THE Sidebar SHALL present Sections in the order that reflects a progressive deployment workflow
5. WHEN a reader navigates to the Site without specifying a path, THE Site SHALL display the Splash_Page rather than the first Section

### Requirement 5: Introduction Content

**User Story:** As a reader, I want an introduction page that explains the project purpose and scope, so that I understand what the walkthrough covers before starting.

#### Acceptance Criteria

1. THE Site SHALL include an Introduction Section containing a Content_File titled "Project Overview"
2. THE Project Overview page SHALL describe the event-driven serverless platform purpose and the three functional layers: Ingest, Processing, and Presentation
3. THE Project Overview page SHALL describe GNSS RINEX ingestion, PyTECGg TEC calibration, and interactive visualization capabilities
4. THE Project Overview page SHALL list the AWS services used by the platform, including S3, Lambda, SQS, DynamoDB, API Gateway, Amplify, EventBridge Scheduler, CloudWatch, ECR, and SNS
5. THE Project Overview page SHALL include an architecture diagram showing directional data flow from GeoNet through ingest, SQS-driven processing, and the REST API / Amplify portal
6. THE Project Overview page SHALL identify the Demo_Repo as the repository readers clone for hands-on steps

### Requirement 6: Prerequisites Content

**User Story:** As a reader, I want a prerequisites page listing all tools and accounts needed, so that I can prepare my environment before starting the deployment.

#### Acceptance Criteria

1. THE Site SHALL include a Prerequisites Section containing a Content_File titled "Tools and Accounts"
2. THE Prerequisites page SHALL list required tools: AWS CLI, Terraform (>= 1.6), Docker with `buildx`, Python (>= 3.14), Node.js (>= 20), npm, curl, and zip
3. THE MDX_Content SHALL specify minimum versions for each prerequisite tool
4. THE MDX_Content SHALL include instructions for verifying each prerequisite is installed
5. THE Prerequisites page SHALL list AWS account permissions required for S3, Lambda, IAM, SQS, DynamoDB, API Gateway, Amplify, EventBridge Scheduler, CloudWatch, ECR, and SNS
6. THE Prerequisites page SHALL note that all Terraform commands run from the Demo_Repo root with `-chdir=terraform`

### Requirement 7: Architecture Content

**User Story:** As a reader, I want architecture documentation explaining the system design, so that I understand how the platform components interact.

#### Acceptance Criteria

1. THE Site SHALL include an Architecture Section with Content_Files covering system overview and infrastructure layering
2. THE Architecture pages SHALL describe the Ingest layer: EventBridge Scheduler (`ingest-scheduler` module), Ingest_Sync_Lambda, GeoNet source bucket, and Data_Lake_Bucket raw prefix
3. THE Architecture pages SHALL describe the Processing layer: Process_Queue, Reprocess_Queue, dead-letter queues, S3 event notifications, Processor_Lambda container image, and DynamoDB Jobs_Table
4. THE Architecture pages SHALL describe the Presentation layer: API Gateway REST API (`/catalog`, `/query`, `/reprocess`), Query_API Lambda, Reprocess_API Lambda, and Amplify-hosted Vite portal
5. THE Architecture pages SHALL document the five Terraform modules: `ingest`, `ingest-scheduler`, `processing`, `presentation`, and `observability`
6. THE Architecture pages SHALL document key design decisions including Terraform-only provisioning, prefix-based catalog discovery, external processor container image, and SQS standard queues
7. THE Architecture pages SHALL document the `observability` module: CloudWatch alarms, SNS topic, and the `event-driven-platform` dashboard

### Requirement 8: Deploy Content

**User Story:** As a reader, I want step-by-step deployment instructions, so that I can deploy the platform infrastructure in the correct order.

#### Acceptance Criteria

1. THE Site SHALL include a Deploy Section with Content_Files covering: Terraform init, ECR and processor image sync, staged apply, Amplify portal deploy, and CORS lockdown
2. THE Deploy pages SHALL present steps in sequential order reflecting dependency requirements
3. THE Deploy pages SHALL document creating the ECR repository via targeted `terraform apply` before mirroring the processor image with `scripts/sync-processor-image.sh`
4. THE Deploy pages SHALL document staged apply: processing resources first, then `module.ingest_scheduler`, then full reconcile
5. THE Deploy pages SHALL document post-deploy CORS lockdown using `amplify_domain` from Terraform output
6. WHEN a deploy step has prerequisites from a previous step, THE MDX_Content SHALL explicitly reference the dependency
7. THE Deploy pages SHALL document the `deploy_amplify_on_apply` variable and manual `./scripts/deploy-amplify.sh` fallback when Node.js is unavailable during apply

### Requirement 9: Verification Content

**User Story:** As a reader, I want post-deployment verification steps, so that I can confirm each component is functioning correctly.

#### Acceptance Criteria

1. THE Site SHALL include a Verification Section with Content_Files covering: EventBridge Scheduler, manual ingest, SQS queues, Processor_Lambda, S3 processed output, REST API, reprocess workflow, Portal, and alarms/dashboard
2. THE Verification pages SHALL provide specific AWS CLI commands or curl checks for each verification step
3. THE Verification pages SHALL document verification of both Process_Queue and Reprocess_Queue depth attributes
4. THE Verification pages SHALL document `/catalog`, `/query`, and `/reprocess` API checks with example curl commands
5. WHEN a verification step fails, THE MDX_Content SHALL reference the Troubleshooting section for remediation

### Requirement 10: Data Contract Content

**User Story:** As a developer, I want data contract documentation, so that I understand the message schemas, storage patterns, and API response formats.

#### Acceptance Criteria

1. THE Site SHALL include a Data Contract Section with Content_Files documenting: SQS message schemas, DynamoDB Jobs_Table structure, S3 key patterns, Parquet output columns, and API response schemas
2. THE Data Contract pages SHALL provide example payloads for each schema
3. THE Data Contract pages SHALL document the `/catalog`, `/query`, and `/reprocess` API endpoints with request and response formats
4. THE Data Contract pages SHALL document the normalized SQS message body used by both ingest notifications and reprocess jobs (`bucket`, `key`, `event_time`, `attempt`, `trace_id`, optional `job_id` and `parameters`)
5. THE Data Contract pages SHALL document S3 key patterns for raw ingest (`raw/rinexhourly/{year}/{doy}/{filename}`) and processed output (`processed/tec/station={station}/year={year}/doy={doy}/{filename}.{ext}`)
6. THE Data Contract pages SHALL document allowed reprocess parameter overrides: `NAV_DAY_OFFSET`, `SAVE_PARQUET`, `SAVE_CSV`, `SAVE_JSON`, `SAVE_STATIC_PLOTS`, `SAVE_INTERACTIVE_PLOTS`

### Requirement 11: Usage Content

**User Story:** As a user, I want usage documentation, so that I can interact with the deployed platform through the REST API and portal.

#### Acceptance Criteria

1. THE Site SHALL include a Usage Section with Content_Files covering: REST API usage, Portal usage, and manual ingest procedures
2. THE Usage pages SHALL provide example curl commands for `/catalog`, `/query`, and `/reprocess` endpoints
3. THE Usage pages SHALL describe reprocess job submission and status polling via `GET /reprocess/{job_id}`
4. THE Usage pages SHALL describe the React/Vite portal interface: station browser, time-series charts, IPP map, and parameter panel for reprocessing
5. THE Usage pages SHALL distinguish between the API Gateway URL (CLI/scripts) and the Amplify app URL (browser portal)

### Requirement 12: Development Content

**User Story:** As a developer, I want development documentation, so that I can set up a local development environment and run tests.

#### Acceptance Criteria

1. THE Site SHALL include a Development Section with Content_Files covering local development setup
2. THE Development pages SHALL describe the Python 3.14 zip Lambdas in the Demo_Repo: `services/ingest-sync/`, `services/query-api/`, and `services/reprocess-api/`
3. THE Development pages SHALL note that the Processor_Lambda runs as an external container image and is not developed locally in the Demo_Repo
4. THE Development pages SHALL describe portal development in `web/` with Vitest and manual Amplify deploy via `scripts/deploy-amplify.sh`
5. THE Development pages SHALL describe `terraform validate` and pytest procedures for Lambda services

### Requirement 13: Troubleshooting Content

**User Story:** As a reader, I want troubleshooting documentation, so that I can resolve common issues encountered during deployment or operation.

#### Acceptance Criteria

1. THE Site SHALL include a Troubleshooting Section with Content_Files listing common issues and their resolutions
2. THE Troubleshooting pages SHALL organize entries by platform component (ingest, processing, API, portal, observability)
3. THE Troubleshooting pages SHALL cover processor Lambda throttling, queue backlog, DLQ messages, CORS misconfiguration, and empty catalog/query results
4. WHEN a troubleshooting entry relates to a specific deployment step, THE MDX_Content SHALL cross-reference the relevant Deploy page

### Requirement 14: Reference Content

**User Story:** As a developer, I want reference documentation, so that I can look up environment variables, Terraform variables, outputs, and teardown procedures.

#### Acceptance Criteria

1. THE Site SHALL include a Reference Section with Content_Files covering: environment variables, Terraform variables, Terraform outputs, and teardown procedures
2. THE Reference pages SHALL list key Terraform input variables with descriptions and default values (including `region`, `lookback_hours`, `schedule_expression`, `processor_image_tag`, and concurrency limits)
3. THE Reference pages SHALL list key Terraform outputs (`api_url`, `app_url`, `bucket_name`, `queue_url`, `alarm_topic_arn`, `cloudwatch_dashboard_name`)
4. THE Reference pages SHALL provide complete teardown instructions including emptying the Data_Lake_Bucket before `terraform destroy`

### Requirement 15: CI and Deploy Pipeline Compatibility

**User Story:** As a maintainer, I want the documentation site to work with the existing CI and deploy workflows, so that pull requests are validated and merges to main trigger deployment.

#### Acceptance Criteria

1. WHEN a pull request is created, THE CI_Pipeline SHALL run validation and build checks using the existing `ci.yml` workflow
2. WHEN code is pushed to the main branch, THE Deploy_Pipeline SHALL build and deploy the site to GitHub Pages using the existing `deploy.yml` workflow
3. THE Build_System SHALL produce build output compatible with the actionsforge reusable workflow expectations
4. THE Site SHALL render correctly when served from the `/aws-event-driven-serverless-walkthrough/` base path on GitHub Pages

### Requirement 16: Content File Organization

**User Story:** As a maintainer, I want content files organized consistently, so that navigation slugs match directory structure and the reference project conventions.

#### Acceptance Criteria

1. THE Site SHALL store Content_Files in subdirectories under `src/content/docs/` where each subdirectory name matches its Section slug (`introduction`, `prerequisites`, `architecture`, `deploy`, `verification`, `data-contract`, `usage`, `development`, `troubleshooting`, `reference`)
2. THE Site SHALL store the Splash_Page (`index.mdx`) directly in `src/content/docs/` without placing it inside any Section subdirectory
3. THE Site SHALL use kebab-case filenames for all Content_Files
4. EACH Content_File SHALL include `title` and `description` frontmatter fields

### Requirement 17: Validation Compliance

**User Story:** As a maintainer, I want all content files to pass linting and formatting checks, so that CI validation continues to pass.

#### Acceptance Criteria

1. WHEN any file within `src/` is created or modified, running `prettier --check` against the project SHALL return exit code 0
2. WHEN any `.mdx` file matching `src/**/*.mdx` is created or modified, running `markdownlint-cli2` against the project SHALL return exit code 0
3. WHEN the `npm run validate` script is executed, THE script SHALL return exit code 0 confirming both Prettier and markdownlint checks pass
4. WHEN `astro build` is executed, THE Site SHALL produce exit code 0 with no error-level diagnostic output

### Requirement 18: Sidebar Configuration

**User Story:** As a maintainer, I want the `astro.config.mjs` sidebar array to reflect the documented section structure, so that navigation matches content organization.

#### Acceptance Criteria

1. THE `astro.config.mjs` file SHALL define the sidebar with exactly 10 Section groups in the order specified in Requirement 4
2. THE sidebar configuration SHALL reference each Content_File using the slug format `{section-subdirectory}/{filename-without-extension}`
3. THE sidebar configuration SHALL retain the Home link as the first entry before Section groups, using link value `/`
4. IF a slug in the sidebar configuration does not correspond to an existing Content_File, THEN THE Site SHALL fail the `astro build` step with a build error
