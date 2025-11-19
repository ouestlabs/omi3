import type { Registry } from "shadcn/schema";

import { examples } from "@/registry/registry-examples";
import { hooks } from "@/registry/registry-hooks";
import { lib } from "@/registry/registry-lib";
import { particles } from "@/registry/registry-particles";
import { ui } from "@/registry/registry-ui";
import { components } from "./registry-components";
import { themes } from "./registry-themes";
export const registry = {
  name: "shadcn/ui",
  homepage: "https://ui.shadcn.com",
  items: [
    ...components,
    ...ui,
    ...examples,
    ...themes,
    ...particles,
    ...hooks,
    ...lib,
  ],
} satisfies Registry;
