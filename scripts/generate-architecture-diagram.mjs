import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const root = process.cwd();
const iconsDir = join(root, "public/diagram-icons");
const svgOut = join(root, "public/architecture-diagram.svg");
const pngOut = join(root, "public/architecture-diagram.png");
const ogSvgOut = join(root, "public/og-image.svg");
const ogPngOut = join(root, "public/og-image.png");

/** AWS Architecture Icons — https://github.com/jajera/aws-icons */
const AWS_ICONS_BASE =
  "https://raw.githubusercontent.com/jajera/aws-icons/main";

const layers = [
  {
    label: "Ingest",
    nodes: [
      {
        id: "geonet",
        label: "GeoNet",
        sublabel: "public RINEX",
        path: "icons/service/satellite/Arch_AWS-Ground-Station_64.svg",
        size: 56,
      },
      {
        id: "scheduler",
        label: "Scheduler",
        sublabel: "EventBridge",
        path: "icons/service/integration/Arch_Amazon-EventBridge_64.svg",
        size: 56,
      },
      {
        id: "ingest-lambda",
        label: "Ingest Sync",
        sublabel: "Lambda",
        path: "icons/service/compute/Arch_AWS-Lambda_64.svg",
        size: 56,
      },
      {
        id: "s3-lake",
        label: "Data Lake",
        sublabel: "raw/rinexhourly",
        path: "icons/service/storage/Arch_Amazon-Simple-Storage-Service_64.svg",
        size: 56,
      },
    ],
  },
  {
    label: "Processing",
    nodes: [
      {
        id: "sqs",
        label: "SQS",
        sublabel: "ingest + reprocess",
        path: "icons/service/integration/Arch_Amazon-Simple-Queue-Service_64.svg",
        size: 56,
      },
      {
        id: "processor-lambda",
        label: "Processor",
        sublabel: "Lambda container",
        path: "icons/service/compute/Arch_AWS-Lambda_64.svg",
        size: 56,
      },
      {
        id: "s3-processed",
        label: "Processed",
        sublabel: "tec/ parquet",
        path: "icons/service/storage/Arch_Amazon-Simple-Storage-Service_64.svg",
        size: 56,
      },
      {
        id: "dynamodb",
        label: "Jobs Table",
        sublabel: "DynamoDB",
        path: "icons/service/database/Arch_Amazon-DynamoDB_64.svg",
        size: 56,
      },
    ],
  },
  {
    label: "Presentation",
    nodes: [
      {
        id: "amplify",
        label: "Portal",
        sublabel: "Amplify SPA",
        path: "icons/service/frontend/Arch_AWS-Amplify_64.svg",
        size: 56,
      },
      {
        id: "api-gateway",
        label: "API Gateway",
        sublabel: "REST API",
        path: "icons/service/networking/Arch_Amazon-API-Gateway_64.svg",
        size: 56,
      },
      {
        id: "query-lambda",
        label: "Query API",
        sublabel: "Lambda",
        path: "icons/service/compute/Arch_AWS-Lambda_64.svg",
        size: 56,
      },
      {
        id: "reprocess-lambda",
        label: "Reprocess API",
        sublabel: "Lambda",
        path: "icons/service/compute/Arch_AWS-Lambda_64.svg",
        size: 56,
      },
    ],
  },
];

mkdirSync(iconsDir, { recursive: true });

function stripSvg(svgText) {
  return svgText
    .replace(/<\?xml[^?]*\?>/g, "")
    .replace(/<!DOCTYPE[^>]*>/g, "")
    .trim();
}

function extractInnerSvg(svgText) {
  const stripped = stripSvg(svgText);
  const match = stripped.match(/<svg[^>]*>([\s\S]*)<\/svg>/i);
  if (!match) {
    throw new Error("Invalid SVG content");
  }
  return match[1];
}

function getViewBox(svgText) {
  const stripped = stripSvg(svgText);
  const match = stripped.match(/viewBox="([^"]+)"/i);
  if (match) {
    return match[1];
  }
  const w = Number(stripped.match(/width="(\d+)/i)?.[1] ?? 64);
  const h = Number(stripped.match(/height="(\d+)/i)?.[1] ?? 64);
  return `0 0 ${w} ${h}`;
}

function parseViewBox(viewBox) {
  const [x, y, w, h] = viewBox.split(/\s+/).map(Number);
  return { x, y, w, h };
}

async function fetchIcon(node) {
  const url = node.url ?? `${AWS_ICONS_BASE}/${node.path}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  const svgText = await response.text();
  writeFileSync(join(iconsDir, `${node.id}.svg`), svgText);
  return {
    svgText,
    viewBox: getViewBox(svgText),
    inner: extractInnerSvg(svgText),
  };
}

function buildRowContent(iconData, layout) {
  const { width, iconY, labelY, sublabelY, startX = 0 } = layout;
  const slotWidth = width / iconData.length;

  const nodePositions = iconData.map((entry, index) => {
    const centerX = startX + slotWidth * index + slotWidth / 2;
    const viewBox = parseViewBox(entry.viewBox);
    const targetSize = entry.node.size;
    const scale = targetSize / Math.max(viewBox.w, viewBox.h);
    const renderedW = viewBox.w * scale;
    const renderedH = viewBox.h * scale;
    const labelOffsetX = entry.node.labelOffsetX ?? 0;
    return {
      ...entry,
      centerX,
      labelX: centerX + labelOffsetX,
      iconX: centerX - renderedW / 2 - viewBox.x * scale,
      iconY: iconY + (targetSize - renderedH) / 2 - viewBox.y * scale,
      iconBox: targetSize,
      renderedW,
      scale,
      viewBox,
    };
  });

  const arrows = [];
  for (let i = 0; i < nodePositions.length - 1; i += 1) {
    const left = nodePositions[i];
    const right = nodePositions[i + 1];
    const startXArrow = left.centerX + left.renderedW / 2 + 8;
    const endXArrow = right.centerX - right.renderedW / 2 - 8;
    const y = iconY + left.iconBox / 2;
    arrows.push(
      `<line x1="${startXArrow}" y1="${y}" x2="${endXArrow - 10}" y2="${y}" stroke="#6d5f95" stroke-width="2"/>`,
      `<polygon points="${endXArrow - 10},${y - 5} ${endXArrow},${y} ${endXArrow - 10},${y + 5}" fill="#6d5f95"/>`,
    );
  }

  const iconGroups = nodePositions
    .map((entry) => {
      const tint = entry.node.tint
        ? `<g fill="${entry.node.tint}">${entry.inner}</g>`
        : entry.inner;
      return `<g transform="translate(${entry.iconX} ${entry.iconY}) scale(${entry.scale})">${tint}</g>`;
    })
    .join("\n");

  const labels = nodePositions
    .map((entry) => {
      const sublabel = entry.node.sublabel
        ? `<text x="${entry.labelX}" y="${sublabelY}" text-anchor="middle" fill="#9b92b0" font-family="sans-serif" font-size="11">${entry.node.sublabel}</text>`
        : "";
      return `<text x="${entry.labelX}" y="${labelY}" text-anchor="middle" fill="#f4f1f8" font-family="sans-serif" font-size="13" font-weight="600">${entry.node.label}</text>${sublabel}`;
    })
    .join("\n");

  return `${arrows.join("\n")}\n${iconGroups}\n${labels}`;
}

function layerBand(y, height, label) {
  return `<rect x="16" y="${y}" width="108" height="${height}" rx="8" fill="#3d3254" stroke="#6d5f95" stroke-width="1"/>
  <text x="70" y="${y + height / 2 + 5}" text-anchor="middle" fill="#e8e0f4" font-family="sans-serif" font-size="13" font-weight="600">${label}</text>`;
}

function verticalConnector(x, y1, y2) {
  return `<line x1="${x}" y1="${y1}" x2="${x}" y2="${y2 - 8}" stroke="#6d5f95" stroke-width="2" stroke-dasharray="4 4"/>
  <polygon points="${x - 5},${y2 - 8} ${x},${y2} ${x + 5},${y2 - 8}" fill="#6d5f95"/>`;
}

function bgGradient(id) {
  return `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
      <stop stop-color="#2f2440"/>
      <stop offset="1" stop-color="#17111f"/>
    </linearGradient>`;
}

function framedRect(width, height, rx = 12) {
  return `<rect width="${width}" height="${height}" rx="${rx}" fill="url(#bg)"/>
  <rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="${rx - 1}" stroke="#6d5f95" stroke-width="1" fill="none" opacity="0.45"/>`;
}

function buildOgImage(flowContent, diagramWidth, diagramHeight) {
  const width = 1200;
  const height = 630;
  const diagramScale = 1104 / diagramWidth;
  const scaledDiagramH = diagramHeight * diagramScale;
  const diagramX = (width - diagramWidth * diagramScale) / 2;
  const diagramY = 248;

  const pills = ["Ingest", "Processing", "Portal"];
  let pillX = width / 2 - (pills.length * 100 + 24) / 2;
  const pillY = 168;
  const pillMarkup = pills
    .map((label) => {
      const w = label.length * 11 + 36;
      const markup = `<rect x="${pillX}" y="${pillY}" width="${w}" height="32" rx="16" fill="#3d3254" stroke="#6d5f95" stroke-width="1"/>
  <text x="${pillX + w / 2}" y="${pillY + 21}" text-anchor="middle" fill="#e8e0f4" font-family="sans-serif" font-size="14" font-weight="600">${label}</text>`;
      pillX += w + 12;
      return markup;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none">
  <defs>
    ${bgGradient("bg")}
  </defs>
  ${framedRect(width, height)}
  <text x="${width / 2}" y="72" text-anchor="middle" fill="#f4f1f8" font-family="sans-serif" font-size="48" font-weight="700">Event-Driven Serverless Walkthrough</text>
  <text x="${width / 2}" y="118" text-anchor="middle" fill="#b8afc8" font-family="sans-serif" font-size="22">GeoNet RINEX → TEC processing → Amplify portal</text>
  ${pillMarkup}
  <rect x="48" y="${diagramY - 16}" width="${width - 96}" height="${scaledDiagramH + 32}" rx="12" fill="#231a30" stroke="#6d5f95" stroke-width="1" opacity="0.6"/>
  <g transform="translate(${diagramX} ${diagramY}) scale(${diagramScale})">
    ${flowContent}
  </g>
  <text x="${width / 2}" y="${diagramY + scaledDiagramH + 72}" text-anchor="middle" fill="#9b92b0" font-family="sans-serif" font-size="20">GNSS ingest · PyTECGg calibration · REST API &amp; visualization</text>
  <text x="${width / 2}" y="${diagramY + scaledDiagramH + 108}" text-anchor="middle" fill="#6d5f95" font-family="sans-serif" font-size="18">jajera.github.io/aws-event-driven-serverless-walkthrough</text>
</svg>
`;
}

const iconCache = new Map();
async function getIconData(node) {
  if (!iconCache.has(node.id)) {
    iconCache.set(node.id, { node, ...(await fetchIcon(node)) });
  }
  return iconCache.get(node.id);
}

const diagramWidth = 1280;
const rowHeight = 150;
const rowStartX = 140;
const rowWidth = diagramWidth - rowStartX - 24;
const rowLayouts = [
  { iconY: 36, labelY: 108, sublabelY: 124 },
  {
    iconY: 36 + rowHeight,
    labelY: 108 + rowHeight,
    sublabelY: 124 + rowHeight,
  },
  {
    iconY: 36 + rowHeight * 2,
    labelY: 108 + rowHeight * 2,
    sublabelY: 124 + rowHeight * 2,
  },
];

const rowContents = [];
for (let i = 0; i < layers.length; i += 1) {
  const layer = layers[i];
  const iconData = [];
  for (const node of layer.nodes) {
    iconData.push(await getIconData(node));
  }
  rowContents.push(
    buildRowContent(iconData, {
      width: rowWidth,
      startX: rowStartX,
      ...rowLayouts[i],
    }),
  );
}

const layerBands = layers
  .map((layer, i) => layerBand(28 + i * rowHeight, rowHeight - 16, layer.label))
  .join("\n");

const connectors = [
  verticalConnector(rowStartX + rowWidth * 0.75, 128, 158),
  verticalConnector(
    rowStartX + rowWidth * 0.5,
    128 + rowHeight,
    158 + rowHeight,
  ),
];

const diagramHeight = rowHeight * 3 + 40;
const flowContent = `${layerBands}\n${rowContents.join("\n")}\n${connectors.join("\n")}`;

const architectureSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${diagramWidth}" height="${diagramHeight}" viewBox="0 0 ${diagramWidth} ${diagramHeight}" fill="none">
  <defs>
    ${bgGradient("bg")}
  </defs>
  ${framedRect(diagramWidth, diagramHeight)}
  ${flowContent}
</svg>
`;

const ogSvg = buildOgImage(flowContent, diagramWidth, diagramHeight);

writeFileSync(svgOut, architectureSvg);
writeFileSync(ogSvgOut, ogSvg);
await sharp(Buffer.from(architectureSvg)).png().toFile(pngOut);
await sharp(Buffer.from(ogSvg)).png().toFile(ogPngOut);

console.log(`Wrote ${svgOut}`);
console.log(`Wrote ${pngOut}`);
console.log(`Wrote ${ogSvgOut}`);
console.log(`Wrote ${ogPngOut}`);
