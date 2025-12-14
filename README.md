# 🏠 ReBuild Homes SriLanka

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Angular](https://img.shields.io/badge/Angular-21.0-DD0031?logo=angular)](https://angular.io/)
[![Firebase](https://img.shields.io/badge/Firebase-12.6-FFCA28?logo=firebase)](https://firebase.google.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)

> **An open-source platform connecting disaster-affected families with donors to rebuild homes in Sri Lanka.**

## 🌟 About The Project

ReBuild Homes SriLanka is a transparent, verification-based platform that connects people who lost their homes in disasters with donors who want to help rebuild. While we initially launched this as a live service, we discovered that similar platforms with more extensive features already exist in the ecosystem. To maximize impact, we're open-sourcing this project so communities, NGOs, and developers worldwide can use, adapt, and improve it for their disaster relief efforts.

### ✨ Key Features

- **🔐 Dual Portal System**
  - Beneficiary portal for families to submit verified applications
  - Donor portal for individuals/organizations to offer support
  
- **✅ Verification System**
  - Document verification (GN letters, damage photos)
  - Application review and approval workflow
  - Priority scoring based on vulnerability
  
- **🤝 Smart Matching**
  - Connect verified families with donors
  - Full or partial house sponsorship
  - Pooled funding for high-priority cases
  
- **📊 Admin Dashboard**
  - Application management
  - Donor tracking
  - Progress monitoring
  - Analytics and reporting
  
- **🔒 Privacy & Security**
  - Firebase Authentication
  - Role-based access control (Admin, Beneficiary, Donor)
  - Firestore security rules
  - Protected sensitive data

### 🛠️ Built With

- **Frontend:** Angular 21 with TypeScript
- **Backend:** Firebase (Firestore, Authentication, Storage, Hosting)
- **Styling:** Tailwind CSS
- **State Management:** RxJS

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/roshanevala/ReHome-SriLanka.git
   cd ReHome-SriLanka
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Enable Storage
   - Copy your Firebase configuration

4. **Configure environment**
   - Update `src/environments/environment.ts` with your Firebase config:
   ```typescript
   export const environment = {
     production: false,
     firebase: {
       apiKey: "your-api-key",
       authDomain: "your-auth-domain",
       projectId: "your-project-id",
       storageBucket: "your-storage-bucket",
       messagingSenderId: "your-messaging-sender-id",
       appId: "your-app-id"
     }
   };
   ```

5. **Deploy Firestore rules and indexes**
   ```bash
   firebase deploy --only firestore:rules
   firebase deploy --only firestore:indexes
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```
   Navigate to `http://localhost:4200/`

### Setting Up Admin Access

Use the hardened admin utility to grant `admin=true` custom claims:

```bash
# 1) Point to your service account JSON (do NOT commit it)
export GOOGLE_APPLICATION_CREDENTIALS="$HOME/.configs/firebase/rehome-admin.json"

# 2) Optionally set your project id (will be inferred from creds otherwise)
export FIREBASE_PROJECT_ID="your-project-id"

# 3) Preview (dry run)
node scripts/set-admin.mjs user@example.com --dry-run

# 4) Apply change (requires --confirm)
node scripts/set-admin.mjs user@example.com --confirm
```

Notes:
- The user must reauthenticate (sign out/in) to refresh tokens after claims change.
- Store your service account securely outside the repo.

## 📖 Documentation

Comprehensive documentation is available in the `/docs` folder:

- [Project Overview](docs/1-PROJECT-OVERVIEW.md)
- [Data Requirements](docs/2-DATA-REQUIREMENTS.md)
- [Verification Process](docs/3-VERIFICATION-PROCESS.md)
- [Database Schema](docs/5-DATABASE-SCHEMA.md)
- [User Roles & Permissions](docs/6-USER-ROLES-PERMISSIONS.md)
- [Security & Privacy](docs/7-SECURITY-PRIVACY.md)
- [Firebase Setup Guide](docs/10-FIREBASE-SETUP.md)

## 🎯 Use Cases

This platform can be adapted for:

- Natural disaster relief (floods, earthquakes, cyclones)
- War/conflict housing reconstruction
- Community housing programs
- NGO-managed relief operations
- Government disaster response initiatives

## 🤝 Contributing

We welcome contributions from the community! Whether you're fixing bugs, adding features, or improving documentation, your help is appreciated.

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with the intention to help disaster-affected families in Sri Lanka
- Inspired by the resilience of communities recovering from natural disasters
- Thanks to all contributors and supporters

## 📧 Contact

Roshane De Silva - [@roshanevala](https://github.com/roshanevala)

Project Link: [https://github.com/roshanevala/ReHome-SriLanka](https://github.com/roshanevala/ReHome-SriLanka)

---

**Note:** This platform was initially developed as a live service but is now open-sourced to enable wider adoption and community-driven improvements. We encourage organizations and developers to use this as a foundation for their disaster relief initiatives.
