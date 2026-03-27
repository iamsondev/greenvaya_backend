# GreenVaya Backend 🌱

A robust, feature-rich backend REST API built for the **GreenVaya** community portal. This service handles user authentication, post (idea) management, upvoting/downvoting, nested comments, secure role-based access control (RBAC), and premium membership payments via Stripe.

---

## 🚀 Features

- **Authentication & Authorization:** Secure JWT-based authentication (Access & Refresh tokens) with role-based access control (Admin & User).
- **User Management:** Secure password hashing (Bcrypt), user profiles, and seamless state persistence.
- **Idea & Content Management:** Full CRUD operations for ideas/posts, comprehensive filtering, sorting, and pagination.
- **Interactive Community:** Support for upvoting/downvoting ideas and a deeply nested nested commenting system.
- **Payment Integration:** Stripe integration to process premium features/memberships securely.
- **Database Architecture:** Built with PostgreSQL and Prisma ORM for type-safe database interactions and migrations.
- **Data Validation:** Zod schema validation ensures data integrity on all endpoints.
- **Error Handling:** Centralized global error handling middleware for predictable API responses.

---

## 🛠️ Tech Stack

- **Runtime:** [Node.js](https://nodejs.org/)
- **Framework:** [Express.js](https://expressjs.com/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **Validation:** [Zod](https://zod.dev/)
- **Payments:** [Stripe API](https://stripe.com/)
- **Security:** `bcrypt`, `jsonwebtoken`, `cors`

---

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed on your local machine:
- **Node.js** (v18 or higher recommended)
- **pnpm** (preferred) or **npm** / **yarn**
- **PostgreSQL** Server (running locally or via a cloud provider)

---

## 💻 Installation & Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/iamsondev/greenvaya_backend
   cd greenvaya-backend
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and configure the following variables:
   ```env
   
   PORT=****
   DATABASE_URL=****************
   
   # JWT Secrets
   JWT_ACCESS_SECRET=****************
   JWT_REFRESH_SECRET=****************
   
   
   # Stripe
   STRIPE_SECRET_KEY=****************
   ```

4. **Initialize the Database:**
   Generate the Prisma client and push your schema to the database.
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Seed the Database:**
   Run the seed script to populate initial data (e.g., creating the first Admin user).
   ```bash
   pnpm run prisma:seed
   ```
   *(Note: Adjust the command based on your `package.json` seed script)*

6. **Start the Development Server:**
   ```bash
   pnpm run dev
   ```
   The server will start running at `http://localhost:5000`.

---

## 🌐 Deployment (Vercel)

This project is fully configured for deployment on Vercel as serverless functions.

1. Ensure all environment variables from `.env` are added to your Vercel project settings.
2. The `package.json` includes a `postinstall` script to automatically generate the Prisma client during the Vercel build phase.
3. The `vercel.json` file dictates that `src/app.ts` is the entry point for the serverless deployment.
4. Simply push your code to your linked GitHub repository, and Vercel will handle the rest.

---

## 📜 API Documentation

A Postman collection is available for testing the API endpoints locally.
- Import `greenvaya_api_collection.json` (located in the project root) into Postman to view detailed requests, payloads, and authorization requirements.

---

## 📝 Scripts

- `pnpm run dev` - Starts the development server with live reload (`tsx watch`).
- `pnpm run build` - Compiles TypeScript to JavaScript into the `dist/` directory.
- `pnpm run start` - Runs the compiled application (`node dist/server.js`).
- `pnpm run lint` - Runs ESLint to flag code formatting issues.

---

## 📄 License

This project is licensed under the ISC License.
