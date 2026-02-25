# Development Workflow

This document outlines the standard procedures and commands for setting up, developing, and maintaining the AutoDroop application.

## 1. Project Setup

To get the project up and running, follow these steps:

### Prerequisites
*   Node.js (version 20 or higher recommended)
*   npm (comes with Node.js)
*   A running MySQL server (or compatible database for the backend)

### Backend Setup
1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Install backend dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `backend` directory based on `.env.example` (if provided, otherwise create one) and configure your database connection and JWT secret:
    ```
    # .env
    DB_DIALECT=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_USERNAME=your_mysql_user
    DB_PASSWORD=your_mysql_password
    DB_DATABASE=autodroop_db
    JWT_SECRET=your_super_secret_jwt_key
    PORT=3000
    ```
4.  Run database migrations to create the necessary tables:
    ```bash
    npx sequelize db:migrate
    ```
5.  Seed the database with initial data (e.g., default packages, admin user):
    ```bash
    npx sequelize db:seed:all
    ```

### Frontend Setup
1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install frontend dependencies:
    ```bash
    npm install
    ```

## 2. Running the Application

### Start Backend Development Server
1.  From the `backend` directory:
    ```bash
    npm start
    # or for development with auto-restarts:
    npm run dev
    ```
    The backend API will typically run on `http://localhost:3000`.

### Start Frontend Development Server
1.  From the `frontend` directory:
    ```bash
    npm run dev
    ```
    The frontend application will typically open in your browser at `http://localhost:9000`.

## 3. Database Management (Backend)

*   **Create a new migration:**
    ```bash
    npx sequelize migration:generate --name your-migration-name
    ```
*   **Create a new model:**
    ```bash
    npx sequelize model:generate --name YourModelName --attributes field1:string,field2:integer
    ```
*   **Run migrations:**
    ```bash
    npx sequelize db:migrate
    ```
*   **Revert last migration:**
    ```bash
    npx sequelize db:migrate:undo
    ```
*   **Create a new seeder:**
    ```bash
    npx sequelize seed:generate --name your-seeder-name
    ```
*   **Run all seeders:**
    ```bash
    npx sequelize db:seed:all
    ```
*   **Revert last seeder:**
    ```bash
    npx sequelize db:seed:undo
    ```

## 4. Code Quality & Formatting (Frontend)

*   **Linting (ESLint):**
    ```bash
    npm run lint
    ```
    This command checks for code style issues and potential errors.

*   **Formatting (Prettier):**
    ```bash
    npm run format
    ```
    This command automatically formats your code according to the project's Prettier configuration.

## 5. Building for Production (Frontend)

To create an optimized production build of the frontend application:
1.  From the `frontend` directory:
    ```bash
    npm run build
    ```
    The build output will be located in the `dist` directory.
