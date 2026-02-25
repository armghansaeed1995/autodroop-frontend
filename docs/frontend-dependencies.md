# Frontend Dependencies

This document lists the key NPM packages used in the frontend of the application, along with a brief description of their purpose.

## Core Frameworks & Libraries

*   **`vue`** (`^3.5.22`):
    *   **Purpose**: The progressive JavaScript framework used for building user interfaces.
    *   **Usage**: The foundation of all UI components, reactivity system, and templating.

*   **`quasar`** (`^2.16.0`):
    *   **Purpose**: A high-performance Vue.js framework that allows you to quickly create responsive websites, PWAs, SPAs, SSR, Mobile Apps, and Electron Apps.
    *   **Usage**: Provides a comprehensive suite of UI components, directives, plugins, and CLI tools for rapid development and consistent styling.

*   **`vue-router`** (`^5.0.0`):
    *   **Purpose**: The official routing library for Vue.js. It integrates deeply with Vue.js to make building single-page applications a breeze.
    *   **Usage**: Manages client-side navigation between different views/pages of the application, including dynamic routing and navigation guards.

## HTTP Client

*   **`axios`** (`^1.13.5`):
    *   **Purpose**: A promise-based HTTP client for the browser and Node.js. It makes sending asynchronous HTTP requests to REST endpoints easy.
    *   **Usage**: Used for all API calls from the frontend to the backend, handling request and response data.

## Internationalization (i18n)

*   **`vue-i18n`** (`^9.x.x`, specifically compatible with Vue 3):
    *   **Purpose**: A highly flexible and performant internationalization plugin for Vue.js.
    *   **Usage**: Provides capabilities for translating text, numbers, and dates into multiple languages within the application.

## Development Dependencies

*   **`@quasar/app-vite`** (`^2.1.0`):
    *   **Purpose**: The Quasar CLI plugin for Vite, providing the build and development environment for Quasar applications.
    *   **Usage**: Handles project setup, development server, build processes, and integration with Vite for fast compilation.

*   **`eslint`** (`^9.14.0`), **`eslint-plugin-vue`** (`^10.4.0`), **`@vue/eslint-config-prettier`** (`^10.1.0`), etc.:
    *   **Purpose**: Linting tools to enforce code quality, style guidelines, and catch potential errors in JavaScript and Vue files.
    *   **Usage**: Integrated into the development workflow to maintain consistent code style and prevent common coding mistakes.

*   **`prettier`** (`^3.3.3`):
    *   **Purpose**: An opinionated code formatter that enforces a consistent style across your codebase.
    *   **Usage**: Used for automatically formatting code, ensuring readability and adherence to predefined style rules.

*   **`vite-plugin-checker`** (`^0.11.0`):
    *   **Purpose**: A Vite plugin that runs Linters (like ESLint) and TypeScript checkers in a separate process during development.
    *   **Usage**: Provides real-time feedback on code quality and type errors without blocking the main development server.

*   **`autoprefixer`** (`^10.4.2`), **`postcss`** (`^8.4.14`):
    *   **Purpose**: Tools for processing CSS. Autoprefixer parses CSS and adds vendor prefixes to CSS rules. PostCSS is a tool for transforming CSS with JavaScript plugins.
    *   **Usage**: Used in the build pipeline to ensure CSS compatibility across different browsers and to apply other CSS transformations.
