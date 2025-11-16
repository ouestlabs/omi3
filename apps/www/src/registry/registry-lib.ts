import type { Registry } from "shadcn/schema";

export const lib: Registry["items"] = [
  {
    name: "lib",
    type: "registry:lib",
    registryDependencies: ["@audio/store", "@audio/audio"],
  },
  {
    name: "audio",
    description: "Audio Lib",
    type: "registry:lib",
    dependencies: [],
    registryDependencies: [],
    files: [{ path: "lib/audio.ts", type: "registry:lib" }],
    categories: ["lib", "audio"],
  },
  {
    name: "store",
    description: "Audio store",
    type: "registry:lib",
    dependencies: ["zustand"],
    registryDependencies: ["@audio/audio"],
    files: [{ path: "lib/audio-store.ts", type: "registry:lib" }],
    categories: ["lib", "audio", "store"],
  },
];
