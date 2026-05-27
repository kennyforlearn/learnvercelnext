# Dashboard Setup Guide

This guide explains the new modular dashboard architecture and how to set up each component.

## Architecture Overview

The dashboard is now composed of modular components organized as follows:

```
components/dashboard/
├── PersonalInfo.tsx          # Container for personal information
├── PublicInfo.tsx            # Container for public information
├── OctopusEnergy.tsx         # Energy bills (Octopus Energy API)
├── HSBCBank.tsx              # Bank balance (HSBC Open Banking API)
├── Gmail.tsx                 # Email unread count (Gmail API)
├── YahooMail.tsx             # Email unread count (Yahoo Mail API)
├── Weather.tsx               # Weather data (OpenWeatherMap API)
├── News.tsx                  # Latest news (NewsAPI)
├── NetworkStatus.tsx         # Network/ISP status
├── PowerUtilities.tsx        # Power grid and flooding alerts
└── StockIndex.tsx            # Stock market indices

app/api/
├── bank/hsbc-balance/route.ts      # HSBC balance endpoint
├── email/gmail-unread/route.ts      # Gmail unread endpoint
└── email/yahoo-unread/route.ts      # Yahoo Mail unread endpoint
```

## Personal Information Components

### 1. Octopus Energy
**File**: `components/dashboard/OctopusEnergy.tsx`

**Setup**:
1. Register at https://developer.octopusenergy.com
2. Generate an API key for your account
3. Get your account number from your Octopus Energy dashboard
4. Add to `.env.local`:
```
NEXT_PUBLIC_OCTOPUS_API_KEY=your_api_key
NEXT_PUBLIC_OCTOPUS_ACCOUNT=your_account_number
```

**Data Fetched**:
- Current bill amount
- Bill due date
- Energy usage (kWh)
- Connection status

---

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
