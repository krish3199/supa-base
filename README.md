# Expense Management System

This is a full-stack expense management system built with Next.js, React, and Firebase.

## Features

-   **User Authentication:** Secure login using Firebase Authentication.
-   **Dashboard:** Overview of key metrics like total expenses, clients, employees, and payments.
-   **Expense Tracking:** Add, view, and manage expenses.
-   **Client Management:** Keep track of client information.
-   **Payment Tracking:** Record and view payments received.
-   **Employee Management:** Manage employee details.
-   **Analytics (Placeholder):** Basic analytics views (charts are placeholders, actual implementation would require a charting library and more data).

## Setup and Installation

### 1. Clone the Repository

\`\`\`bash
git clone <your-repo-url>
cd expense-management-system
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Firebase Project Setup

1.  **Create a Firebase Project:** Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2.  **Enable Authentication:** In your Firebase project, navigate to "Authentication" and enable "Email/Password" sign-in method.
3.  **Enable Firestore Database:** Navigate to "Firestore Database" and create a new database. Start in production mode.
4.  **Generate Service Account Key:**
    *   Go to "Project settings" (gear icon) -> "Service accounts".
    *   Click "Generate new private key" and then "Generate key". This will download a JSON file.
    *   **Important:** Keep this file secure.
5.  **Get Web App Configuration:**
    *   In "Project settings" -> "General", scroll down to "Your apps" and add a new web app.
    *   Copy the `firebaseConfig` object.

### 4. Environment Variables

Create a `.env.local` file in the root of your project and add the following variables:

\`\`\`
# Firebase Client Configuration (for client-side SDK)
NEXT_PUBLIC_FIREBASE_API_KEY="YOUR_FIREBASE_API_KEY"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="YOUR_FIREBASE_AUTH_DOMAIN"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="YOUR_FIREBASE_PROJECT_ID"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="YOUR_FIREBASE_STORAGE_BUCKET"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="YOUR_FIREBASE_MESSAGING_SENDER_ID"
NEXT_PUBLIC_FIREBASE_APP_ID="YOUR_FIREBASE_APP_ID"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="YOUR_FIREBASE_MEASUREMENT_ID" # Optional

# Firebase Admin SDK Configuration (for server-side operations)
# Paste the entire content of your Firebase service account JSON file here, escaped as a single line.
# Example: FIREBASE_SERVICE_ACCOUNT_KEY='{"type": "service_account", "project_id": "...", "private_key_id": "...", "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n", "client_email": "...", "client_id": "...", "auth_uri": "...", "token_uri": "...", "auth_provider_x509_cert_url": "...", "client_x509_cert_url": "...", "universe_domain": "..."}'
FIREBASE_SERVICE_ACCOUNT_KEY='<PASTE_YOUR_SERVICE_ACCOUNT_JSON_HERE>'
\`\`\`

**Note on `FIREBASE_SERVICE_ACCOUNT_KEY`:** The JSON content must be on a single line and properly escaped if it contains special characters. For Vercel deployment, you will add this as an environment variable directly in the Vercel dashboard.

### 5. Seed Database (Optional)

You can run the seed script to populate your Firestore database with demo users, clients, and employees. This script will **not** clear existing data and will only add new entries if they don't already exist.

\`\`\`bash
npm run seed
\`\`\`

This will create:
-   A demo user: `demo@example.com` with password `password123` (role: admin)
-   Sample clients: `Acme Corp`, `Globex Inc`
-   Sample employees: `John Doe`, `Jane Smith`

### 6. Run the Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Project Structure

-   `app/`: Next.js App Router pages and API routes.
    -   `api/`: API routes for data fetching and authentication.
    -   `dashboard/`: Protected dashboard pages.
-   `components/`: Reusable React components (including Shadcn UI components).
-   `lib/`: Utility functions and Firebase initialization.
-   `models/`: TypeScript interfaces for data models.
-   `scripts/`: Database seeding scripts.

## Deployment

This project can be easily deployed to Vercel. Ensure your environment variables are configured in your Vercel project settings.

\`\`\`bash
npm run build
npm start
