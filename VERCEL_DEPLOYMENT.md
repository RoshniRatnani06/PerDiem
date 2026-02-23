# Vercel Deployment Guide

This guide explains how to deploy the Per Diem application to Vercel with a unified environment configuration.

## Architecture

The application uses a monorepo structure with:
- **Frontend**: React + Vite (deployed as static site from `client/dist`)
- **Backend**: Express API in `server/src/` (compiled to `server/dist/`)
- **API Wrapper**: Thin serverless function in `api/index.js` that imports the compiled server
- **Unified Environment**: Single `.env` file at the root for local development

### How It Works

1. **Local Development**: 
   - Backend runs on port 3002 from `server/src/`
   - Frontend runs on port 5175 with Vite proxy
   - Environment variables loaded from root `.env`

2. **Vercel Deployment**:
   - Build process compiles TypeScript: `server/src/` → `server/dist/`
   - `api/index.js` imports the compiled Express app from `server/dist/server.js`
   - Vercel treats `api/index.js` as a serverless function
   - All API routes (`/api/*`) are handled by this function
   - Frontend static files served from `client/dist`

## Prerequisites

1. Vercel account (free tier works)
2. Square API credentials (sandbox or production)
3. Git repository connected to Vercel

## Step 1: Environment Variables

All environment variables are now managed in a single `.env` file at the root of the project.

### Local Development

Copy the example file and add your credentials:

```bash
cp .env.example .env
```

Edit `.env` with your Square credentials:

```env
# Square API Configuration
SQUARE_ACCESS_TOKEN=your_square_access_token_here
SQUARE_ENVIRONMENT=sandbox
SQUARE_APPLICATION_ID=your_square_application_id_here

# Server Configuration
PORT=3002

# Client Configuration (Vite)
VITE_USE_MOCK_DATA=false
VITE_API_BASE_URL=/api
```

### Vercel Environment Variables

In your Vercel project dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add the following variables:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `SQUARE_ACCESS_TOKEN` | Your Square access token | Production, Preview, Development |
| `SQUARE_ENVIRONMENT` | `sandbox` or `production` | Production, Preview, Development |
| `SQUARE_APPLICATION_ID` | Your Square application ID | Production, Preview, Development |
| `VITE_USE_MOCK_DATA` | `false` | Production, Preview, Development |
| `VITE_API_BASE_URL` | `/api` | Production, Preview, Development |

## Step 2: Vercel Configuration

The `vercel.json` file is configured to:

```json
{
  "version": 2,
  "buildCommand": "npm run build:all",
  "outputDirectory": "client/dist",
  "installCommand": "npm install && npm install --workspace=server && npm install --workspace=client",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/index.js"
    }
  ],
  "functions": {
    "api/index.js": {
      "memory": 1024,
      "maxDuration": 10,
      "includeFiles": "server/dist/**"
    }
  }
}
```

This configuration:
- Installs all workspace dependencies
- Builds both server (TypeScript → JavaScript) and client (Vite build)
- Serves frontend from `client/dist`
- Routes `/api/*` requests to the serverless function at `api/index.js`
- Includes compiled server files (`server/dist/**`) in the serverless function
- Allocates 1GB memory and 10s timeout for API functions

### Project Structure for Vercel

```
perdiem-monorepo/
├── api/
│   └── index.js              # Serverless function wrapper (imports server/dist/server.js)
├── server/
│   ├── src/                  # TypeScript source code
│   │   ├── server.ts         # Main Express app (exports app)
│   │   ├── services/         # Square API integration
│   │   ├── middleware/       # Error handling, logging
│   │   └── config/           # Environment configuration
│   ├── dist/                 # Compiled JavaScript (created during build)
│   │   └── server.js         # Compiled Express app
│   └── package.json
├── client/
│   ├── src/                  # React source code
│   ├── dist/                 # Built static files (created during build)
│   └── package.json
├── .env                      # Environment variables (local only, not committed)
├── vercel.json               # Vercel configuration
└── package.json              # Root package.json with build scripts
```

## Step 3: Deploy to Vercel

### Option A: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Option B: Deploy via Git Integration

1. Push your code to GitHub/GitLab/Bitbucket
2. Go to [vercel.com](https://vercel.com)
3. Click **Add New Project**
4. Import your repository
5. Configure project:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (leave as root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `client/dist`
6. Add environment variables (see Step 1)
7. Click **Deploy**

## Step 4: Verify Deployment

After deployment, test your endpoints:

```bash
# Replace with your Vercel URL
VERCEL_URL="https://your-app.vercel.app"

# Test locations endpoint
curl $VERCEL_URL/api/locations

# Test catalog endpoint (replace LOCATION_ID)
curl "$VERCEL_URL/api/catalog?location_id=YOUR_LOCATION_ID"

# Test categories endpoint
curl "$VERCEL_URL/api/catalog/categories?location_id=YOUR_LOCATION_ID"
```

## Troubleshooting

### 404 Error on /api/locations

**Problem**: API routes return 404

**Solutions**:
1. Verify `api/index.js` exists and is committed to git
2. Verify `server/dist/` folder is created during build (check build logs)
3. Check that `server/src/server.ts` exports the app: `export const app = express();`
4. Ensure environment variables are set in Vercel dashboard
5. Check Vercel build logs for TypeScript compilation errors
6. Verify the build command runs: `npm run build:all`
7. Test locally: `npm run build:all` then check if `server/dist/server.js` exists
8. Redeploy the application

### Square API Errors

**Problem**: 401 Unauthorized or API errors

**Solutions**:
1. Verify `SQUARE_ACCESS_TOKEN` is correct in Vercel
2. Check `SQUARE_ENVIRONMENT` matches your token type
3. Ensure token has required permissions in Square dashboard

### Build Failures

**Problem**: Build fails on Vercel

**Solutions**:
1. Check build logs in Vercel dashboard
2. Verify all dependencies are in `package.json` files
3. Test build locally: `npm run build`
4. Ensure Node.js version is 18+ (set in Vercel project settings)

### CORS Issues

**Problem**: Frontend can't access API

**Solutions**:
1. Verify `vercel.json` rewrites are configured correctly
2. Check browser console for CORS errors
3. Ensure API routes use `/api` prefix

## Local Development

For local development, continue using the monorepo setup:

```bash
# Install dependencies
npm run install:all

# Start both frontend and backend
npm run dev

# Frontend: http://localhost:5175
# Backend: http://localhost:3002
```

## Production Considerations

### Caching

The API uses in-memory caching with a 5-minute TTL. For production:
- Consider using Redis for distributed caching
- Implement cache invalidation strategies
- Monitor cache hit rates

### Rate Limiting

Implement rate limiting to protect your Square API quota:
- Use Vercel Edge Middleware
- Implement per-IP rate limits
- Monitor API usage in Square dashboard

### Monitoring

Set up monitoring for production:
- Vercel Analytics for frontend performance
- Vercel Logs for API errors
- Square API logs for integration issues

### Security

- Never commit `.env` files to git
- Rotate Square access tokens regularly
- Use environment-specific tokens (sandbox vs production)
- Enable Vercel's security features (DDoS protection, etc.)

## Migration from Separate .env Files

If you previously had separate `.env` files in `client/` and `server/`:

1. Merge all variables into root `.env`
2. Remove `client/.env` and `server/.env`
3. Update any scripts that reference old env files
4. Redeploy to Vercel

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Serverless Functions](https://vercel.com/docs/functions/serverless-functions)
- [Square API Documentation](https://developer.squareup.com/docs)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)

## Support

For issues specific to this deployment:
1. Check Vercel build logs
2. Review Square API logs
3. Test API endpoints directly
4. Verify environment variables are set correctly
