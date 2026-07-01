import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightThemeVintage from "starlight-theme-vintage";
import { starlightBasePath } from "starlight-base-path";

export default defineConfig({
  site: "https://jajera.github.io",
  base: "/aws-event-driven-serverless-walkthrough/",
  integrations: [
    starlight({
      title: "Event-Driven Serverless Walkthrough",
      favicon: "/favicon.svg",
      description:
        "Step-by-step walkthrough for the AWS event-driven serverless GNSS platform — ingest, TEC processing, and visualization.",
      head: [
        {
          tag: "meta",
          attrs: {
            property: "og:image",
            content:
              "https://jajera.github.io/aws-event-driven-serverless-walkthrough/og-image.png",
          },
        },
        {
          tag: "meta",
          attrs: {
            name: "twitter:image",
            content:
              "https://jajera.github.io/aws-event-driven-serverless-walkthrough/og-image.png",
          },
        },
      ],
      plugins: [starlightThemeVintage(), starlightBasePath()],
      social: [
        {
          icon: "github",
          label: "Source Repository",
          href: "https://github.com/jajera/aws-event-driven-serverless-walkthrough",
        },
      ],
      editLink: {
        baseUrl:
          "https://github.com/jajera/aws-event-driven-serverless-walkthrough/edit/main/",
      },
      sidebar: [
        { label: "Home", link: "/" },
        {
          label: "Introduction",
          items: [
            {
              label: "Project Overview",
              slug: "introduction/project-overview",
            },
          ],
        },
        {
          label: "Prerequisites",
          items: [
            {
              label: "Tools and Accounts",
              slug: "prerequisites/tools-and-accounts",
            },
          ],
        },
        {
          label: "Architecture",
          items: [
            { label: "System Overview", slug: "architecture/system-overview" },
            {
              label: "Infrastructure Layers",
              slug: "architecture/infrastructure-layers",
            },
          ],
        },
        {
          label: "Deploy",
          items: [
            { label: "Terraform Init", slug: "deploy/terraform-init" },
            {
              label: "ECR and Processor Image",
              slug: "deploy/ecr-processor-image",
            },
            { label: "Staged Apply", slug: "deploy/staged-apply" },
            { label: "Amplify Portal", slug: "deploy/amplify-portal" },
            { label: "CORS Lockdown", slug: "deploy/cors-lockdown" },
          ],
        },
        {
          label: "Verification",
          items: [
            {
              label: "EventBridge Scheduler",
              slug: "verification/eventbridge-scheduler",
            },
            { label: "Manual Ingest", slug: "verification/manual-ingest" },
            { label: "SQS Queues", slug: "verification/sqs-queues" },
            {
              label: "Processor Lambda",
              slug: "verification/processor-lambda",
            },
            {
              label: "S3 Processed Output",
              slug: "verification/s3-processed-output",
            },
            { label: "REST API", slug: "verification/rest-api" },
            {
              label: "Reprocess Workflow",
              slug: "verification/reprocess-workflow",
            },
            { label: "Portal", slug: "verification/portal" },
            {
              label: "Alarms and Dashboard",
              slug: "verification/alarms-dashboard",
            },
          ],
        },
        {
          label: "Data Contract",
          items: [
            {
              label: "SQS Message Schemas",
              slug: "data-contract/sqs-message-schemas",
            },
            {
              label: "DynamoDB Jobs Table",
              slug: "data-contract/dynamodb-jobs-table",
            },
            {
              label: "S3 Key Patterns",
              slug: "data-contract/s3-key-patterns",
            },
            { label: "Parquet Output", slug: "data-contract/parquet-output" },
            {
              label: "API Response Schemas",
              slug: "data-contract/api-response-schemas",
            },
          ],
        },
        {
          label: "Usage",
          items: [
            { label: "REST API Usage", slug: "usage/rest-api-usage" },
            { label: "Portal Usage", slug: "usage/portal-usage" },
            { label: "Manual Ingest", slug: "usage/manual-ingest" },
          ],
        },
        {
          label: "Development",
          items: [{ label: "Local Setup", slug: "development/local-setup" }],
        },
        {
          label: "Troubleshooting",
          items: [
            { label: "Common Issues", slug: "troubleshooting/common-issues" },
          ],
        },
        {
          label: "Reference",
          items: [
            {
              label: "Environment Variables",
              slug: "reference/environment-variables",
            },
            {
              label: "Terraform Variables",
              slug: "reference/terraform-variables",
            },
            { label: "Terraform Outputs", slug: "reference/terraform-outputs" },
            { label: "Teardown", slug: "reference/teardown" },
          ],
        },
      ],
    }),
  ],
});
