# Contributing to audio ui

Thank you for your interest in contributing to audio ui! This guide will help you understand how to contribute components, examples, and particles to our design system.

## Overview

**audio ui** consists of two main types of components:

1. **UI Components** - Core reusable components (`Button`, `Input`, etc.)
2. **Examples** - Demonstrations of how to use UI components
3. **Particles** - Composite components that combine multiple UI components

## Adding New Examples

Examples are component demonstrations that showcase how to use our UI components. They appear in the documentation and on the particles page.

### Step 1: Create the Example Component

1. Create a new file in `registry/default/examples/` with a meaningful name:
   ```bash
   # Example: button-with-icon.tsx
   touch registry/default/examples/button-with-icon.tsx
   ```

2. Name your component descriptively:
   ```tsx
   // registry/default/examples/button-with-icon.tsx
   import { Button } from "@/registry/default/ui/button"
   import { Input } from "@/registry/default/ui/input"
   
   export default function ButtonWithIcon() {
     return (
       <Button>
        <DownloadIcon />
        Download
      </Button>
     )
   }
   ```

### Step 2: Add to Registry Examples

Add your example to `registry/registry-examples.ts`:

```tsx
// registry/registry-examples.ts
import ButtonWithIcon from "@/registry/default/examples/button-with-icon"

export const examples = [
  // ... existing examples
  {
    name: "button-with-icon",
    type: "components:example",
    registryDependencies: ["@audio/button"],
    dependencies: ["lucide-react"],
    files: ["registry/default/examples/button-with-icon.tsx"],
    description: "A basic download button with icon",
    dependencies: ["react", "@radix-ui/react-slot"],
    categories: ["button", "download"],
  },
]
```

**Important fields:**
- `name`: Unique identifier (kebab-case)
- `description`: Concise but descriptive (displays on particles page)
- `registryDependencies`: Array of UI components used
- `dependencies`: External dependencies (React, Radix, etc.)
- `categories`: Main categories (e.g., `["button", "download"]` for composite components)

### Step 3: Add to Particles Index

Import and add your example to `registry/default/particles/index.tsx`:

```tsx
// registry/default/particles/index.tsx
import ButtonWithIcon from "@/registry/default/examples/button-with-icon"

export const particles: ParticleItem[] = [
  // ... existing particles
  {
    id: "button-with-icon",
    component: ButtonWithIcon,
    categories: ["button", "download"],
  },
]
```

**Important notes:**
- Import components **alphabetically**
- Order items **logically** (they display in this order on particles page)
- Use `categories` for filtering by component type
- You might need to set an appropriate `className` for responsive sizing and layout

**className Property:**
The `className` property adds CSS classes to the particle display wrapper. This is useful for:
- Responsive sizing: `"**:data-[slot=particle-wrapper]:w-full **:data-[slot=particle-wrapper]:max-w-64"`
- Full width components: `"**:data-[slot=particle-wrapper]:w-full"`
- Custom layouts and spacing

### Step 4: Add to Documentation (Optional)

If you want to showcase the example in documentation:

1. Find the relevant MDX file in `content/ui/docs/components/`
2. Add your example with `<ComponentSource />`:

```mdx
<ComponentSource name="button-with-icon" />
```

## Adding New Particles

Particles are composite components that combine multiple UI components. They follow a specific naming convention.

### Naming Convention

Particles use the format: `comp-{categories_shortcode}-{N}.tsx`

**Category Shortcodes:**
- `bu` = button
- `in` = input  
- `to` = toggle
- `tg` = toggle group
- `tt` = tooltip
- `ta` = table
- `tb` = tabs
- `te` = textarea
- `ts` = toast
- `pa` = pagination
- `fr` = frame
- ...more

**Examples:**
- `comp-bu-1.tsx` (first button particle)
- `comp-in-2.tsx` (second input particle)
- `comp-pa-1.tsx` (first pagination particle)

### Step 1: Create the Particle

```bash
# Example: comp-bu-8.tsx (8th button particle)
touch registry/default/particles/comp-bu-8.tsx
```

```tsx
// registry/default/particles/comp-bu-8.tsx
import { Button } from "@/registry/default/ui/button"

export default function CompBu8() {
  return (
    <div className="flex gap-2">
      <Button variant="outline">Cancel</Button>
      <Button>Save Changes</Button>
    </div>
  )
}
```

### Step 2: Add to Particles Index

```tsx
// registry/default/particles/index.tsx
import CompBu8 from "@/registry/default/particles/particle-bu-8"

export const particles: ParticleItem[] = [
  // ... existing particles
  {
    id: "particle-bu-8",
    component: ParticleBu8,
    category: ["button"],
  },
]
```

### Step 3: Add to Registry Particles

```tsx
// registry/registry-particles.ts
import Particle from "@/registry/default/particles/particle-bu-8"

export const particles = [
  // ... existing particles
  {
    name: "particle-bu-8",
    type: "particleonents:particle",
    registryDependencies: ["@/registry/default/ui/button"],
    files: ["registry/default/particles/comp-bu-8.tsx"],
    description: "A button group with cancel and save actions.",
    dependencies: ["react", "@radix-ui/react-slot"],
    category: "button",
  },
]
```

## Final Steps

After adding your component, run these scripts in sequence:

```bash
# Format code and sort imports
bun run lint:fix

# Build registry JSON files
bun run registry:build

# Propagate UI changes to packages (only needed for UI components, not particles)
bun run ui:propagate
```

## Guidelines

### Code Style
- Use TypeScript
- Follow existing naming conventions
- Use meaningful, descriptive names
- Keep components focused and single-purpose

### Categories
- Use categories that correspond to actual components
- For composite components, include all relevant categories
- Categories are used for filtering on the particles page

### Descriptions
- Keep descriptions concise but informative
- Focus on what the component does, not how it's implemented
- Descriptions appear on the particles page

### Dependencies
- Be accurate with `dependencies` and `registryDependencies` - these are used for installation

## Getting Help

- Check existing examples for patterns and conventions
- Look at similar components for reference
- Ask questions in our community channels

Thank you for contributing to audio ui! 🎉