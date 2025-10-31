import type { Registry } from "shadcn/schema";

export const ui: Registry["items"] = [
  {
    name: "ui",
    type: "registry:ui",
    registryDependencies: [
      "@audio/accordion",
      "@audio/alert",
      "@audio/alert-dialog",
      "@audio/autocomplete",
      "@audio/cover",
      "@audio/badge",
      "@audio/breadcrumb",
      "@audio/button",
      "@audio/card",
      "@audio/checkbox",
      "@audio/checkbox-group",
      "@audio/collapsible",
      "@audio/combobox",
      "@audio/dialog",
      "@audio/empty",
      "@audio/field",
      "@audio/fieldset",
      "@audio/form",
      "@audio/frame",
      "@audio/group",
      "@audio/input",
      "@audio/label",
      "@audio/menu",
      "@audio/meter",
      "@audio/number-field",
      "@audio/pagination",
      "@audio/popover",
      "@audio/preview-card",
      "@audio/progress",
      "@audio/radio-group",
      "@audio/scroll-area",
      "@audio/select",
      "@audio/separator",
      "@audio/sheet",
      "@audio/skeleton",
      "@audio/slider",
      "@audio/switch",
      "@audio/table",
      "@audio/tabs",
      "@audio/textarea",
      "@audio/toast",
      "@audio/toggle",
      "@audio/toggle-group",
      "@audio/toolbar",
      "@audio/tooltip",
      "@audio/spinner",
    ],
  },
  {
    name: "accordion",
    type: "registry:ui",
    dependencies: ["@base-ui-components/react"],
    files: [
      {
        path: "ui/accordion.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "alert",
    type: "registry:ui",
    files: [
      {
        path: "ui/alert.tsx",
        type: "registry:ui",
      },
    ],
    cssVars: {
      light: {
        "destructive-foreground": "oklch(0.505 0.213 27.518)",
        info: "oklch(0.623 0.214 259.815)",
        "info-foreground": "oklch(0.488 0.243 264.376)",
        success: "oklch(0.696 0.17 162.48)",
        "success-foreground": "oklch(0.508 0.118 165.612)",
        warning: "oklch(0.769 0.188 70.08)",
        "warning-foreground": "oklch(0.555 0.163 48.998)",
      },
      dark: {
        "destructive-foreground": "oklch(0.704 0.191 22.216)",
        info: "oklch(0.623 0.214 259.815)",
        "info-foreground": "oklch(0.707 0.165 254.624)",
        success: "oklch(0.696 0.17 162.48)",
        "success-foreground": "oklch(0.765 0.177 163.223)",
        warning: "oklch(0.769 0.188 70.08)",
        "warning-foreground": "oklch(0.828 0.189 84.429)",
      },
    },
  },
  {
    name: "alert-dialog",
    type: "registry:ui",
    dependencies: ["@base-ui-components/react"],
    files: [
      {
        path: "ui/alert-dialog.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "autocomplete",
    type: "registry:ui",
    dependencies: ["@base-ui-components/react"],
    registryDependencies: ["@audio/input", "@audio/scroll-area"],
    files: [
      {
        path: "ui/autocomplete.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "cover",
    type: "registry:ui",
    dependencies: ["@base-ui-components/react"],
    files: [
      {
        path: "ui/cover.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "badge",
    type: "registry:ui",
    dependencies: ["@base-ui-components/react"],
    files: [
      {
        path: "ui/badge.tsx",
        type: "registry:ui",
      },
    ],
    cssVars: {
      light: {
        "destructive-foreground": "oklch(0.505 0.213 27.518)",
        info: "oklch(0.623 0.214 259.815)",
        "info-foreground": "oklch(0.488 0.243 264.376)",
        success: "oklch(0.696 0.17 162.48)",
        "success-foreground": "oklch(0.508 0.118 165.612)",
        warning: "oklch(0.769 0.188 70.08)",
        "warning-foreground": "oklch(0.555 0.163 48.998)",
      },
      dark: {
        "destructive-foreground": "oklch(0.704 0.191 22.216)",
        info: "oklch(0.623 0.214 259.815)",
        "info-foreground": "oklch(0.707 0.165 254.624)",
        success: "oklch(0.696 0.17 162.48)",
        "success-foreground": "oklch(0.765 0.177 163.223)",
        warning: "oklch(0.769 0.188 70.08)",
        "warning-foreground": "oklch(0.828 0.189 84.429)",
      },
    },
  },
  {
    name: "breadcrumb",
    type: "registry:ui",
    dependencies: ["@base-ui-components/react"],
    files: [
      {
        path: "ui/breadcrumb.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "button",
    type: "registry:ui",
    dependencies: ["@base-ui-components/react"],
    files: [
      {
        path: "ui/button.tsx",
        type: "registry:ui",
      },
    ],
    cssVars: {
      light: {
        "destructive-foreground": "oklch(0.505 0.213 27.518)",
      },
      dark: {
        "destructive-foreground": "oklch(0.704 0.191 22.216)",
      },
    },
  },
  {
    name: "card",
    type: "registry:ui",
    dependencies: [],
    files: [
      {
        path: "ui/card.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "checkbox",
    type: "registry:ui",
    dependencies: ["@base-ui-components/react"],
    files: [
      {
        path: "ui/checkbox.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "checkbox-group",
    type: "registry:ui",
    dependencies: ["@base-ui-components/react"],
    files: [
      {
        path: "ui/checkbox-group.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "collapsible",
    type: "registry:ui",
    dependencies: ["@base-ui-components/react"],
    files: [
      {
        path: "ui/collapsible.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "combobox",
    type: "registry:ui",
    dependencies: ["@base-ui-components/react"],
    registryDependencies: ["@audio/input", "@audio/scroll-area"],
    files: [
      {
        path: "ui/combobox.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "dialog",
    type: "registry:ui",
    dependencies: ["@base-ui-components/react"],
    files: [
      {
        path: "ui/dialog.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "empty",
    type: "registry:ui",
    files: [
      {
        path: "ui/empty.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "field",
    type: "registry:ui",
    dependencies: ["@base-ui-components/react"],
    files: [
      {
        path: "ui/field.tsx",
        type: "registry:ui",
      },
    ],
    cssVars: {
      light: {
        "destructive-foreground": "oklch(0.505 0.213 27.518)",
      },
      dark: {
        "destructive-foreground": "oklch(0.704 0.191 22.216)",
      },
    },
  },
  {
    name: "fieldset",
    type: "registry:ui",
    dependencies: ["@base-ui-components/react"],
    files: [
      {
        path: "ui/fieldset.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "form",
    type: "registry:ui",
    dependencies: ["@base-ui-components/react"],
    files: [
      {
        path: "ui/form.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "frame",
    type: "registry:ui",
    files: [
      {
        path: "ui/frame.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "group",
    type: "registry:ui",
    dependencies: ["@base-ui-components/react"],
    registryDependencies: ["@audio/separator"],
    files: [
      {
        path: "ui/group.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "input",
    type: "registry:ui",
    dependencies: ["@base-ui-components/react"],
    files: [
      {
        path: "ui/input.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "label",
    type: "registry:ui",
    dependencies: ["@base-ui-components/react"],
    files: [
      {
        path: "ui/label.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "menu",
    type: "registry:ui",
    dependencies: ["@base-ui-components/react"],
    files: [
      {
        path: "ui/menu.tsx",
        type: "registry:ui",
      },
    ],
    cssVars: {
      light: {
        "destructive-foreground": "oklch(0.505 0.213 27.518)",
      },
      dark: {
        "destructive-foreground": "oklch(0.704 0.191 22.216)",
      },
    },
  },
  {
    name: "meter",
    type: "registry:ui",
    dependencies: ["@base-ui-components/react"],
    files: [
      {
        path: "ui/meter.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "number-field",
    type: "registry:ui",
    dependencies: ["@base-ui-components/react"],
    files: [
      {
        path: "ui/number-field.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "pagination",
    type: "registry:ui",
    dependencies: ["@base-ui-components/react"],
    registryDependencies: ["@audio/button"],
    files: [
      {
        path: "ui/pagination.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "popover",
    type: "registry:ui",
    dependencies: ["@base-ui-components/react"],
    files: [
      {
        path: "ui/popover.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "preview-card",
    type: "registry:ui",
    dependencies: ["@base-ui-components/react"],
    files: [
      {
        path: "ui/preview-card.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "progress",
    type: "registry:ui",
    dependencies: ["@base-ui-components/react"],
    files: [
      {
        path: "ui/progress.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "radio-group",
    type: "registry:ui",
    dependencies: ["@base-ui-components/react"],
    files: [
      {
        path: "ui/radio-group.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "scroll-area",
    type: "registry:ui",
    dependencies: ["@base-ui-components/react"],
    files: [
      {
        path: "ui/scroll-area.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "select",
    type: "registry:ui",
    dependencies: ["@base-ui-components/react"],
    files: [
      {
        path: "ui/select.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "separator",
    type: "registry:ui",
    dependencies: ["@base-ui-components/react"],
    files: [
      {
        path: "ui/separator.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "sheet",
    type: "registry:ui",
    dependencies: ["@base-ui-components/react"],
    registryDependencies: ["@audio/dialog"],
    files: [
      {
        path: "ui/sheet.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "skeleton",
    type: "registry:ui",
    files: [
      {
        path: "ui/skeleton.tsx",
        type: "registry:ui",
      },
    ],
    cssVars: {
      theme: {
        "--animate-skeleton": "skeleton 2s -1s infinite linear",
      },
    },
    css: {
      "@keyframes skeleton": {
        to: {
          "background-position": "-200% 0",
        },
      },
    },
  },
  {
    name: "slider",
    type: "registry:ui",
    dependencies: ["@base-ui-components/react"],
    files: [
      {
        path: "ui/slider.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "switch",
    type: "registry:ui",
    dependencies: ["@base-ui-components/react"],
    files: [
      {
        path: "ui/switch.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "table",
    type: "registry:ui",
    dependencies: ["@base-ui-components/react"],
    files: [
      {
        path: "ui/table.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "tabs",
    type: "registry:ui",
    dependencies: ["@base-ui-components/react"],
    files: [
      {
        path: "ui/tabs.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "textarea",
    type: "registry:ui",
    dependencies: ["@base-ui-components/react"],
    files: [
      {
        path: "ui/textarea.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "toast",
    type: "registry:ui",
    dependencies: ["@base-ui-components/react"],
    registryDependencies: ["@audio/button"],
    files: [
      {
        path: "ui/toast.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "toggle",
    type: "registry:ui",
    dependencies: ["@base-ui-components/react"],
    files: [
      {
        path: "ui/toggle.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "toggle-group",
    type: "registry:ui",
    dependencies: ["@base-ui-components/react"],
    registryDependencies: ["@audio/separator", "@audio/toggle"],
    files: [
      {
        path: "ui/toggle-group.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "toolbar",
    type: "registry:ui",
    dependencies: ["@base-ui-components/react"],
    files: [
      {
        path: "ui/toolbar.tsx",
        type: "registry:ui",
      },
    ],
  },
  {
    name: "spinner",
    type: "registry:ui",
    dependencies: ["@base-ui-components/react"],
    files: [
      {
        path: "ui/spinner.tsx",
        type: "registry:ui",
      },
    ],
    cssVars: {
      theme: {
        "--animate-spinner-leaf-fade": "spinner-leaf-fade 1s infinite linear",
      },
    },
    css: {
      "@keyframes spinner-leaf-fade": {
        "0%, 100%": {
          opacity: 0,
        },
        "50%": {
          opacity: 1,
        },
      },
    },
  },
  {
    name: "tooltip",
    type: "registry:ui",
    dependencies: ["@base-ui-components/react"],
    files: [
      {
        path: "ui/tooltip.tsx",
        type: "registry:ui",
      },
    ],
  },
];
