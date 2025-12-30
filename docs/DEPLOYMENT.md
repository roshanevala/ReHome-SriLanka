# Deployment Guide

Guide for deploying ReBuild Homes SriLanka to production.

## 🚀 Pre-Deployment Checklist

Before deploying to production, ensure:

### Security
- [ ] Environment files (`environment.ts`, `environment.prod.ts`) use production Firebase config
- [ ] Firebase Security Rules are properly configured and tested
- [ ] Service account keys are NOT in the repository
- [ ] All secrets are in `.gitignore`
- [ ] HTTPS is enforced
- [ ] Firebase App Check is enabled (recommended)

### Code Quality
- [ ] All tests pass (if you've added tests)
- [ ] No console.log statements in production code
- [ ] Code is properly formatted
- [ ] Dependencies are up to date (`npm audit`)
- [ ] Build completes without errors: `npm run build`

### Firebase Setup
- [ ] Firestore Security Rules deployed
- [ ] Firestore Indexes deployed
- [ ] Storage Rules deployed
- [ ] Authentication methods configured
- [ ] Billing enabled (if needed for your scale)

### Configuration
- [ ] Production Firebase project created (separate from development)
- [ ] `environment.prod.ts` configured with production values
- [ ] Admin users set up via `set-admin.mjs`
- [ ] Proper error handling in place

## 📦 Deployment Options

### Option 1: Firebase Hosting (Recommended)

Firebase Hosting is free, fast, and integrates perfectly with your Firebase backend.

#### Initial Setup

1. **Install Firebase CLI** (if not already installed)
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Initialize Hosting** (if not done)
   ```bash
   firebase init hosting
   ```
   - Select your production Firebase project
   - Set public directory to: `dist/rebuild-homes-srilanka/browser`
   - Configure as single-page app: `Yes`
   - Set up automatic builds: `No` (we'll build manually)

4. **Update firebase.json** (should look like this)
   ```json
   {
     "hosting": {
       "public": "dist/rebuild-homes-srilanka/browser",
       "ignore": [
         "firebase.json",
         "**/.*",
         "**/node_modules/**"
       ],
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ],
       "headers": [
         {
           "source": "**",
           "headers": [
             {
               "key": "X-Content-Type-Options",
               "value": "nosniff"
             },
             {
               "key": "X-Frame-Options",
               "value": "DENY"
             },
             {
               "key": "X-XSS-Protection",
               "value": "1; mode=block"
             }
           ]
         }
       ]
     }
   }
   ```

#### Deploy to Production

```bash
# Build for production
npm run build

# Deploy everything (hosting, rules, indexes)
firebase deploy

# Or deploy specific services
firebase deploy --only hosting
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
firebase deploy --only storage
```

#### View Your Site
```bash
firebase open hosting:site
```

Your site will be available at: `https://your-project-id.web.app`

### Option 2: Custom Domain

1. **In Firebase Console:**
   - Go to Hosting → Connect domain
   - Follow the instructions to verify ownership
   - DNS records will be automatically configured

2. **Deploy to custom domain:**
   ```bash
   npm run build
   firebase deploy
   ```

Your site will be available at your custom domain.

### Option 3: Netlify

1. **Connect Repository**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository

2. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist/rebuild-homes-srilanka/browser`

3. **Environment Variables**
   - Add your Firebase config as environment variables
   - Or ensure `environment.prod.ts` has correct values

4. **Deploy**
   - Netlify will auto-deploy on every push to main

### Option 4: Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   npm run build
   vercel --prod
   ```

3. **Or use Vercel Dashboard**
   - Connect your GitHub repository
   - Configure build settings
   - Auto-deploy on push

## 🔧 Post-Deployment

### Verify Deployment

1. **Check all pages load:**
   - Home page
   - Beneficiary form
   - Donor form
   - Admin dashboard (after logging in as admin)

2. **Test functionality:**
   - User registration
   - User login
   - Form submissions
   - File uploads
   - Admin operations

3. **Check browser console:**
   - No errors
   - No warning messages
   - Firebase initialized correctly

### Set Up Admin Access

```bash
# Set production credentials
export GOOGLE_APPLICATION_CREDENTIALS="$HOME/.configs/firebase/rehome-prod.json"

# Grant admin access
node scripts/set-admin.mjs admin@yourdomain.com --confirm
```

### Monitor Your App

1. **Firebase Console:**
   - Monitor authentication
   - Check Firestore usage
   - Review Storage usage
   - View hosting metrics

2. **Set up alerts:**
   - Firebase Alerts for quota limits
   - Error tracking (consider Sentry or similar)
   - Uptime monitoring

### Enable Firebase App Check (Recommended)

Protects your Firebase resources from abuse:

1. **In Firebase Console:**
   - Go to Build → App Check
   - Click "Get started"
   - Register your web app
   - Select reCAPTCHA provider
   - Get site key and secret key

2. **Add to your app:**
   ```typescript
   // In your app initialization
   import { initializeAppCheck } from 'firebase/app-check';
   
   const appCheck = initializeAppCheck(app, {
     provider: new ReCaptchaV3Provider('YOUR_RECAPTCHA_SITE_KEY'),
     isTokenAutoRefreshEnabled: true
   });
   ```

## 🔄 Continuous Deployment

### GitHub Actions (Automated)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase Hosting

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: your-project-id
```

Add Firebase service account to GitHub Secrets:
- Go to repository Settings → Secrets → New repository secret
- Name: `FIREBASE_SERVICE_ACCOUNT`
- Value: Your service account JSON (entire file content)

## 📊 Performance Optimization

### Before Deployment

1. **Enable production mode:**
   - Ensure `environment.prod.ts` has `production: true`

2. **Optimize images:**
   - Compress images before committing
   - Use appropriate formats (WebP, AVIF)
   - Consider using Firebase Storage with transformations

3. **Code splitting:**
   - Angular handles this automatically
   - Verify lazy loading is working

4. **Bundle analysis:**
   ```bash
   npm run build -- --stats-json
   npx webpack-bundle-analyzer dist/rebuild-homes-srilanka/browser/stats.json
   ```

### After Deployment

1. **Enable caching:**
   - Firebase Hosting handles this automatically
   - Verify cache headers are set

2. **Use CDN:**
   - Firebase Hosting uses Google's CDN automatically

3. **Monitor performance:**
   - Use Lighthouse in Chrome DevTools
   - Check Core Web Vitals
   - Monitor Firebase Performance Monitoring

## 🔐 Security Hardening

### Firestore Rules

Test your rules before deploying:
```bash
firebase emulators:start --only firestore
# Run your app against the emulator
# Test as different user types
```

### Environment Variables

Never commit:
- Firebase service account keys
- API secrets
- Private keys
- Database passwords

### HTTPS Only

Firebase Hosting enforces HTTPS automatically. For custom deployments:
- Always use HTTPS
- Redirect HTTP to HTTPS
- Use HSTS headers

## 🆘 Rollback Procedure

If something goes wrong:

### Firebase Hosting

1. **View deployment history:**
   ```bash
   firebase hosting:sites:list
   ```

2. **Rollback to previous version:**
   - Go to Firebase Console → Hosting
   - View release history
   - Click "..." on a previous release
   - Select "Rollback"

### Manual Rollback

```bash
# Checkout previous working commit
git checkout <previous-commit-hash>

# Rebuild and deploy
npm run build
firebase deploy --only hosting
```

## 📝 Deployment Checklist

Print this and check off before each production deployment:

- [ ] Code reviewed and approved
- [ ] All tests pass
- [ ] Dependencies updated and audited
- [ ] Build completes successfully
- [ ] Environment variables configured for production
- [ ] Firebase rules deployed and tested
- [ ] Service account keys secured
- [ ] Admin users configured
- [ ] Backup of current production taken
- [ ] Deployment completed
- [ ] All pages tested on production
- [ ] Authentication works
- [ ] Forms submit correctly
- [ ] File uploads work
- [ ] Admin dashboard accessible
- [ ] No console errors
- [ ] Performance acceptable
- [ ] Monitoring enabled
- [ ] Team notified of deployment

## 📚 Additional Resources

- [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)
- [Angular Deployment Guide](https://angular.io/guide/deployment)
- [Firebase Security Best Practices](https://firebase.google.com/docs/rules/best-practices)
- [Web Performance Guide](https://web.dev/performance/)

---

**Remember:** Always test in a staging environment before deploying to production!
