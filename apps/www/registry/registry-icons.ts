import type { Registry } from "shadcn/schema";

export const particles: Registry["items"] = [
  {
    name: "audio-file-input",
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
    name: "audio-controls",
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
    name: "audio-seek-bar",
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
    name: "audio-track-info",
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
    name: "audio-visualizer",
    description: "Audio visualizer",
    type: "registry:block",
    dependencies: ["audio-engine", "@audio-ui/utils"],
    files: [
      { path: "particles/particle-visualizer.tsx", type: "registry:block" },
    ],
    categories: ["visualizer"],
  },
  {
    name: "audio-volume",
    description: "Audio volume",
    type: "registry:block",
    dependencies: ["audio-engine", "@audio-ui/utils"],
    files: [{ path: "particles/particle-volume.tsx", type: "registry:block" }],
    categories: ["volume"],
  },
  {
    name: "audio-player",
    description: "Audio player",
    type: "registry:block",
    dependencies: ["audio-engine", "@audio-ui/utils"],
    files: [{ path: "particles/particle-player.tsx", type: "registry:block" }],
    categories: ["player"],
  },
];
