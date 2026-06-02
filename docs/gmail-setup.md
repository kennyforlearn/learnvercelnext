# Gmail Setup Guide

## What You Need

Gmail API requires **two sets** of credentials:

### 1. OAuth Credentials (for NextAuth authentication to your app)
- **GOOGLE_OAUTH_CLIENT_ID** — OAuth app Client ID
- **GOOGLE_OAUTH_CLIENT_SECRET** — OAuth app Client Secret

These allow users to log in with Google. Get them from [Google Cloud Console](https://console.cloud.google.com/).

### 2. Gmail API Service Account OR User OAuth Token
To actually **read Gmail messages**, you need either:

#### Option A: Service Account (Recommended for server)
- Create a Service Account in Google Cloud Console
- Download the JSON key file
- Grant the service account access to the Gmail inbox (via domain admin or user consent)
- Set: **GMAIL_SERVICE_ACCOUNT_KEY** (JSON string of the key file)

#### Option B: User OAuth Token (for your personal account)
1. Generate an OAuth token using a script:
   ```bash
   node scripts/get-gmail-token.js
   ```
   This opens Google login, and you authorize the app
   → Google returns a **refresh token**
2. Store the refresh token: **GMAIL_REFRESH_TOKEN**
3. The server will automatically refresh it when needed

---

## Environment Variables to Set

```env
# OAuth for NextAuth login
GOOGLE_OAUTH_CLIENT_ID=your_client_id_here
GOOGLE_OAUTH_CLIENT_SECRET=your_client_secret_here

# Gmail API access (choose ONE option below):

# Option A: Service Account JSON (entire JSON as string)
GMAIL_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"..."}

# Option B: User OAuth refresh token
GMAIL_REFRESH_TOKEN=your_refresh_token_here
```

---

## Testing

1. Add the above env vars to `.env.local`
2. Restart the dev server: `npm run dev`
3. Visit `/dashboard`
4. Check the Gmail widget — if configured, it shows your email and unread count

If still showing "Not connected", check server logs for errors.
