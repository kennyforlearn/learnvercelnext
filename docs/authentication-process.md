# Authentication Process Explanation

## How OAuth Authentication Works

This application uses OAuth 2.0 with multiple providers (Google, Facebook, Microsoft, LinkedIn) to authenticate users. Here's a step-by-step breakdown of the process:

### 1. User Initiates Sign-In
- User visits the home page
- If not logged in, user is automatically redirected to `/auth/signin`
- On the sign-in page, user selects an OAuth provider (e.g., Google)

### 2. OAuth Provider Authentication
- User is redirected to the chosen provider's login page
- User enters their credentials and grants permission to the app
- Provider verifies the user's identity and generates an authorization code

### 3. Callback to Application
- Provider redirects back to our app at `/api/auth/callback/google` (or other provider)
- NextAuth.js receives the authorization code and exchanges it for an access token
- Provider returns user profile information (name, email, etc.)

### 4. Authorization Check
- Our app checks if the user's email is in the authorized whitelist
- Whitelist is stored in environment variable `AUTHORIZED_EMAILS`
- If email is authorized, user is allowed to proceed
- If not authorized, user is redirected to `/auth/error`

### 5. Session Creation
- NextAuth.js creates a session for the authenticated user
- Session data is stored securely (in cookies by default)
- User is redirected to the home page or dashboard

### 6. Protected Routes
- Middleware checks for valid session on protected routes (e.g., `/dashboard`)
- If no session, user is redirected to sign-in page
- If session exists, user can access protected content

## Key Components

- **NextAuth.js**: Handles OAuth flow and session management
- **Providers**: Google, Facebook, Microsoft, LinkedIn OAuth services
- **Whitelist**: Environment-based email authorization
- **Middleware**: Route protection
- **Pages**: Sign-in, error, dashboard, home

## Security Features

- Only pre-approved emails can access the application
- OAuth providers handle secure authentication
- Sessions are managed server-side
- No sensitive data stored in client-side code

## Environment Variables Required

- `NEXTAUTH_SECRET`: For session encryption
- `AUTHORIZED_EMAILS`: Comma-separated list of allowed emails
- Provider-specific credentials (e.g., `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`)

This setup provides secure, multi-provider authentication with fine-grained access control.