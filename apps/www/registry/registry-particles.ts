import type { Registry } from "shadcn/schema";

export const particles: Registry["items"] = [
  {
    name: "file-input",
    description: "Audio file input",
    type: "registry:block",
    registryDependencies: ["@audio/input", "@audio/label"],
    dependencies: [],
    files: [
      { path: "particles/particle-file-input.tsx", type: "registry:block" },
    ],
    categories: ["file"],
  },
  {
    name: "controls",
    description: "Audio controls",
    type: "registry:block",
    registryDependencies: [
      "@audio/button",
      "@audio/tooltip",
      "@audio/spinner",
      "audio-engine",
      "lucide-react",
    ],
    dependencies: ["lucide-react", "audio-engine"],
    files: [
      { path: "particles/particle-controls.tsx", type: "registry:block" },
    ],
    categories: ["controls"],
  },
  {
    name: "seek-bar",
    description: "Audio seek bar",
    type: "registry:block",
    registryDependencies: ["@audio/slider"],
    dependencies: ["audio-engine", "@audio-ui/utils"],
    files: [
      { path: "particles/particle-seek-bar.tsx", type: "registry:block" },
    ],
    categories: ["seek-bar"],
  },
  {
    name: "track-info",
    description: "Audio track info",
    type: "registry:block",
    registryDependencies: ["@audio/cover", "@audio/skeleton"],
    dependencies: ["audio-engine", "lucide-react"],
    files: [
      { path: "particles/particle-track-info.tsx", type: "registry:block" },
    ],
    categories: ["track-info"],
  },
  {
    name: "volume",
    description: "Audio volume",
    type: "registry:block",
    dependencies: ["audio-engine", "@audio-ui/utils"],
    files: [{ path: "particles/particle-volume.tsx", type: "registry:block" }],
    categories: ["volume"],
  },
  {
    name: "player",
    description: "Audio player",
    type: "registry:block",
    registryDependencies: ["@audio/player"],
    dependencies: ["audio-engine", "@audio-ui/utils"],
    files: [{ path: "particles/particle-player.tsx", type: "registry:block" }],
    categories: ["player"],
  },
];
