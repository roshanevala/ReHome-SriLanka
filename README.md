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

### Quick Setup

For detailed setup instructions, see our **[📖 Setup Guide](SETUP.md)**.

```bash
# Clone repository
git clone https://github.com/roshanevala/ReHome-SriLanka.git
cd ReHome-SriLanka

# Install dependencies
npm install

# Copy environment templates
cp src/environments/environment.ts.example src/environments/environment.ts
cp src/environments/environment.prod.ts.example src/environments/environment.prod.ts

# Add your Firebase config to environment.ts
# Then run the dev server
npm run dev
```

Visit `http://localhost:4200/` to see the app running!

## 📖 Documentation

Comprehensive documentation is available in the [`/docs`](docs/) directory:

### Essential Guides
- **[🚀 Setup Guide](SETUP.md)** - Step-by-step installation instructions
- **[💻 Development Guide](docs/DEVELOPMENT.md)** - Developer reference and best practices
- **[🚢 Deployment Guide](docs/DEPLOYMENT.md)** - Production deployment instructions
- **[🔒 Security Policy](SECURITY.md)** - Security best practices and vulnerability reporting

### Project Documentation
- **[Project Overview](docs/1-PROJECT-OVERVIEW.md)** - System architecture and features
- **[Firebase Setup](docs/10-FIREBASE-SETUP.md)** - Detailed Firebase configuration
- **[Database Schema](docs/5-DATABASE-SCHEMA.md)** - Firestore data structure
- **[User Roles & Permissions](docs/6-USER-ROLES-PERMISSIONS.md)** - Access control system
- **[Security & Privacy](docs/7-SECURITY-PRIVACY.md)** - Data protection measures
- **[API Specification](docs/8-API-SPECIFICATION.md)** - Service interfaces
- **[Implementation Roadmap](docs/9-IMPLEMENTATION-ROADMAP.md)** - Development phases

### Scripts & Tools
- **[Scripts Documentation](scripts/README.md)** - Admin utility scripts guide

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

### Quick Start for Contributors
1. Check our [Setup Guide](SETUP.md) for detailed installation instructions
2. Read the [Contributing Guidelines](CONTRIBUTING.md)
3. Browse [existing issues](https://github.com/roshanevala/ReHome-SriLanka/issues) or create a new one
4. Fork the repository and create your feature branch
5. Submit a pull request with a clear description of your changes

## 🐛 Troubleshooting

### Common Issues

**Build fails after cloning**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Firebase connection errors**
- Verify your Firebase config in `src/environments/environment.ts`
- Ensure Firestore rules are deployed: `firebase deploy --only firestore:rules`
- Check that all Firebase services (Auth, Firestore, Storage) are enabled

**Environment file errors**
- Copy the `.example` files: `cp src/environments/environment.ts.example src/environments/environment.ts`
- Fill in your Firebase credentials from Firebase Console
- Ensure no trailing commas or syntax errors in the config

**Admin dashboard not accessible**
- Run the admin setup script: `node scripts/set-admin.mjs your@email.com --confirm`
- Sign out and sign back in to refresh your token
- See [scripts/README.md](scripts/README.md) for detailed admin setup instructions

**Port 4200 already in use**
```bash
ng serve --port 4300
```

For more troubleshooting help, see [SETUP.md](SETUP.md) or [create an issue](https://github.com/roshanevala/ReHome-SriLanka/issues/new/choose).

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
