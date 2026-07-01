import { writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const root = process.cwd();
const svgOut = join(root, "public/terraform-modules-diagram.svg");
const pngOut = join(root, "public/terraform-modules-diagram.png");

const width = 1080;
const height = 480;

const modules = [
  {
    id: "ingest",
    title: "ingest",
    lines: ["S3 data lake", "ingest-sync"],
    cx: 140,
  },
  {
    id: "ingest-scheduler",
    title: "ingest-scheduler",
    lines: ["EventBridge Scheduler", "invoke role"],
    cx: 320,
  },
  {
    id: "processing",
    title: "processing",
    lines: ["SQS / DLQ · S3 notify", "DynamoDB · processor Lambda"],
    cx: 540,
  },
  {
    id: "presentation",
    title: "presentation",
    lines: ["query / reprocess APIs", "API GW · Amplify"],
    cx: 760,
  },
  {
    id: "observability",
    title: "observability",
    lines: ["CloudWatch alarms", "SNS · dashboard"],
    cx: 940,
  },
];

const rootCx = width / 2;
const rootCy = 52;
const moduleCy = 188;
const boxW = 168;
const boxH = 72;

function box(cx, cy, w, h, title, lines) {
  const x = cx - w / 2;
  const y = cy - h / 2;
  const lineMarkup = lines
    .map(
      (line, i) =>
        `<text x="${cx}" y="${y + 44 + i * 14}" text-anchor="middle" fill="#b8afc8" font-family="sans-serif" font-size="11">${line}</text>`,
    )
    .join("\n");
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="#3d3254" stroke="#6d5f95" stroke-width="1"/>
  <text x="${cx}" y="${y + 26}" text-anchor="middle" fill="#f4f1f8" font-family="sans-serif" font-size="13" font-weight="600">${title}</text>
  ${lineMarkup}`;
}

function rootBox() {
  const w = 260;
  const h = 44;
  const x = rootCx - w / 2;
  const y = rootCy - h / 2;
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="#4a3d66" stroke="#8b7cb8" stroke-width="1.5"/>
  <text x="${rootCx}" y="${rootCy + 4}" text-anchor="middle" fill="#f4f1f8" font-family="sans-serif" font-size="14" font-weight="700">terraform/main.tf</text>
  <text x="${rootCx}" y="${rootCy + 19}" text-anchor="middle" fill="#b8afc8" font-family="sans-serif" font-size="11">root module</text>`;
}

function moduleTop(id) {
  const mod = modules.find((m) => m.id === id);
  return { x: mod.cx, y: moduleCy - boxH / 2 };
}

function moduleBottom(id) {
  const mod = modules.find((m) => m.id === id);
  return { x: mod.cx, y: moduleCy + boxH / 2 };
}

function moduleRight(id) {
  const mod = modules.find((m) => m.id === id);
  return { x: mod.cx + boxW / 2, y: moduleCy };
}

function moduleLeft(id) {
  const mod = modules.find((m) => m.id === id);
  return { x: mod.cx - boxW / 2, y: moduleCy };
}

function arrowHead(x, y, dir) {
  const s = 5;
  if (dir === "down") {
    return `<polygon points="${x - s},${y - s} ${x},${y} ${x + s},${y - s}" fill="#6d5f95"/>`;
  }
  if (dir === "up") {
    return `<polygon points="${x - s},${y + s} ${x},${y} ${x + s},${y + s}" fill="#6d5f95"/>`;
  }
  if (dir === "right") {
    return `<polygon points="${x - s},${y - s} ${x},${y} ${x - s},${y + s}" fill="#6d5f95"/>`;
  }
  return `<polygon points="${x + s},${y - s} ${x},${y} ${x + s},${y + s}" fill="#6d5f95"/>`;
}

function straightArrow(x1, y1, x2, y2, label, { dashed = false } = {}) {
  const dash = dashed ? ' stroke-dasharray="5 4"' : "";
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const endX = x2 - ux * 8;
  const endY = y2 - uy * 8;
  let dir = "right";
  if (Math.abs(uy) > Math.abs(ux)) {
    dir = uy > 0 ? "down" : "up";
  } else {
    dir = ux > 0 ? "right" : "left";
  }
  const labelX = (x1 + x2) / 2;
  const labelY = (y1 + y2) / 2 - 6;
  const labelMarkup = label
    ? `<text x="${labelX}" y="${labelY}" text-anchor="middle" fill="#9b92b0" font-family="sans-serif" font-size="10">${label}</text>`
    : "";
  return `<line x1="${x1}" y1="${y1}" x2="${endX}" y2="${endY}" stroke="#6d5f95" stroke-width="1.5"${dash}/>
  ${arrowHead(x2, y2, dir)}
  ${labelMarkup}`;
}

function elbowArrow(x1, y1, x2, y2, routeY, label, { dashed = false } = {}) {
  const dash = dashed ? ' stroke-dasharray="5 4"' : "";
  const labelX = (x1 + x2) / 2;
  const labelY = routeY - 6;
  const labelMarkup = label
    ? `<text x="${labelX}" y="${labelY}" text-anchor="middle" fill="#9b92b0" font-family="sans-serif" font-size="10">${label}</text>`
    : "";
  return `<polyline points="${x1},${y1} ${x1},${routeY} ${x2},${routeY} ${x2},${y2}" fill="none" stroke="#6d5f95" stroke-width="1.5"${dash}/>
  ${arrowHead(x2, y2, y2 > routeY ? "down" : "up")}
  ${labelMarkup}`;
}

const moduleBoxes = modules
  .map((m) => box(m.cx, moduleCy, boxW, boxH, m.title, m.lines))
  .join("\n");

const tfToModuleArrows = modules
  .map((m) => {
    const top = moduleTop(m.id);
    return straightArrow(rootCx, rootCy + 22, top.x, top.y - 2);
  })
  .join("\n");

const depArrows = [
  straightArrow(
    moduleRight("ingest").x,
    moduleRight("ingest").y,
    moduleLeft("ingest-scheduler").x,
    moduleLeft("ingest-scheduler").y,
    "ingest-sync arn/name",
  ),
  elbowArrow(
    moduleBottom("ingest").x,
    moduleBottom("ingest").y,
    moduleTop("processing").x,
    moduleTop("processing").y,
    268,
    "bucket",
  ),
  elbowArrow(
    moduleBottom("ingest").x,
    moduleBottom("ingest").y,
    moduleTop("presentation").x,
    moduleTop("presentation").y,
    292,
    "bucket read",
  ),
  elbowArrow(
    moduleBottom("processing").x,
    moduleBottom("processing").y,
    moduleTop("presentation").x,
    moduleTop("presentation").y,
    316,
    "reprocess queue · jobs table",
  ),
  elbowArrow(
    moduleBottom("ingest").x,
    moduleBottom("ingest").y,
    moduleTop("observability").x,
    moduleTop("observability").y,
    340,
    "lambda names",
  ),
  elbowArrow(
    moduleBottom("processing").x,
    moduleBottom("processing").y,
    moduleTop("observability").x,
    moduleTop("observability").y,
    364,
    "queue and lambda names",
  ),
  elbowArrow(
    moduleBottom("presentation").x,
    moduleBottom("presentation").y,
    moduleTop("observability").x,
    moduleTop("observability").y,
    388,
    "optional lambda names",
    { dashed: true },
  ),
].join("\n");

const legend = `<text x="40" y="448" fill="#9b92b0" font-family="sans-serif" font-size="12">Solid arrows — module outputs consumed downstream · dashed — optional when presentation is enabled</text>`;

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
      <stop stop-color="#2f2440"/>
      <stop offset="1" stop-color="#17111f"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" rx="12" fill="url(#bg)"/>
  <rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="11" stroke="#6d5f95" stroke-width="1" fill="none" opacity="0.45"/>
  ${rootBox()}
  ${tfToModuleArrows}
  ${moduleBoxes}
  ${depArrows}
  ${legend}
</svg>
`;

writeFileSync(svgOut, svg);
await sharp(Buffer.from(svg)).png().toFile(pngOut);

console.log(`Wrote ${svgOut}`);
console.log(`Wrote ${pngOut}`);
