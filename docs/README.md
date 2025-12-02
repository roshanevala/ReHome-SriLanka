# ReHome Sri Lanka - Documentation Index

Welcome to the ReHome Sri Lanka documentation. This comprehensive guide covers all aspects of the platform that connects disaster-affected families with donors who want to help rebuild homes.

**🔥 Built with Firebase** - This project uses Firebase for authentication, database, storage, and hosting.

---

## 📚 Documentation Structure

### 1. [Project Overview](./1-PROJECT-OVERVIEW.md)
**Start here if you're new to the project**

Learn about:
- Vision and core concept
- System roles (Beneficiary, Donor, Admin/Verifier)
- Key features
- Ethical principles

---

### 2. [Data Requirements](./2-DATA-REQUIREMENTS.md)
**Complete data collection specifications**

Covers:
- Beneficiary application form fields
- Donor registration requirements
- Verification records
- Project tracking data
- Validation rules

---

### 3. [Verification Process](./3-VERIFICATION-PROCESS.md)
**Critical fraud prevention workflow**

Details:
- Phone verification (Firebase OTP)
- Document review procedures
- Field visit process
- Approval & priority scoring
- Rejection handling
- Quality assurance

---

### 4. [Matching & Project Management](./4-MATCHING-PROJECT-MANAGEMENT.md)
**How donors and families are connected**

Includes:
- Donor selection options (full/partial/pooled funding)
- Matching workflow
- Construction phases & milestones
- Progress tracking
- Completion & handover
- Handling delays & issues

---

### 5. [Database Schema](./5-DATABASE-SCHEMA.md)
**Firebase Firestore structure**

Contains:
- Firestore collections & subcollections
- Document structures (TypeScript interfaces)
- Security rules overview
- Indexes for performance
- Data relationships
- Backup strategy

---

### 6. [User Roles & Permissions](./6-USER-ROLES-PERMISSIONS.md)
**Access control and security**

Defines:
- Super Admin capabilities
- Admin permissions
- Verifier access
- Donor permissions
- Beneficiary access
- Permission matrix
- Role assignment rules

---

### 7. [Security & Privacy](./7-SECURITY-PRIVACY.md)
**Protecting sensitive data**

Explains:
- Firebase Authentication security
- Firestore security rules
- Storage security rules
- Data anonymization
- Privacy compliance (GDPR-like)
- Photo/document security
- Incident response
- Security monitoring

---

### 8. [Firebase SDK Integration](./8-API-SPECIFICATION.md)
**Using Firebase services**

Documents:
- Firebase Authentication methods
- Firestore queries and writes
- Firebase Storage operations
- Cloud Functions (callable & triggers)
- Real-time listeners
- Offline support
- Error handling

---

### 9. [Implementation Roadmap](./9-IMPLEMENTATION-ROADMAP.md)
**Build plan from MVP to production**

Outlines:
- Phase 1: MVP with Firebase (4-6 weeks)
- Phase 2: Enhanced features (6-8 weeks)
- Phase 3: Advanced features (8-10 weeks)
- Phase 4: Scale & optimize
- Firebase cost estimates
- Success metrics
- Go-live checklist

---

### 10. [Firebase Setup Guide](./10-FIREBASE-SETUP.md) 🔥
**Complete Firebase configuration**

Step-by-step:
- Firebase project creation
- Authentication setup (Email, Phone, Google)
- Firestore database structure
- Security rules (Firestore & Storage)
- Cloud Functions examples
- Firebase Hosting deployment
- Monitoring & analytics
- Backup configuration
- Testing with emulators

---

## 🎯 Quick Start Guides

### For Developers
1. Read [Project Overview](./1-PROJECT-OVERVIEW.md)
2. **Follow [Firebase Setup Guide](./10-FIREBASE-SETUP.md)** 🔥
3. Review [Database Schema](./5-DATABASE-SCHEMA.md) (Firestore)
4. Check [Firebase SDK Integration](./8-API-SPECIFICATION.md)
5. Follow [Implementation Roadmap](./9-IMPLEMENTATION-ROADMAP.md)

### For Product Managers
1. Understand [Project Overview](./1-PROJECT-OVERVIEW.md)
2. Review [Data Requirements](./2-DATA-REQUIREMENTS.md)
3. Study [Verification Process](./3-VERIFICATION-PROCESS.md)
4. Plan with [Implementation Roadmap](./9-IMPLEMENTATION-ROADMAP.md)

### For Admins/Operators
1. Learn [User Roles & Permissions](./6-USER-ROLES-PERMISSIONS.md)
2. Master [Verification Process](./3-VERIFICATION-PROCESS.md)
3. Understand [Matching & Project Management](./4-MATCHING-PROJECT-MANAGEMENT.md)

### For Security Team
1. Review [Security & Privacy](./7-SECURITY-PRIVACY.md)
2. Check [User Roles & Permissions](./6-USER-ROLES-PERMISSIONS.md)
3. Audit [Firebase Setup Guide](./10-FIREBASE-SETUP.md) security rules

---

## 📖 Key Concepts

### The Three Sides
- **Beneficiaries**: People who lost homes in disasters
- **Donors**: Individuals/organizations wanting to help
- **Admins/Verifiers**: Trusted team ensuring legitimacy

### Core Workflow
1. **Application**: Beneficiary submits details + evidence
2. **Verification**: Admin/verifier checks authenticity
3. **Approval**: Priority score assigned, added to list
4. **Matching**: Donor selects family to sponsor
5. **Construction**: House built in tracked phases
6. **Completion**: Family gets home, donor gets report

### Priority Scoring
Families scored 0-100 based on:
- Damage level (fully destroyed vs partial)
- Family vulnerability (children, elderly, disabled)
- Economic situation (income level)
- Special circumstances

---

## 🔐 Security First (Firebase)

**Firebase Built-in Security**:
- Authentication: Industry-standard OAuth 2.0
- Firestore Security Rules: Database-level access control
- Storage Security Rules: File-level permissions
- Automatic HTTPS/SSL
- DDoS protection

**Additional Protection**:
- NIC, addresses, phone numbers: Client-side encrypted before storing
- Donor financial info: Private with security rules
- Photos: EXIF removed, watermarked, access controlled
- Access: Role-based with custom claims, all actions logged
- Backups: Automated daily backups
- Donor financial info: Private
- Photos: EXIF removed, watermarked
- Access: Role-based, logged
- Backups: Encrypted, tested regularly

---

## 🌟 Success Metrics

**MVP Goals**:
- 50+ applications
- 20+ approved families
- 10+ registered donors
- 5+ matched houses

**Long-term Vision**:
- 500+ families helped
- 100+ houses completed
- $1M+ total contributions
- <16 weeks average construction time
- >90% satisfaction rate

---

## 🛠️ Technology Stack

**Backend**: Node.js/Python/Java + PostgreSQL  
**Frontend**: Angular + Tailwind CSS  
**Storage**: AWS S3 or similar  
**Hosting**: AWS/GCP/DigitalOcean  
**Auth**: JWT + MFA for admins  

---

## 📞 Support & Contact

### Development Team
- **Technical Lead**: [Email]
- **Project Manager**: [Email]
- **Security**: security@rehome-srilanka.org

### Documentation Updates
- Located in `/docs` folder
- Markdown format for easy editing
- Version controlled in Git

### Reporting Issues
- Security issues: security@rehome-srilanka.org
- Bug reports: GitHub Issues
- Feature requests: GitHub Discussions

---

## 📝 Document Conventions

### Status Indicators
- ✅ Implemented/Complete
- 🔄 In Progress
- ⏳ Planned
- ❌ Not Planned/Removed

### Code Examples
- Language-specific syntax highlighting
- Real-world examples
- Best practices shown

### Updates
- Last updated: December 2024
- Review cycle: Quarterly
- Maintained by: Development team

---

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ReHome-SriLanka.git
   cd ReHome-SriLanka
   ```

2. **Read the documentation**
   - Start with [Project Overview](./1-PROJECT-OVERVIEW.md)
   - Review relevant sections for your role

3. **Set up development environment**
   - Follow [Implementation Roadmap](./9-IMPLEMENTATION-ROADMAP.md)
   - Install dependencies
   - Configure database

4. **Start building**
   - Follow MVP feature list
   - Refer to [API Specification](./8-API-SPECIFICATION.md)
   - Test thoroughly

---

## 📄 License & Usage

This documentation is part of the ReHome Sri Lanka project.

**Purpose**: Help rebuild homes for disaster-affected families in Sri Lanka

**Usage**: 
- Free for non-profit humanitarian use
- Commercial use requires permission
- Must maintain data protection standards

---

## 🙏 Acknowledgments

This project aims to help families rebuild their lives after disasters. Every line of code, every verification, every donation makes a real difference.

**Thank you to**:
- Developers building the platform
- Verifiers ensuring integrity
- Donors providing resources
- Families trusting the process

---

## 📋 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Dec 2024 | Initial comprehensive documentation |

---

## 🔗 Related Resources

- **GitHub Repository**: [Link]
- **Live Demo**: [Link when available]
- **User Guides**: [Link to end-user docs]
- **Training Videos**: [Link when available]

---

**Remember**: This isn't just software—it's a lifeline for families. Build with care, verify with diligence, and always prioritize dignity and privacy.
