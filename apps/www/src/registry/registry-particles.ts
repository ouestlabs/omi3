import type { Registry } from "shadcn/schema";

export const particles: Registry["items"] = [
  {
    name: "particle-player",
    description: "Audio player",
    type: "registry:block",
    registryDependencies: [
      "@audio/player",
      "@audio/queue",
      "@audio/store",
      "@audio/audio",
    ],
    files: [{ path: "particles/particle-player.tsx", type: "registry:block" }],
    categories: ["player", "queue"],
  },
  {
    name: "particle-player-widget",
    description: "Audio player widget",
    type: "registry:block",
    registryDependencies: [
      "@audio/player",
      "@audio/track",
      "@audio/store",
      "@audio/audio",
    ],
    files: [
      { path: "particles/particle-player-widget.tsx", type: "registry:block" },
    ],
    categories: ["player", "widget"],
  },
];
