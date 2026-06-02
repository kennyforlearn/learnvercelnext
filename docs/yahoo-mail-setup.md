# Yahoo Mail Setup Guide

## Required Credentials

Yahoo Mail API requires **OAuth2 credentials**:

1. **YAHOO_CLIENT_ID** — OAuth app Client ID
2. **YAHOO_CLIENT_SECRET** — OAuth app Client Secret
3. **YAHOO_REFRESH_TOKEN** — OAuth refresh token (obtained after user auth)

---

## Step 1: Create a Yahoo Developer App

1. Go to [Yahoo Developer Console](https://developer.yahoo.com)
2. Create a new app (or select existing one)
3. Get the **Client ID** and **Client Secret**

---

## Step 2: Generate Refresh Token

Run a token generation script (not yet implemented):
```bash
node scripts/get-yahoo-token.js
```

This opens Yahoo login → User authorizes → Returns **refresh token**

---

## Step 3: Set Environment Variables

```env
YAHOO_CLIENT_ID=your_client_id_here
YAHOO_CLIENT_SECRET=your_client_secret_here
YAHOO_REFRESH_TOKEN=your_refresh_token_here
```

---

## Status

⚠️ **Currently NOT fully implemented** — We have a placeholder route at `/api/email/yahoo-messages` that returns empty.

**To implement:**
1. Add `get-yahoo-token.js` script for OAuth flow
2. Update `/api/email/yahoo-messages` to use Yahoo Mail API REST endpoint or IMAP
3. Wire up token refresh logic in server routes

---

## Alternative: IMAP

If Yahoo Mail API is unavailable, consider using **IMAP**:
- Connect via `imap@yahoo.com` (requires app password, not regular password)
- Use node-imap or similar library
- Fetch mailbox and message metadata

Let me know if you'd like me to implement this!
