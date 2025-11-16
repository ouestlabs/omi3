import type { Registry } from "shadcn/schema";

export const ui: Registry["items"] = [
  {
    name: "ui",
    type: "registry:ui",
    registryDependencies: ["@audio/player"],
  },
  {
    name: "slider",
    type: "registry:ui",
    dependencies: ["radix-ui"],
    registryDependencies: [],
    files: [
      {
        path: "ui/slider.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "empty",
    type: "registry:ui",
    dependencies: ["class-variance-authority", "clsx", "tailwind-merge"],
    registryDependencies: [],
    files: [
      {
        path: "ui/empty.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "sortable-list",
    type: "registry:ui",
    dependencies: [
      "@dnd-kit/core",
      "@dnd-kit/sortable",
      "@dnd-kit/utilities",
      "lucide-react",
    ],
    registryDependencies: ["@shadcn/button"],
    files: [
      {
        path: "ui/sortable-list.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "player",
    type: "registry:ui",
    dependencies: ["zustand", "lucide-react"],
    registryDependencies: [
      "@audio/store",
      "@audio/audio",
      "@audio/slider",
      "@audio/empty",
      "@shadcn/button",
      "@shadcn/dialog",
      "@shadcn/dropdown-menu",
      "@shadcn/input",
      "@shadcn/item",
      "@shadcn/scroll-area",
      "@shadcn/toggle",
      "@shadcn/tooltip",
    ],
    files: [
      {
        path: "ui/audio/player.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "track",
    type: "registry:ui",
    dependencies: ["lucide-react"],
    registryDependencies: [
      "@audio/empty",
      "@audio/sortable-list",
      "@shadcn/avatar",
      "@shadcn/button",
      "@shadcn/item",
      "@shadcn/scroll-area",
    ],
    files: [
      {
        path: "ui/audio/track.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "queue",
    type: "registry:ui",
    dependencies: ["zustand", "lucide-react"],
    registryDependencies: [
      "@audio/store",
      "@audio/track",
      "@audio/empty",
      "@shadcn/button",
      "@shadcn/command",
      "@shadcn/dialog",
      "@shadcn/dropdown-menu",
      "@shadcn/input",
      "@shadcn/item",
      "@shadcn/scroll-area",
      "@shadcn/toggle",
      "@shadcn/tooltip",
    ],
    files: [
      {
        path: "ui/audio/queue.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "provider",
    type: "registry:ui",
    dependencies: ["zustand"],
    registryDependencies: [
      "@audio/store",
      "@audio/audio",
    ],
    files: [
      {
        path: "ui/audio/provider.tsx",
        type: "registry:ui",
      },
    ],
  },
];
