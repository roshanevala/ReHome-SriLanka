# 🚀 Quick Setup Guide

This guide will help you get ReBuild Homes SriLanka running on your local machine in just a few minutes.

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download here](https://git-scm.com/)
- **A Firebase account** - [Sign up here](https://firebase.google.com/)
- **A code editor** (VS Code recommended)

## 🔧 Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone https://github.com/roshanevala/ReHome-SriLanka.git
cd ReHome-SriLanka
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including Angular, Firebase, and other dependencies.

### 3. Set Up Firebase Project

#### 3.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter a project name (e.g., "my-rebuild-homes")
4. Google Analytics is optional - you can disable it for testing
5. Click **"Create project"**

#### 3.2 Enable Firebase Services

Once your project is created:

**Authentication:**
1. In Firebase Console, go to **Build** → **Authentication**
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab
4. Enable **"Email/Password"**
5. Click **"Save"**

**Firestore Database:**
1. Go to **Build** → **Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (we'll set up proper rules later)
4. Select a location close to your users
5. Click **"Enable"**

**Storage:**
1. Go to **Build** → **Storage**
2. Click **"Get started"**
3. Choose **"Start in test mode"**
4. Click **"Done"**

#### 3.3 Get Firebase Configuration

1. In Firebase Console, click the **gear icon** ⚙️ → **Project settings**
2. Scroll down to **"Your apps"**
3. Click the **web icon** `</>` to add a web app
4. Register app with a nickname (e.g., "ReHome Web")
5. **Don't** check "Firebase Hosting" yet
6. Click **"Register app"**
7. Copy the `firebaseConfig` object - you'll need these values

### 4. Configure Environment Files

#### 4.1 Copy Template Files

```bash
cp src/environments/environment.ts.example src/environments/environment.ts
cp src/environments/environment.prod.ts.example src/environments/environment.prod.ts
```

#### 4.2 Update Configuration

Open `src/environments/environment.ts` and replace the placeholder values with your Firebase config:

```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: "AIza...",              // From Firebase Console
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.firebasestorage.app",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123",
    measurementId: "G-XXXXXXXXXX"   // Optional
  }
};
```

Do the same for `src/environments/environment.prod.ts` (set `production: true`).

### 5. Deploy Firebase Security Rules

#### 5.1 Install Firebase CLI

```bash
npm install -g firebase-tools
```

#### 5.2 Login to Firebase

```bash
firebase login
```

#### 5.3 Initialize Firebase Project

```bash
firebase init
```

Select:
- **Firestore** (Database rules and indexes)
- **Storage** (Storage rules)
- Use **existing project** → select your Firebase project
- Accept default files (firestore.rules, firestore.indexes.json, storage.rules)

#### 5.4 Deploy Rules

```bash
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
firebase deploy --only storage
```

### 6. Run the Development Server

```bash
npm run dev
```

The application will start at `http://localhost:4200/`

### 7. Create Your First Admin User

#### 7.1 Register a User

1. Open `http://localhost:4200/` in your browser
2. Register a new account with your email
3. Note the email you used

#### 7.2 Get Service Account Key

1. In Firebase Console → **Project settings** → **Service accounts**
2. Click **"Generate new private key"**
3. Save the JSON file as `rehome-admin.json` in a secure location (e.g., `~/.configs/firebase/`)
4. **NEVER commit this file to git!**

#### 7.3 Set Admin Permissions

```bash
# Set the path to your service account key
export GOOGLE_APPLICATION_CREDENTIALS="$HOME/.configs/firebase/rehome-admin.json"

# Grant admin access (replace with your email)
node scripts/set-admin.mjs your-email@example.com --confirm
```

#### 7.4 Refresh Your Session

1. Sign out of the application
2. Sign back in
3. You should now see the **Admin Dashboard** link

## 🎉 You're Ready!

Your local development environment is now set up! You can:

- Create beneficiary applications
- Register as a donor
- Access the admin dashboard (if you set up admin access)
- Test the matching system

## 🔍 Verify Setup

Visit these pages to ensure everything works:

- **Home:** `http://localhost:4200/`
- **Beneficiary Form:** `http://localhost:4200/beneficiary`
- **Donor Form:** `http://localhost:4200/donor`
- **Admin Dashboard:** `http://localhost:4200/admin` (requires admin access)

## 📚 Next Steps

- Read the [full documentation](docs/README.md)
- Review [Firebase Setup Guide](docs/10-FIREBASE-SETUP.md) for production configuration
- Check [Database Schema](docs/5-DATABASE-SCHEMA.md) to understand data structure
- Review [Security & Privacy](docs/7-SECURITY-PRIVACY.md) before deploying to production

## ❓ Troubleshooting

### Build Errors

**Error: Cannot find module**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Environment file errors**
- Ensure you copied the `.example` files correctly
- Check all Firebase config values are filled in
- Verify no trailing commas in the config object

### Firebase Connection Issues

**Error: Missing or insufficient permissions**
- Ensure Firestore rules are deployed: `firebase deploy --only firestore:rules`
- Check that you're using the correct Firebase project

**Error: Firebase app not initialized**
- Verify your Firebase config in `environment.ts`
- Check that all required fields are present
- Ensure no extra spaces or quotes in config values

### Authentication Issues

**Can't sign in after registering**
- Check that Email/Password auth is enabled in Firebase Console
- Verify the `authDomain` in your config is correct

**Admin dashboard not showing**
- Ensure you ran the `set-admin.mjs` script successfully
- Sign out and sign back in to refresh your token
- Check browser console for errors

### Port Already in Use

```bash
# Kill process using port 4200
lsof -ti:4200 | xargs kill -9

# Or use a different port
ng serve --port 4300
```

## 🆘 Getting Help

- Check [existing issues](https://github.com/roshanevala/ReHome-SriLanka/issues)
- Create a [new issue](https://github.com/roshanevala/ReHome-SriLanka/issues/new)
- Review [Firebase documentation](https://firebase.google.com/docs)
- Ask questions in [Discussions](https://github.com/roshanevala/ReHome-SriLanka/discussions)
