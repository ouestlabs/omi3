<div align="center">
  <img src="./logo.svg" alt="Logo Omi3"/>

  <p align="center">
    <img src="https://img.shields.io/github/actions/workflow/status/ouestlabs/omi3/test.yml?branch=main&label=test" alt="Test"/>
    <img src="https://img.shields.io/github/repo-size/ouestlabs/omi3" alt="Repo Size"/>
  </p>
</div>

---

`Omi3` is an open-source project focused on building audio processing and playback capabilities for web applications.

## Project Overview

`Omi3` aims to provide developers with a comprehensive set of tools and components for handling audio in web applications. From low-level audio processing to high-level UI components, Omi3 covers a wide range of audio-related functionalities.

### Key Features

- **Core Audio Engine (`@omi3/audio`)**: Robust audio playback management using the Web Audio API, featuring play/pause/seek/volume controls, an event-driven architecture (`addEventListener`), buffering status, error handling, and audio analysis capabilities (`AnalyserNode`).
- **Media Session API Integration**: Automatic integration with the browser's Media Session API for native media controls and metadata display.
- **UI Components (`@omi3/ui`)**: Reusable React components for building audio interfaces (details TBD).
- **Utility Functions (`@omi3/utils`)**: Shared helper functions, including audio time formatting.

## Project Structure

The project is organized as follows:

```
.
├── apps/ # Main applications
│   └── site/ # Main website and demo
├── packages/ # Shared packages
│   ├── audio/ # Core audio processing library & React integration
│   ├── ui/ # Reusable UI components registry, including audio player elements.
│   └── utils/ # Utility functions
└── tools/ # Development tools and configurations
    └── typescript/ # TypeScript configurations
```

### Packages

*   **`@omi3/audio`**: ([packages/audio/README.md](./packages/audio/README.md)) Core audio engine and React hooks/provider for state management.
*   **`@omi3/ui`**: Reusable UI components registry, including audio player elements.
*   **`@omi3/utils`**: Shared utility functions (e.g., time formatting).

## Getting Started

1. Ensure you have `Node.js (>=22)`, `pnpm`, and `make` installed.
2. Clone the repository.
3. Install dependencies:
   ```
   pnpm install
   ```
4. Start the development server:
   ```
   pnpm dev
   ```

## Development Workflow

We use `make` to simplify common development tasks like updating branches, cleaning up, and more.

For a full list of commands and detailed instructions, please refer to the [Development Workflow section in CONTRIBUTING.md](./CONTRIBUTING.md#development-workflow) or run `make help` in your terminal.

## Contributing

We welcome contributions from the community! Please read our [Contributing Guidelines](CONTRIBUTING.md) for more information on how to get involved.

## License

`Omi3` is open-source software licensed under the Apache License 2.0. See the [LICENSE](LICENSE) file for more details.

---

<a href="https://www.producthunt.com/posts/omi3?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-omi3" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=487676&theme=light" alt="Omi3 - Audio&#0032;processing&#0032;and&#0032;playback&#0032;capabilities&#0032;for&#0032;web&#0046; | Product Hunt" width="256" height="64" /></a>
