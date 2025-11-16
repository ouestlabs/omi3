import type { Registry } from "shadcn/schema";

import { examples } from "@/registry/registry-examples";
import { hooks } from "@/registry/registry-hooks";
import { lib } from "@/registry/registry-lib";
import { particles } from "@/registry/registry-particles";
import { ui } from "@/registry/registry-ui";
export const registry = {
  name: "shadcn/ui",
  homepage: "https://ui.shadcn.com",
  items: [...ui, ...examples, ...particles, ...hooks, ...lib],
} satisfies Registry;
