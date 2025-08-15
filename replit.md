# Overview

This is a full-stack web application built with React on the frontend and Express.js on the backend. The application appears to be a registration system, likely for a service or event, with form handling and data storage capabilities. It uses a modern tech stack with TypeScript throughout, Tailwind CSS for styling, and Drizzle ORM for database operations.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: Comprehensive component system built on Radix UI primitives with shadcn/ui styling
- **State Management**: React Query (TanStack Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with custom CSS variables for theming and design tokens
- **Form Handling**: React Hook Form with Zod validation for type-safe form management

## Backend Architecture
- **Framework**: Express.js with TypeScript running on Node.js
- **Database Layer**: Drizzle ORM configured for PostgreSQL with type-safe schema definitions
- **Database**: PostgreSQL (configured via Neon Database serverless driver)
- **Data Storage**: Dual approach with in-memory storage for development and PostgreSQL for production
- **API Design**: RESTful endpoints with proper error handling and validation

## Database Schema
- **Users Table**: Basic user management with username/password authentication
- **Registrations Table**: Stores registration data including name, phone, email, and optional experience field
- **Validation**: Comprehensive input validation using Zod schemas with custom error messages in Russian

## Authentication & Security
- **Session Management**: PostgreSQL-backed sessions using connect-pg-simple
- **Input Validation**: Server-side validation using Zod schemas matching frontend validation
- **Error Handling**: Centralized error handling with appropriate HTTP status codes

## Development Environment
- **Build System**: Vite for fast development and optimized production builds
- **Database Migrations**: Drizzle Kit for schema management and migrations
- **Development Server**: Hot module replacement with integrated frontend/backend development
- **TypeScript Configuration**: Shared types between frontend and backend via shared schema directory

## External Dependencies

- **Database Provider**: Neon Database (serverless PostgreSQL)
- **UI Component Library**: Radix UI for accessible, unstyled components
- **Font Provider**: Google Fonts (Inter, Architects Daughter, DM Sans, Fira Code, Geist Mono)
- **Development Tools**: Replit integration for cloud-based development environment
- **Build Tools**: esbuild for server bundling, PostCSS for CSS processing
- **Date Handling**: date-fns for date manipulation and formatting
- **Icons**: Lucide React for consistent iconography