# 🎯 Quick Reference

Essential commands and information for ReBuild Homes SriLanka.

## 📦 Installation

```bash
git clone https://github.com/roshanevala/ReHome-SriLanka.git
cd ReHome-SriLanka
npm install
cp src/environments/environment.ts.example src/environments/environment.ts
# Edit environment.ts with your Firebase config
npm run dev
```

## 🔧 Common Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (port 4200) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `firebase login` | Login to Firebase CLI |
| `firebase deploy` | Deploy everything to Firebase |
| `firebase deploy --only hosting` | Deploy hosting only |
| `firebase deploy --only firestore:rules` | Deploy Firestore rules |
| `firebase deploy --only firestore:indexes` | Deploy Firestore indexes |
| `node scripts/set-admin.mjs <email> --confirm` | Grant admin access |

## 📁 Key Files & Directories

| Path | Purpose |
|------|---------|
| `src/components/` | Angular components |
| `src/services/` | Business logic services |
| `src/guards/` | Route protection |
| `src/models/` | TypeScript interfaces |
| `src/environments/` | Firebase configuration |
| `docs/` | Detailed documentation |
| `scripts/` | Utility scripts |
| `firestore.rules` | Database security rules |
| `storage.rules` | Storage security rules |
| `firebase.json` | Firebase configuration |

## 🔐 Environment Setup

1. Get Firebase config from: Firebase Console → Project Settings → Your apps
2. Copy to `src/environments/environment.ts`:
   ```typescript
   export const environment = {
     production: false,
     firebase: {
       apiKey: "YOUR_API_KEY",
       authDomain: "your-project.firebaseapp.com",
       projectId: "your-project-id",
       storageBucket: "your-project.firebasestorage.app",
       messagingSenderId: "123456789",
       appId: "1:123:web:abc",
       measurementId: "G-ABC123"
     }
   };
   ```

## 🚀 Admin Setup

```bash
# 1. Get service account key from Firebase Console
# 2. Save it securely (e.g., ~/.configs/firebase/key.json)
# 3. Set environment variable
export GOOGLE_APPLICATION_CREDENTIALS="$HOME/.configs/firebase/key.json"

# 4. Grant admin access
node scripts/set-admin.mjs user@example.com --confirm

# 5. User must sign out and sign back in
```

## 🗄️ Database Collections

| Collection | Purpose |
|------------|---------|
| `beneficiaries` | Families seeking housing support |
| `donors` | Individuals/organizations offering help |
| `matchings` | Donor-beneficiary pairings |
| `users` | User authentication data |

## 🛡️ Security Rules Quick Reference

**Firestore:**
- Users can read/write their own data only
- Admins have full access via custom claims
- All writes must pass validation

**Storage:**
- Authenticated users can upload to their own folders
- Max file size: 10MB
- Allowed types: images, PDFs

## 📱 URLs

| Route | Purpose | Access |
|-------|---------|--------|
| `/` | Home page | Public |
| `/beneficiary` | Beneficiary form | Public |
| `/donor` | Donor form | Public |
| `/admin` | Admin dashboard | Admin only |
| `/login` | Login page | Public |

## 🐛 Troubleshooting Quick Fixes

| Problem | Solution |
|---------|----------|
| Module not found | `rm -rf node_modules && npm install` |
| Port in use | `ng serve --port 4300` |
| Firebase errors | Check `environment.ts` config |
| Build fails | `rm -rf .angular/cache && npm run build` |
| Admin not working | Sign out and back in after running set-admin |

## 📚 Documentation Links

- [Full Setup Guide](SETUP.md)
- [Development Guide](docs/DEVELOPMENT.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Security Policy](SECURITY.md)
- [Contributing Guidelines](CONTRIBUTING.md)
- [Scripts Documentation](scripts/README.md)

## 🆘 Getting Help

1. Check [SETUP.md](SETUP.md) troubleshooting section
2. Search [existing issues](https://github.com/roshanevala/ReHome-SriLanka/issues)
3. Review [documentation](docs/README.md)
4. Create a [new issue](https://github.com/roshanevala/ReHome-SriLanka/issues/new/choose)
5. Ask in [Discussions](https://github.com/roshanevala/ReHome-SriLanka/discussions)

## ⚡ Pro Tips

- Use Angular DevTools browser extension for debugging
- Run `npm audit` regularly to check for vulnerabilities
- Keep development and production Firebase projects separate
- Store service account keys outside the project directory
- Use `--dry-run` flag with scripts before `--confirm`
- Test security rules in Firebase emulator before deploying
- Always build before deploying: `npm run build && firebase deploy`

## 🔑 Important Reminders

- ❌ Never commit service account keys
- ❌ Never commit actual Firebase credentials
- ✅ Always use `.example` template files
- ✅ Keep environment files in `.gitignore`
- ✅ Use different Firebase projects for dev/prod
- ✅ Deploy security rules before going live

---

For complete information, see the [full documentation](docs/README.md).
