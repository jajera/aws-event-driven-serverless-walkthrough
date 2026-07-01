export const glossary: Record<string, string> = {
  amplify:
    "AWS Amplify — hosts the Vite portal SPA. This walkthrough deploys via manual zip upload (no Git connection required).",
  "api-gateway":
    "Amazon API Gateway — REST API exposing `/catalog`, `/query`, and `/reprocess`. Browser CORS is locked to the Amplify hostname; CLI clients call the API Gateway URL directly.",
  aws: "Amazon Web Services — cloud platform for ingest, processing, storage, API, and portal hosting in this walkthrough.",
  cloudwatch:
    "Amazon CloudWatch — alarms, dashboard (`event-driven-platform`), and structured Lambda logs for observability.",
  "data-lake-bucket":
    "Private S3 bucket holding raw RINEX under `raw/rinexhourly/` and processed TEC output under `processed/tec/`.",
  "demo-repo":
    "event-driven-serverless-platform-demo — source repository for Terraform, Lambda services, portal, and scripts. Commands run from its root with `terraform -chdir=terraform` unless stated otherwise.",
  dlq: "Dead-letter queue — SQS queue receiving messages that exceeded maxReceiveCount (5). CloudWatch alarms fire when visible count ≥ 1.",
  doy: "Day of year — three-digit value (001–366) used in RINEX paths and processed output keys.",
  dynamodb:
    "Amazon DynamoDB — Jobs table tracks reprocessing job status by `job_id` (queued → processing → completed/failed).",
  ecr: "Amazon Elastic Container Registry — stores the mirrored processor Lambda container image at deploy time.",
  "eventbridge-scheduler":
    "AWS EventBridge Scheduler — triggers ingest-sync Lambda on a recurring UTC schedule (default: hourly).",
  geonet:
    "GeoNet open data — public S3 bucket `geonet-open-data` with GNSS RINEX hourly files under `gnss/rinexhourly/`. Not owned by this stack; no push notification when new files arrive.",
  gnss: "Global Navigation Satellite System — source of RINEX observation data ingested and calibrated in this platform.",
  iam: "AWS Identity and Access Management — execution roles and policies for Lambdas, Scheduler, API Gateway, and S3.",
  "ingest-sync":
    "Ingest-sync Lambda (`services/ingest-sync/`) — polls GeoNet on schedule and copies recent RINEX into the data lake (workaround for no source-bucket event subscription).",
  ipp: "Ionospheric Pierce Point — geographic location where the satellite signal intersects the ionospheric shell; plotted on the portal IPP map.",
  "jobs-table":
    "DynamoDB table keyed by `job_id` — stores reprocess job metadata, parameters, status, and output references.",
  lambda:
    "AWS Lambda — serverless compute for ingest-sync, query-api, reprocess-api, and the processor container image.",
  "lookback-hours":
    "Ingest configuration — UTC rolling window (default 1 hour) defining how far back ingest-sync scans for new RINEX files.",
  parquet:
    "Columnar file format — primary processed output for efficient Query API range scans; JSON is a fallback when `pyarrow` is unavailable.",
  "process-queue":
    "SQS standard queue — receives S3 ObjectCreated notifications for new raw RINEX files; triggers processor Lambda ingest path.",
  "processor-lambda":
    "Processor Lambda container — runs PyTECGg calibration per SQS message; adopted when a Batch on Fargate parallel-execution quota increase was rejected. Image from `ghcr.io/platformfuzz/tec-processor-image` mirrored to ECR.",
  pytecg:
    "PyTECGg — Python library performing TEC calibration on GNSS RINEX observations inside the processor container.",
  "query-api":
    "Query API Lambda (`services/query-api/`) — serves `/catalog` and `/query` from processed S3 keys and Parquet/JSON files.",
  "reprocess-api":
    "Reprocess API Lambda (`services/reprocess-api/`) — accepts `/reprocess` jobs, writes DynamoDB records, enqueues Reprocess_Queue.",
  "reprocess-queue":
    "SQS standard queue — buffers reprocessing job messages from the Reprocess API with lower concurrency than ingest.",
  rinex:
    "Receiver Independent Exchange Format — standard GNSS observation file format synced from GeoNet and calibrated by the processor.",
  s3: "Amazon Simple Storage Service — data lake bucket for raw ingest and processed TEC output; S3 events trigger processing.",
  sns: "Amazon Simple Notification Service — publishes CloudWatch alarm notifications; subscribe an email endpoint after deploy.",
  sqs: "Amazon Simple Queue Service — buffers ingest and reprocess messages between S3/API and the processor Lambda.",
  station:
    "Four-character GNSS receiver site identifier (e.g. `auck`) parsed from RINEX filenames and used in processed key paths.",
  tec: "Total Electron Content — integrated electron density along the GNSS signal path; primary calibrated output of the processor.",
  terraform:
    "HashiCorp Terraform — provisions all platform infrastructure through five modules in `terraform/`.",
  "trace-id":
    "UUID v4 correlation ID — propagated in SQS messages and structured logs for end-to-end request tracing.",
};
