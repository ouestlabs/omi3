import type { Registry } from "shadcn/schema";

export const ui: Registry["items"] = [
  {
    name: "ui",
    type: "registry:ui",
    registryDependencies: [
      "@audio/cover",
      "@audio/meter",
      "@audio/waveform",
      "@audio/player",
    ],
  },

  {
    name: "cover",
    type: "registry:ui",
    dependencies: ["@base-ui-components/react"],
    files: [
      {
        path: "ui/cover.tsx",
        type: "registry:ui",
      },
    ],
  },

  {
    name: "meter",
    type: "registry:ui",
    dependencies: ["@base-ui-components/react"],
    files: [
      {
        path: "ui/meter.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "skeleton",
    type: "registry:ui",
    files: [
      {
        path: "ui/skeleton.tsx",
        type: "registry:ui",
      },
    ],
    cssVars: {
      theme: {
        "--animate-skeleton": "skeleton 2s -1s infinite linear",
      },
    },
    css: {
      "@keyframes skeleton": {
        to: {
          "background-position": "-200% 0",
        },
      },
    },
  },
  {
    name: "waveform",
    type: "registry:ui",
    dependencies: ["@base-ui-components/react"],
    files: [
      {
        path: "ui/waveform.tsx",
        type: "registry:ui",
      },
    ],
  },
];
