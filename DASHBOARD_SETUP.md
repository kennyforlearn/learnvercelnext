# Dashboard Setup & Troubleshooting Guide

## Recent Changes & Issues Fixed

### 1. **Octopus Energy - Bill/Due/Usage showing 0** ✅ FIXED
- **Problem:** Client-side API calls with exposed credentials
- **Solution:** Created `/api/octopus/account` server route
- **Action:** Add to `.env.local`:
  ```env
  OCTOPUS_API_KEY=your_api_key
  OCTOPUS_ACCOUNT=your_account_number
  ```
- **Chart:** Now shows larger graph with Y-axis (price) and X-axis (days)

### 2. **Gmail - Shows "Connected" but messages are "Not available"** ✅ FIXED
- **Problem:** Can't use OAuth credentials for both login AND Gmail API
- **Solution:** Clarified variable names and OAuth flow
- **Required:** Set ONE of:
  - `GMAIL_SERVICE_ACCOUNT_KEY` (service account JSON), OR
  - `GMAIL_REFRESH_TOKEN` (user OAuth token)
- **See:** [Gmail Setup Guide](./docs/gmail-setup.md)

### 3. **Yahoo Mail - Unclear credentials** ✅ CLARIFIED
- **Problem:** Multiple credential types needed, not fully implemented
- **Status:** Placeholder ready for implementation
- **See:** [Yahoo Mail Setup Guide](./docs/yahoo-mail-setup.md)

### 4. **News - No articles shown** ✅ FIXED
- **Problem:** `NEWS_API_KEY` not configured
- **Solution:** Add to `.env.local`:
  ```env
  NEWS_API_KEY=your_newsapi_key_from_newsapi.org
  ```

### 5. **Weather + Network + Power - Unified city search** ✅ FIXED
- **New Component:** `CityDashboard.tsx`
- **Features:** One city input field searches Weather + Network Status + Power Utilities
- **Updated:** `PublicInfo.tsx` now uses the unified component

---

## Architecture Overview

```
components/dashboard/
├── NonPublicInfo.tsx         # Private info container
│   ├── OctopusEnergy.tsx     # Energy bills + usage chart
│   ├── Gmail.tsx             # Gmail unread + message list
│   └── YahooMail.tsx         # Yahoo unread + message list
└── PublicInfo.tsx            # Public info container
    ├── CityDashboard.tsx     # Weather + Network + Power (unified)
    ├── News.tsx              # Latest news articles
    └── StockIndex.tsx        # Stock index + symbol search + chart

app/api/
├── octopus/
│   ├── account/route.ts      # Bill, due date, usage (NEW SERVER ROUTE)
│   └── consumption/route.ts  # Usage series + chart data
├── email/
│   ├── gmail-unread/route.ts       # Unread count + email address
│   ├── gmail-messages/route.ts     # Message list (NEW)
│   ├── yahoo-unread/route.ts       # Yahoo unread status
│   └── yahoo-messages/route.ts     # Yahoo messages (placeholder)
├── stocks/
│   ├── route.ts              # Stock quotes
│   └── chart/route.ts        # Stock price history
└── news/route.ts             # News articles (server-side)
```

---

## Environment Variables Setup

### Authentication (.env.local)
```env
NEXTAUTH_SECRET=your_secret_generated_with_openssl_rand_-base64_32
AUTHORIZED_EMAILS=your.email@gmail.com

NEXTAUTH_URL=http://localhost:3000

# Google OAuth (for NextAuth login ONLY)
GOOGLE_OAUTH_CLIENT_ID=your_google_oauth_client_id
GOOGLE_OAUTH_CLIENT_SECRET=your_google_oauth_client_secret

# Other OAuth (optional)
FACEBOOK_CLIENT_ID=...
MICROSOFT_CLIENT_ID=...
LINKEDIN_CLIENT_ID=...
```

### Dashboard APIs
```env
# Gmail API (choose ONE)
GMAIL_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
# OR
GMAIL_REFRESH_TOKEN=your_refresh_token_here

# Yahoo Mail (optional, not fully implemented)
YAHOO_CLIENT_ID=...
YAHOO_CLIENT_SECRET=...
YAHOO_REFRESH_TOKEN=...

# Public APIs
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_openweather_key
NEWS_API_KEY=your_newsapi_key
STOCK_API_KEY=your_alphavantage_key

# Octopus Energy
OCTOPUS_API_KEY=your_api_key
OCTOPUS_ACCOUNT=your_account_number
```

---

## Component Details

### OctopusEnergy.tsx
- **Fetches from:** `/api/octopus/account` (server route)
- **Displays:** Bill, Due Date, Usage
- **Chart:** 30-day usage trend with axes
- **Toggle:** Switch between Electricity and Gas

### Gmail.tsx
- **Fetches from:** `/api/email/gmail-unread`, `/api/email/gmail-messages`
- **Requires:** Valid `GMAIL_REFRESH_TOKEN` or `GMAIL_SERVICE_ACCOUNT_KEY`
- **Displays:** Email address, unread count, message list (10/20/50/100 selectable)

### YahooMail.tsx
- **Status:** Placeholder - awaiting OAuth implementation
- **Planned:** Unread count + message list like Gmail

### CityDashboard.tsx (NEW - UNIFIED)
- **One input field:** Enter any city name
- **Fetches:** Weather (OpenWeatherMap), Network status, Power utilities
- **Displays:** Temperature, conditions, humidity, wind speed, ISP status, power grid status

### StockIndex.tsx
- **Search input:** Enter stock symbol (e.g., "AAPL", "TSLA")
- **Chart:** 100-day price history from Alpha Vantage
- **Pre-configured:** Shows MSFT, IBM, AAPL quotes by default

### News.tsx
- **Fetches from:** `/api/news` (server-side proxy)
- **Requires:** `NEWS_API_KEY` set in `.env.local`
- **Displays:** Top 3 UK headlines with links

---

## Testing Checklist

1. **Add `NEWS_API_KEY`** from newsapi.org
   - [ ] Verify 3+ news articles appear on dashboard

2. **Add Octopus credentials**
   - [ ] Bill amount displays (not 0)
   - [ ] Due date displays (not ---)
   - [ ] Usage displays (not 0)
   - [ ] Chart renders with axes

3. **Add Gmail credentials**
   - [ ] Email address appears
   - [ ] Unread count displays
   - [ ] Messages list populates

4. **Test CityDashboard**
   - [ ] Type "Tokyo" → Weather updates
   - [ ] Type "New York" → Weather updates
   - [ ] Network + Power sections visible

5. **Test StockIndex**
   - [ ] Search "TSLA" → Chart appears
   - [ ] Search "GOOGL" → Chart appears

---

## Troubleshooting

### "No messages available" in Gmail
- Ensure `GMAIL_ACCESS_TOKEN` or `GMAIL_REFRESH_TOKEN` is set
- Check server logs: `npm run dev` shows errors
- Verify Gmail API is enabled in Google Cloud Console

### "0" values in Octopus
- Make sure `OCTOPUS_API_KEY` and `OCTOPUS_ACCOUNT` are in `.env.local`
- Restart dev server after adding env vars
- Check server logs for API errors

### No news shown
- Add `NEWS_API_KEY` from https://newsapi.org
- Restart dev server: `npm run dev`
- Check browser console (F12) for errors

### City search not updating weather
- Verify `NEXT_PUBLIC_OPENWEATHER_API_KEY` is set
- Wait 0.5 seconds after typing (debounced)
- Check browser console for API errors

---

## Next Steps

- [ ] Implement Gmail OAuth server flow (auto token refresh)
- [ ] Implement Yahoo Mail OAuth + IMAP fallback
- [ ] Add real meter consumption to Octopus (requires meter IDs)
- [ ] Add interactive charts with Recharts or Chart.js library

### 2. HSBC Bank
**File**: `components/dashboard/HSBCBank.tsx`  
**API Route**: `app/api/bank/hsbc-balance/route.ts`

**Setup**:
1. Register at https://developer.hsbc.com
2. Create an application in your dashboard
3. Set up OAuth2 with your callback URL
4. Implement OAuth2 flow on your backend to get access token
5. Add to `.env.local`:
```
NEXT_PUBLIC_HSBC_API_KEY=your_api_key
NEXT_PUBLIC_HSBC_ACCESS_TOKEN=your_access_token
```

**Data Fetched**:
- Account balance
- Account number (masked)
- Currency

**Note**: Requires server-side OAuth2 implementation. The frontend component calls `/api/bank/hsbc-balance` which handles the API communication securely.

---

### 3. Gmail
**File**: `components/dashboard/Gmail.tsx`  
**API Route**: `app/api/email/gmail-unread/route.ts`

**Setup**:
1. Go to https://console.cloud.google.com/
2. Create a new project or select existing one
3. Enable Gmail API
4. Create OAuth2 credentials (Desktop or Web app)
5. Download credentials JSON
6. Implement OAuth2 flow to get refresh token
7. Use refresh token to get access token
8. Add to `.env.local`:
```
NEXT_PUBLIC_GMAIL_ACCESS_TOKEN=your_access_token
```

**Data Fetched**:
- Gmail address
- Unread message count

**Note**: For production, store and refresh tokens securely on the backend.

---

### 4. Yahoo Mail
**File**: `components/dashboard/YahooMail.tsx`  
**API Route**: `app/api/email/yahoo-unread/route.ts`

**Setup**:
1. Go to https://developer.yahoo.com/
2. Register and create an app
3. Enable Yahoo Mail API access
4. Set up OAuth2 credentials
5. Implement OAuth2 flow to get access token
6. Add to `.env.local`:
```
NEXT_PUBLIC_YAHOO_ACCESS_TOKEN=your_access_token
```

**Data Fetched**:
- Unread message count

---

## Public Information Components

### 1. Weather
**File**: `components/dashboard/Weather.tsx`

**Setup**:
1. Register at https://openweathermap.org/api
2. Subscribe to the free tier (One Call API 2.5)
3. Get your API key
4. Add to `.env.local`:
```
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_api_key
```

**Data Fetched**:
- Temperature (°C)
- Weather condition
- Humidity (%)
- Wind speed (m/s)

**Default Location**: London, UK (can be customized in component)

---

### 2. News
**File**: `components/dashboard/News.tsx`

**Setup**:
1. Register at https://newsapi.org
2. Get your free API key
3. Add to `.env.local`:
```
NEXT_PUBLIC_NEWS_API_KEY=your_api_key
```

**Data Fetched**:
- Top 3 headlines from UK
- Article title
- Source
- Published date
- Link to full article

---

### 3. Network Status
**File**: `components/dashboard/NetworkStatus.tsx`

**Setup** (Optional):
Uses browser's native `navigator.onLine` for basic connectivity check.

For advanced ISP outage monitoring:
1. Choose a service (e.g., DownDetector API)
2. Register and get API key
3. Add to `.env.local`:
```
NEXT_PUBLIC_NETWORK_API_KEY=your_api_key
```

**Data Fetched**:
- Online/Offline status
- ISP outages (if API configured)
- Connection health

---

### 4. Power & Utilities
**File**: `components/dashboard/PowerUtilities.tsx`

**Setup** (Optional):
For UK-specific power and flooding alerts:
1. Register with UK Power Networks or similar service
2. Get API access
3. Add to `.env.local`:
```
NEXT_PUBLIC_UTILITIES_API_KEY=your_api_key
```

**Data Fetched**:
- Power grid status (Stable/Warning/Critical)
- Flooding alerts
- Weather alerts

---

### 5. Stock Index
**File**: `components/dashboard/StockIndex.tsx`

**Setup**:
Choose one of:
- **Alpha Vantage**: https://www.alphavantage.co (Free tier available)
- **Finnhub**: https://finnhub.io (Free tier available)
- **Twelve Data**: https://twelvedata.com

Example with Alpha Vantage:
1. Register at https://www.alphavantage.co
2. Get free API key
3. Add to `.env.local`:
```
NEXT_PUBLIC_STOCK_API_KEY=your_api_key
```

**Data Fetched**:
- FTSE 100 (UK main index)
- S&P 500 (US main index)
- DAX (European index)
- Changes and percentage

---

## Environment Variables Summary

Create `.env.local` file in your project root with:

```env
# Public APIs
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_key
NEXT_PUBLIC_NEWS_API_KEY=your_key
NEXT_PUBLIC_STOCK_API_KEY=your_key
NEXT_PUBLIC_OCTOPUS_API_KEY=your_key
NEXT_PUBLIC_OCTOPUS_ACCOUNT=your_account

# Optional
NEXT_PUBLIC_NETWORK_API_KEY=your_key
NEXT_PUBLIC_UTILITIES_API_KEY=your_key

# OAuth2 Tokens (Secured on backend for production)
NEXT_PUBLIC_HSBC_API_KEY=your_key
NEXT_PUBLIC_HSBC_ACCESS_TOKEN=your_token
NEXT_PUBLIC_GMAIL_ACCESS_TOKEN=your_token
NEXT_PUBLIC_YAHOO_ACCESS_TOKEN=your_token

# Backend-only secrets (for server-side operations)
HSBC_ACCESS_TOKEN=your_token
GMAIL_ACCESS_TOKEN=your_token
YAHOO_ACCESS_TOKEN=your_token
```

---

## Component Refresh Intervals

Each component has built-in refresh intervals:

- **Weather**: 10 minutes
- **News**: 30 minutes
- **Network Status**: 5 minutes (+ real-time browser events)
- **Power & Utilities**: 30 minutes
- **Stock Index**: 15 minutes
- **Octopus Energy**: 60 minutes
- **Gmail**: 10 minutes
- **Yahoo Mail**: 15 minutes
- **HSBC Bank**: 30 minutes

---

## Error Handling

All components include:
- Loading states
- Error displays with user-friendly messages
- Fallback values when APIs fail
- Automatic retry logic

Failed API calls will show error messages to users without breaking the dashboard.

---

## Security Best Practices

1. **Never commit `.env.local`** - Use `.env.example` as template
2. **Use environment variables** for all sensitive data
3. **Server-side API routes** for OAuth2 tokens and sensitive operations
4. **HTTPS only** in production for API calls
5. **Rate limiting** - Some APIs have rate limits; consider caching responses
6. **Token rotation** - Implement refresh token logic for OAuth2

---

## Customization

### Change Location (Weather)
Edit `Weather.tsx` line with London:
```typescript
`https://api.openweathermap.org/data/2.5/weather?q=YourCity&units=metric&appid=${apiKey}`
```

### Change News Country
Edit `News.tsx` line with `gb`:
```typescript
`https://newsapi.org/v2/top-headlines?country=us&pageSize=3&apiKey=${apiKey}`
```

### Add/Remove Widgets
Edit `PersonalInfo.tsx` and `PublicInfo.tsx` to add or remove component imports and usage.

---

## Troubleshooting

### Component shows "Not configured"
- Check `.env.local` file exists
- Verify environment variable names match exactly
- Restart development server after updating `.env.local`

### "API key not found" error
- Make sure prefix is `NEXT_PUBLIC_` for client-side visible keys
- For server-only keys, remove the `NEXT_PUBLIC_` prefix

### CORS errors
- Use API routes (`/api/`) for cross-origin requests
- Configure CORS headers in API routes if needed

### Rate limit errors
- Check API provider's rate limits
- Consider implementing caching
- Add exponential backoff to retry logic

---

## Next Steps

1. Copy `.env.example` to `.env.local`
2. Register with each API provider
3. Get API keys and add to `.env.local`
4. Test components individually
5. Monitor API usage in each provider's dashboard
6. Implement caching for frequently accessed data
7. Add proper error logging in production
