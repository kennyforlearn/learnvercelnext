# Authentication Setup Guide

This guide explains how to set up OAuth authentication with Google, Facebook, Microsoft, and LinkedIn.

## Step 1: Generate NEXTAUTH_SECRET

Run the following command to generate a secure secret:

```bash
openssl rand -base64 32
```

Copy the output and add it to `.env.local` as `NEXTAUTH_SECRET`

## Step 2: Set NEXTAUTH_URL

**For Local Development:**
```
NEXTAUTH_URL=http://localhost:3000
```

**For Vercel Deployment:**
- Vercel automatically sets `NEXTAUTH_URL` to your deployment URL
- You don't need to set it manually in Vercel environment variables
- If you need to override it, set it to your Vercel domain (e.g., `https://your-app.vercel.app`)

## Step 3: Set Up OAuth Providers

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable "Google+ API"
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Select "Web application"
6. Add Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
7. Copy `Client ID` and `Client Secret` to `.env.local`

```
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret
```

### Facebook OAuth

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or select existing one
3. Go to **Settings** → **Basic** → get App ID and App Secret
4. Go to **Products** → **Facebook Login** → **Settings**
5. Add Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/facebook` (development)
   - `https://yourdomain.com/api/auth/callback/facebook` (production)
6. Copy to `.env.local`

```
FACEBOOK_CLIENT_ID=your_app_id
FACEBOOK_CLIENT_SECRET=your_app_secret
```

### Microsoft OAuth

1. Go to [Azure Portal](https://portal.azure.com/)
2. Go to **Azure Active Directory** → **App registrations** → **New registration**
3. Set Name to your app name
4. Set Redirect URI to:
   - `http://localhost:3000/api/auth/callback/microsoft-entra-id` (development)
   - `https://yourdomain.com/api/auth/callback/microsoft-entra-id` (production)
5. Go to **Certificates & secrets** → **New client secret** → copy the value
6. Go to **Overview** → copy Application (client) ID
7. Copy to `.env.local`

```
MICROSOFT_CLIENT_ID=your_client_id
MICROSOFT_CLIENT_SECRET=your_client_secret
```

### LinkedIn OAuth

1. Go to [LinkedIn Developer Portal](https://www.linkedin.com/developers/)
2. Create a new app or select existing one
3. Go to **Auth** → **Authorized redirect URLs**
4. Add:
   - `http://localhost:3000/api/auth/callback/linkedin` (development)
   - `https://yourdomain.com/api/auth/callback/linkedin` (production)
5. Go to **Auth** → copy **Client ID** and **Client secret**
6. Copy to `.env.local`

```
LINKEDIN_CLIENT_ID=your_client_id
LINKEDIN_CLIENT_SECRET=your_client_secret
```

## Step 4: Update Authorized Emails

Edit `app/api/auth/[...nextauth].ts` and add authorized email addresses:

```typescript
const AUTHORIZED_EMAILS = [
  "kenny.tong9045@gmail.com",
  "another@email.com",
  // Add more authorized emails here
];
```

## Step 5: (Optional) Set Up Supabase Database

If you want to store user sessions and profile data in a database:

1. Go to [Supabase](https://supabase.com/)
2. Create a free account
3. Create a new project
4. Get your credentials from **Settings** → **API**
5. Add to `.env.local`

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Create a `users` table:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  image TEXT,
  provider TEXT,
  provider_id TEXT,
  last_login TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_email TEXT NOT NULL REFERENCES users(email) ON DELETE CASCADE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Step 6: Deploy to Vercel

### Environment Variables in Vercel

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add the following variables:

**Required:**
- `NEXTAUTH_SECRET` - Your generated secret key
- `GOOGLE_CLIENT_ID` - Your Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Your Google OAuth client secret
- `FACEBOOK_CLIENT_ID` - Your Facebook app ID
- `FACEBOOK_CLIENT_SECRET` - Your Facebook app secret
- `MICROSOFT_CLIENT_ID` - Your Microsoft client ID
- `MICROSOFT_CLIENT_SECRET` - Your Microsoft client secret
- `LINKEDIN_CLIENT_ID` - Your LinkedIn client ID
- `LINKEDIN_CLIENT_SECRET` - Your LinkedIn client secret

**Optional (Vercel sets this automatically):**
- `NEXTAUTH_URL` - Your Vercel deployment URL (only set if you need to override)

### OAuth Redirect URIs for Production

Update your OAuth provider settings with your Vercel domain:

**Google:**
- Authorized redirect URI: `https://your-app.vercel.app/api/auth/callback/google`

**Facebook:**
- Valid OAuth Redirect URIs: `https://your-app.vercel.app/api/auth/callback/facebook`

**Microsoft:**
- Redirect URI: `https://your-app.vercel.app/api/auth/callback/microsoft-entra-id`

**LinkedIn:**
- Authorized redirect URLs: `https://your-app.vercel.app/api/auth/callback/linkedin`

### Important Notes for Vercel

- **Environment Variables Scope**: Set variables for "Production", "Preview", and "Development" as needed
- **NEXTAUTH_URL**: Vercel automatically provides this, but if you have issues, you can manually set it
- **Re-deploy**: After adding environment variables, trigger a new deployment
- **Domain Changes**: If you change your Vercel domain, update OAuth redirect URIs accordingly

## Step 7: Test the Setup

1. Copy `.env.local.example` to `.env.local` and fill in all credentials
2. Run `npm run dev`
3. Visit `http://localhost:3000`
4. Click "Sign In"
5. Try signing in with one of the OAuth providers
6. If your email is in the whitelist, you'll be logged in
7. Visit `/dashboard` to see your profile

## Important Notes

- Only pre-defined emails can sign in (whitelist approach)
- User sessions are managed by NextAuth.js
- OAuth credentials should never be committed to Git
- Always use Environment variables for secrets
- In production, ensure NEXTAUTH_URL matches your domain
- Database is optional; without it, only session-based auth is used

## Troubleshooting

**"Invalid Client ID"**: Check that client IDs and secrets are copied correctly
**"Redirect URI mismatch"**: Ensure the redirect URI in OAuth provider settings matches exactly
**"Email not authorized"**: Check the whitelist in `app/api/auth/[...nextauth].ts`
**"Undefined variables in console"**: Make sure all environment variables are set in `.env.local`

## Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth](https://developers.google.com/identity/protocols/oauth2)
- [Facebook Login](https://developers.facebook.com/docs/facebook-login/web)
- [Microsoft Identity](https://learn.microsoft.com/en-us/entra/identity-platform/)
- [LinkedIn OAuth](https://learn.microsoft.com/en-us/linkedin/shared/authentication/authentication)
- [Supabase Documentation](https://supabase.com/docs)
