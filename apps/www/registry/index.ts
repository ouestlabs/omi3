import type { Registry } from "shadcn/schema";

import { examples } from "@/registry/registry-examples";
import { particles } from "@/registry/registry-particles";
import { styles } from "@/registry/registry-styles";
import { ui } from "@/registry/registry-ui";

export const registry = {
  name: "shadcn/ui",
  homepage: "https://ui.shadcn.com",
  items: [...ui, ...examples, ...particles, ...styles],
} satisfies Registry;
