import type { Registry } from "shadcn/schema";

export const lib: Registry["items"] = [
  {
    name: "lib",
    type: "registry:lib",
    registryDependencies: ["@audio/store", "@audio/audio"],
  },
  {
    name: "audio-lib",
    description: "Audio Lib",
    type: "registry:lib",
    dependencies: [],
    registryDependencies: [],
    files: [{ path: "lib/audio.ts", type: "registry:lib" }],
    categories: ["lib", "audio"],
  },
  {
    name: "audio-store",
    description: "Audio store",
    type: "registry:lib",
    dependencies: ["zustand"],
    registryDependencies: ["@audio/audio"],
    files: [{ path: "lib/audio-store.ts", type: "registry:lib" }],
    categories: ["lib", "audio", "store"],
  },
];
