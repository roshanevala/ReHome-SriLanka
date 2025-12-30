# Development Setup Guide

Quick reference for developers working on ReBuild Homes SriLanka.

## 🚀 Quick Start

```bash
# Clone and install
git clone https://github.com/roshanevala/ReHome-SriLanka.git
cd ReHome-SriLanka
npm install

# Set up environment
cp src/environments/environment.ts.example src/environments/environment.ts
# Edit environment.ts with your Firebase config

# Run development server
npm run dev
```

## 📁 Project Structure

```
ReHome-SriLanka/
├── src/
│   ├── components/          # Angular components
│   │   ├── admin-dashboard/ # Admin interface
│   │   ├── beneficiary-form/# Beneficiary application form
│   │   ├── donor-form/      # Donor registration form
│   │   ├── header/          # Navigation header
│   │   └── home/            # Landing page
│   ├── services/            # Business logic
│   │   ├── auth.service.ts  # Authentication
│   │   ├── data.service.ts  # Data operations
│   │   └── storage.service.ts # File uploads
│   ├── guards/              # Route protection
│   │   ├── admin.guard.ts   # Admin routes
│   │   └── auth.guard.ts    # Authenticated routes
│   ├── models/              # TypeScript interfaces
│   └── environments/        # Configuration
├── docs/                    # Detailed documentation
├── scripts/                 # Utility scripts
└── public/                  # Static assets
```

## 🔧 Development Commands

```bash
# Development server (http://localhost:4200)
npm run dev

# Build for production
npm run build

# Run with production config
npm run preview

# Firebase commands
firebase login
firebase deploy --only firestore:rules
firebase deploy --only storage
firebase deploy --only hosting
```

## 🧪 Testing Locally

### Test as Beneficiary
1. Navigate to `/beneficiary`
2. Fill out the application form
3. Upload required documents
4. Submit application

### Test as Donor
1. Navigate to `/donor`
2. Fill out registration form
3. Specify donation preferences
4. Submit registration

### Test as Admin
1. Set up admin access (see scripts/README.md)
2. Navigate to `/admin`
3. Review applications
4. Manage matching

## 🗄️ Database Schema

### Collections

**beneficiaries**
```typescript
{
  id: string;
  name: string;
  nic: string;
  phone: string;
  address: {
    street: string;
    city: string;
    district: string;
  };
  gnDivision: string;
  damageLevel: 'partial' | 'complete';
  familySize: number;
  monthlyIncome: number;
  disasterType: string;
  documents: {
    gnLetter: string;      // Storage URL
    damagePhotos: string[];
    nicCopy: string;
  };
  verificationStatus: 'pending' | 'approved' | 'rejected';
  priorityScore: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

**donors**
```typescript
{
  id: string;
  name: string;
  email: string;
  phone: string;
  donorType: 'individual' | 'organization';
  organizationName?: string;
  donationAmount: number;
  donationType: 'full' | 'partial';
  preferredDistrict?: string;
  status: 'pending' | 'matched' | 'completed';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

**matchings**
```typescript
{
  id: string;
  beneficiaryId: string;
  donorIds: string[];
  totalAmount: number;
  status: 'pending' | 'in-progress' | 'completed';
  projectDetails: {
    estimatedCost: number;
    startDate: Timestamp;
    completionDate?: Timestamp;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

## 🔐 Security Rules

Key Firestore rules:
- Users can only read/write their own data
- Admins have full access via custom claims
- Documents must pass validation
- File uploads restricted by size and type

See [firestore.rules](../firestore.rules) for complete rules.

## 🎨 Styling

- **Framework:** Tailwind CSS
- **Config:** `tailwind.config.js`
- **Custom styles:** Use Tailwind utility classes
- **Responsive:** Mobile-first approach

### Common Classes
```css
/* Buttons */
.btn-primary: bg-blue-600 hover:bg-blue-700 text-white

/* Cards */
.card: bg-white rounded-lg shadow-md p-6

/* Forms */
.form-input: border rounded px-3 py-2
```

## 📝 Coding Standards

### TypeScript
- Use strict type checking
- Define interfaces for all data structures
- Avoid `any` type
- Use async/await over promises

### Angular
- Follow [Angular Style Guide](https://angular.io/guide/styleguide)
- One component per file
- Use OnPush change detection where possible
- Unsubscribe from observables

### Naming Conventions
- **Components:** `kebab-case.component.ts`
- **Services:** `kebab-case.service.ts`
- **Interfaces:** `PascalCase`
- **Variables:** `camelCase`
- **Constants:** `UPPER_SNAKE_CASE`

### Git Commits
Follow [Conventional Commits](https://www.conventionalcommits.org/):
```
feat: add beneficiary verification
fix: resolve authentication bug
docs: update setup guide
style: format code with prettier
refactor: simplify matching algorithm
test: add unit tests for auth service
chore: update dependencies
```

## 🐛 Debugging

### Common Issues

**Module not found**
```bash
npm install
```

**Firebase not initialized**
- Check environment.ts configuration
- Verify Firebase services are enabled

**Authentication errors**
- Check Firebase Authentication settings
- Verify security rules are deployed

**Build errors**
```bash
rm -rf .angular/cache node_modules
npm install
```

### Browser DevTools

**Check Firebase Connection:**
```javascript
// In browser console
firebase.app()  // Should show your Firebase config
```

**Check Auth State:**
```javascript
// In browser console
firebase.auth().currentUser  // Shows current user or null
```

### Firebase Debugging

**Check Firestore Rules:**
```bash
firebase deploy --only firestore:rules --debug
```

**View logs:**
```bash
firebase functions:log
```

## 🔗 Useful Resources

- [Angular Documentation](https://angular.io/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [RxJS Documentation](https://rxjs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## 💡 Tips

1. **Use Angular DevTools:** Install the [Angular DevTools](https://angular.io/guide/devtools) browser extension
2. **Hot Reload:** Development server auto-reloads on file changes
3. **Console Logging:** Use `console.log()` for debugging, but remove before committing
4. **Firebase Emulators:** Use local emulators for testing without affecting production
5. **Git Branches:** Create feature branches, don't commit directly to main

## 🤝 Getting Help

- Read the [main documentation](../docs/README.md)
- Check [existing issues](https://github.com/roshanevala/ReHome-SriLanka/issues)
- Ask in [Discussions](https://github.com/roshanevala/ReHome-SriLanka/discussions)
- Review [CONTRIBUTING.md](../CONTRIBUTING.md)
