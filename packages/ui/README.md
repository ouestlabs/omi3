# `@omi3/ui`

UI components for the Omi3 project, distributed via a Shadcn/ui registry.

## Philosophy

Following the principles of Shadcn/ui:

**This is not a traditional component library.**

Instead of installing a monolithic package, you add individual components directly to your project using a command-line interface. This approach provides several benefits:

*   **Open Code:** You get the actual component source code, allowing for full transparency and easy customization.
*   **Ownership:** The code lives within your project, giving you complete control over its behavior and styling.
*   **Composition:** Components are designed to be composable.
*   **Foundation:** Built upon Radix UI primitives and styled with Tailwind CSS, ensuring accessibility and a solid base for customization.

Learn more about the philosophy at [ui.shadcn.com](https://ui.shadcn.com/docs).

## Installation & Usage

To add components from the Omi3 UI registry to your project:

1.  **Ensure Shadcn/ui CLI is initialized:** If you haven't already, initialize Shadcn/ui in your target project (e.g., your Next.js app):
    ```bash
    npx shadcn@latest init
    ```
    Follow the prompts to configure paths according to your project structure.

2.  **Add Components from the Omi3 Registry:** Use your project's package manager script (assuming a script named `shadcn` is configured in your `package.json` that wraps the Shadcn CLI) to add components by specifying the Omi3 registry URL:

    ```bash
    # Example using pnpm (adapt if using npm/yarn/bun)
    pnpm shadcn add 'https://omi3.ouestlabs.com/registry/audio-player'
    ```
    *Replace `audio-player` with the specific component block you want to add.*

    This command will copy the component's source code, along with any necessary dependencies (like specific Radix primitives or utility functions) directly into your project, typically under the components path you configured during `init`.

## Available Components

### Audio Player Block (`audio-player`)

*   A complete audio player component including:
    *   File Input (`AudioFileInput`)
    *   Track Information Display (`AudioTrackInfo`)
    *   Seek Bar (`AudioSeekBar`)
    *   Playback Controls (`AudioControls`)
    *   Volume Control (`AudioVolume`)
    *   Audio Visualizer (`AudioVisualizer`)
*   Relies on `@omi3/audio` for core functionality and state management via React Context.

*(More components may be added to the registry over time.)*

## Dependencies

Components generally rely on:

*   React
*   Tailwind CSS
*   Radix UI Primitives (installed automatically when adding components)
*   `@omi3/audio` (for audio-related components)
*   `@omi3/utils` (for shared utilities)
*   `clsx`, `tailwind-merge`

## Customization

Since the component code is copied directly into your project (e.g., into `./components/ui/`), you can modify the source files freely to suit your specific needs. Adjust styles, change behavior, or extend functionality as required.

## Contributing

See the main project [CONTRIBUTING.md](../../CONTRIBUTING.md).

## License

MIT - see the main project [LICENSE](./LICENSE).
