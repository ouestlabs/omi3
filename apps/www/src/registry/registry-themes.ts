import type { Registry } from "shadcn/schema";

import { baseColorsV4 } from "@/registry/base-colors";

export const themes: Registry["items"] = Object.keys(baseColorsV4).map(
  (color) => ({
    name: `theme-${color}`,
    type: "registry:theme",
    cssVars: baseColorsV4[color as keyof typeof baseColorsV4],
  })
);
