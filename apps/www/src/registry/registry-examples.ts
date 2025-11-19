import type { Registry } from "shadcn/schema";

export const examples: Registry["items"] = [
  {
    name: "player-demo",
    description: "Audio player demo",
    type: "registry:example",
    registryDependencies: ["@audio/player"],
    files: [{ path: "examples/player-demo.tsx", type: "registry:example" }],
    categories: ["player"],
  },

  {
    name: "player-queue-demo",
    description: "Audio player with queue demo",
    type: "registry:example",
    registryDependencies: ["@audio/player", "@audio/queue"],
    files: [
      {
        path: "examples/player-queue-demo.tsx",
        type: "registry:example",
      },
    ],
    categories: ["player", "queue"],
  },
  {
    name: "player-stacked-demo",
    description: "Audio player with stacked layout",
    type: "registry:example",
    registryDependencies: ["@audio/player"],
    files: [
      {
        path: "examples/player-stacked-demo.tsx",
        type: "registry:example",
      },
    ],
    categories: ["player"],
  },
  {
    name: "queue-shuffle-repeat-demo",
    description: "Minimal queue with shuffle and repeat controls",
    type: "registry:example",
    registryDependencies: ["@audio/player", "@audio/queue"],
    files: [
      {
        path: "examples/queue-shuffle-repeat-demo.tsx",
        type: "registry:example",
      },
    ],
    categories: ["queue"],
  },
  {
    name: "queue-preferences-demo",
    description: "Minimal queue with preferences dropdown",
    type: "registry:example",
    registryDependencies: ["@audio/player", "@audio/queue"],
    files: [
      {
        path: "examples/queue-preferences-demo.tsx",
        type: "registry:example",
      },
    ],
    categories: ["queue"],
  },
  {
    name: "queue-all-controls-demo",
    description: "Queue with all controls (shuffle, repeat, preferences)",
    type: "registry:example",
    registryDependencies: ["@audio/player", "@audio/queue"],
    files: [
      {
        path: "examples/queue-all-controls-demo.tsx",
        type: "registry:example",
      },
    ],
    categories: ["queue"],
  },
  {
    name: "track-demo",
    description: "Minimal track component example",
    type: "registry:example",
    registryDependencies: ["@audio/player", "@audio/track"],
    files: [
      {
        path: "examples/track-demo.tsx",
        type: "registry:example",
      },
    ],
    categories: ["track"],
  },
  {
    name: "track-list-demo",
    description: "Track list with selection example",
    type: "registry:example",
    registryDependencies: ["@audio/player", "@audio/track"],
    files: [
      {
        path: "examples/track-list-demo.tsx",
        type: "registry:example",
      },
    ],
    categories: ["track"],
  },
  {
    name: "track-list-grid-demo",
    description: "Track list with grid layout example",
    type: "registry:example",
    registryDependencies: ["@audio/player", "@audio/track"],
    files: [
      {
        path: "examples/track-list-grid-demo.tsx",
        type: "registry:example",
      },
    ],
    categories: ["track", "grid"],
  },
  {
    name: "track-sortable-list-demo",
    description: "Track list with sortable selection example",
    type: "registry:example",
    registryDependencies: ["@audio/player", "@audio/track"],
    files: [
      {
        path: "examples/track-sortable-list-demo.tsx",
        type: "registry:example",
      },
    ],
    categories: ["track", "sortable"],
  },
  {
    name: "track-sortable-list-grid-demo",
    description: "Track list with sortable selection and grid layout example",
    type: "registry:example",
    registryDependencies: ["@audio/player", "@audio/track"],
    files: [
      {
        path: "examples/track-sortable-list-grid-demo.tsx",
        type: "registry:example",
      },
    ],
    categories: ["track", "sortable", "grid"],
  },
];
