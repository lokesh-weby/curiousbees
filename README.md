# Curious Bees

A research collaboration platform connecting Scholars, Faculty Supervisors, and Institution Administrators.

This project was provided as a pre-configured `.rar` archive, which means the `.env` files for both the client and server are already included and configured. You do not need to create them manually.

## Running the Project Locally

To get the project running, you will need to open two separate terminal windows (one for the backend server and one for the frontend client).

### 1. Start the Backend Server (NestJS + Prisma)
Open a terminal, navigate to the `server` directory, install the dependencies, and start the development server.

```bash
cd server
npm install

# Generate the Prisma client based on the provided schema
npm run prisma:generate

# Push the database schema to the PostgreSQL database
npm run prisma:push

# Start the NestJS backend
npm run dev
```
The NestJS server will start running at `http://localhost:4000`.

### 2. Start the Frontend Client (Next.js)
Open a **new** terminal window, navigate to the `client` directory, install the dependencies, and start the development server.

```bash
cd client
npm install

# Start the Next.js frontend
npm run dev
```
The frontend will be accessible at `http://localhost:3000`.

## Available Scripts

### Client (`/client`)
- `npm run dev`: Starts the Next.js development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Runs the built Next.js application.

### Server (`/server`)
- `npm run dev`: Starts the NestJS development server in watch mode.
- `npm run prisma:push`: Syncs your local Prisma schema with your database.
- `npm run prisma:generate`: Generates the Prisma client.
