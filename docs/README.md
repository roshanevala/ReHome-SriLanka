# ReBuild Homes SriLanka — Docs

Simple, short guides to get productive fast.

## Start Here
- Read: [Project Overview](./1-PROJECT-OVERVIEW.md)
- Setup: [Firebase Setup](./10-FIREBASE-SETUP.md)

## Essential References
- Data model: [Database Schema](./5-DATABASE-SCHEMA.md)
- Roles & access: [User Roles](./6-USER-ROLES-PERMISSIONS.md)
- Security: [Security & Privacy](./7-SECURITY-PRIVACY.md)

## Tips
- Keep credentials out of the repo
- Use `.env.example` to configure local dev
- Follow README for admin claim script usage

## Contribute
See `CONTRIBUTING.md` for guidelines.
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
- **Security**: security@rebuildhomes-srilanka.org

### Documentation Updates
- Located in `/docs` folder
- Markdown format for easy editing
- Version controlled in Git

### Reporting Issues
- Security issues: security@rebuildhomes-srilanka.org
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
   git clone https://github.com/yourusername/ReBuild-Homes-SriLanka.git
   cd ReBuild-Homes-SriLanka
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

This documentation is part of the ReBuild Homes SriLanka project.

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
