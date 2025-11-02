import type { Registry } from "shadcn/schema";

export const examples: Registry["items"] = [
  {
    name: "cover-demo",
    description: "Cover with image and fallback",
    type: "registry:example",
    registryDependencies: ["@audio/cover"],
    files: [
      {
        path: "examples/cover-demo.tsx",
        type: "registry:example",
      },
    ],
    categories: ["cover"],
  },
  {
    name: "cover-fallback",
    description: "Fallback-only cover",
    type: "registry:example",
    registryDependencies: ["@audio/cover"],
    files: [
      {
        path: "examples/cover-fallback.tsx",
        type: "registry:example",
      },
    ],
    categories: ["cover"],
  },
  {
    name: "cover-group",
    description: "Overlapping cover group",
    type: "registry:example",
    registryDependencies: ["@audio/cover"],
    files: [
      {
        path: "examples/cover-group.tsx",
        type: "registry:example",
      },
    ],
    categories: ["cover", "cover group"],
  },
  {
    name: "cover-radius",
    description: "Covers with different radii",
    type: "registry:example",
    registryDependencies: ["@audio/cover"],
    files: [
      {
        path: "examples/cover-radius.tsx",
        type: "registry:example",
      },
    ],
    categories: ["cover"],
  },
  {
    name: "cover-size",
    description: "Covers with different sizes",
    type: "registry:example",
    registryDependencies: ["@audio/cover"],
    files: [
      {
        path: "examples/cover-size.tsx",
        type: "registry:example",
      },
    ],
    categories: ["cover"],
  },

  {
    name: "meter-demo",
    description: "Basic meter",
    type: "registry:example",
    registryDependencies: ["@audio/meter"],
    files: [{ path: "examples/meter-demo.tsx", type: "registry:example" }],
    categories: ["meter"],
  },
  {
    name: "meter-simple",
    description: "Meter without label and value",
    type: "registry:example",
    registryDependencies: ["@audio/meter"],
    files: [{ path: "examples/meter-simple.tsx", type: "registry:example" }],
    categories: ["meter"],
  },
  {
    name: "meter-with-formatted-value",
    description: "Meter with a custom formatted value",
    type: "registry:example",
    registryDependencies: ["@audio/meter"],
    files: [
      {
        path: "examples/meter-with-formatted-value.tsx",
        type: "registry:example",
      },
    ],
    categories: ["meter"],
  },
  {
    name: "meter-with-range",
    description: "Meter with min and max values",
    type: "registry:example",
    registryDependencies: ["@audio/meter"],
    files: [
      { path: "examples/meter-with-range.tsx", type: "registry:example" },
    ],
    categories: ["meter"],
  },
  {
    name: "audio-player-demo",
    description: "Audio player demo",
    type: "registry:example",
    registryDependencies: ["@audio/player", "@audio/frame"],
    files: [
      { path: "examples/audio-player-demo.tsx", type: "registry:example" },
    ],
    categories: ["player"],
  },

  {
    name: "waveform-demo",
    description: "Waveform demo",
    type: "registry:example",
    registryDependencies: ["@audio/waveform"],
    files: [{ path: "examples/waveform-demo.tsx", type: "registry:example" }],
    categories: ["waveform"],
  },
];
