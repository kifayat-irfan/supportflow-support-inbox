
# SupportFlow Enterprise Inbox

A high-performance support ticket management system built with Next.js, Prisma, and Gemini AI.

## Getting Started

### Prerequisites
- Docker & Docker Compose
- Google Gemini API Key

### Running with Docker
1. Create a `.env` file or export your `API_KEY`.
2. Run the services:
   ```bash
   docker-compose up --build
   ```
3. Initialize the database:
   ```bash
   docker-compose exec app npx prisma migrate dev
   ```

## Architecture
- **Frontend**: Next.js App Router with Tailwind CSS for a fluid, responsive UI.
- **Backend**: Next.js Route Handlers for robust API endpoints.
- **AI**: Google Gemini (gemini-3-flash) for automated summaries and smart replies.
- **Database**: PostgreSQL with Prisma ORM for type-safe database access.
- **Auth**: JWT-based session management with secure password hashing via Bcrypt.

## Roles
- **ADMIN**: Can manage Knowledge Base articles and view all system activity.
- **AGENT**: Can manage tickets and use AI features to resolve customer issues.
