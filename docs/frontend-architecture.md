# Frontend Architecture

## Overview
The frontend is built using the Quasar Framework (Vue 3), providing a responsive and performant Single Page Application (SPA). It interacts with the backend API for data persistence and authentication, and leverages Vue Router for navigation.

## Key Technologies
*   **Vue.js 3**: Progressive JavaScript framework for building user interfaces.
*   **Quasar Framework**: High-performance Vue.js framework that allows you to quickly create responsive websites, PWAs, SPAs, SSR, Mobile Apps, and Electron Apps.
*   **Vue Router**: Official routing library for Vue.js.
*   **Axios**: Promise-based HTTP client for the browser and Node.js.
*   **vue-i18n**: Internationalization plugin for Vue.js.
*   **localStorage**: Used for client-side storage of authentication tokens and user information.

## Application Structure

```
frontend/
├── src/
│   ├── App.vue             # Main application component.
│   ├── assets/             # Static assets like images and fonts.
│   ├── boot/               # Quasar boot files for app initialization (e.g., Axios, i18n).
│   │   ├── axios.js
│   │   └── i18n.js
│   ├── components/         # Reusable UI components.
│   │   └── base/           # Base components (e.g., BaseButton, BaseCard).
│   ├── css/                # Global CSS and Quasar SASS variables overrides.
│   │   ├── app.scss
│   │   └── quasar.variables.scss
│   ├── i18n/               # Internationalization message files.
│   │   ├── en-US/
│   │   └── es/
│   ├── layouts/            # Vue layouts for shared structure across multiple pages.
│   │   └── MainLayout.vue  # Main application layout with navigation.
│   ├── pages/              # Vue components representing different application views.
│   │   ├── admin/
│   │   │   └── CustomerManagement.vue # Admin-specific page.
│   │   ├── customer/
│   │   │   └── Dashboard.vue          # Customer-specific dashboard.
│   │   ├── DashboardPage.vue          # General Dashboard.
│   │   ├── DesignShowcase.vue         # For showcasing design system components.
│   │   ├── ErrorNotFound.vue          # 404 page.
│   │   ├── IndexPage.vue              # Default landing page.
│   │   ├── LoginPage.vue              # User login page.
│   │   ├── RegisterPage.vue           # User registration page.
│   │   ├── SettingsPage.vue           # Application settings.
│   │   └── TablesPage.vue             # Example page with data tables.
│   ├── router/             # Vue Router configuration.
│   │   ├── index.js        # Vue Router instantiation and global guards.
│   │   └── routes.js       # Route definitions.
│   └── services/           # Frontend services (e.g., API calls, utility functions).
│       └── websocket.js
├── quasar.config.js        # Quasar CLI configuration.
├── package.json            # Project dependencies and scripts.
└── docs/
    └── design-system.md    # Design system guidelines.
```

## Routing and Navigation
*   **Vue Router**: Manages client-side routing.
*   **`routes.js`**: Defines all application routes, including their components and `meta` fields for authentication and role requirements.
    *   `requiresAuth`: Boolean, indicates if a route requires authentication.
    *   `roles`: Array of strings, specifies which user roles are permitted to access the route (e.g., `['sysadmin']`, `['owner', 'staff']`).
*   **`index.js` (Global Navigation Guards)**: Implements `router.beforeEach` to:
    *   Check user authentication status via `localStorage.getItem('token')`.
    *   Retrieve user role from `localStorage.getItem('user')`.
    *   Redirect unauthenticated users to `/login`.
    *   Redirect authenticated but unauthorized users to their respective dashboards based on their role (`/admin/dashboard` for `sysadmin`, `/customer/dashboard` for `owner`/`staff`).
    *   Prevent authenticated users from accessing `/login` or `/register` pages.

## Authentication & State Management (Frontend)
*   **`localStorage`**: Used to store the JWT token and the authenticated `user` object (containing `id`, `email`, `role`, `customer_id`).
*   **`MainLayout.vue`**: Dynamically renders navigation items based on `isAuthenticated` status and `userRole`.
*   **`LoginPage.vue` / `RegisterPage.vue`**: Interact with backend `/api/login` and `/api/register` endpoints.

## Theming & Internationalization
*   **Quasar Dark Mode**: Managed via `$q.dark` and persisted in `localStorage`.
*   **`i18n.js` boot file**: Configures `vue-i18n` for language switching, with translations stored in `src/i18n`.
*   **`MainLayout.vue`**: Provides UI controls for theme and language selection.
