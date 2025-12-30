# Security Policy

## Supported Versions

We release patches for security vulnerabilities for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: |
| < Latest| :x:                |

## Reporting a Vulnerability

We take the security of ReBuild Homes SriLanka seriously. If you discover a security vulnerability, please follow these steps:

### 🔒 Please Do NOT:
- Open a public GitHub issue for security vulnerabilities
- Disclose the vulnerability publicly before it has been addressed

### ✅ Please Do:
1. **Email the security issue** to the maintainers at: roshanevala@github (or create a private security advisory on GitHub)
2. **Include the following information:**
   - Type of vulnerability
   - Full paths of source file(s) related to the vulnerability
   - Location of the affected source code (tag/branch/commit or direct URL)
   - Step-by-step instructions to reproduce the issue
   - Proof-of-concept or exploit code (if possible)
   - Impact of the issue, including how an attacker might exploit it

3. **Wait for a response** - We aim to respond within 48 hours
4. **Work with us** to understand and resolve the issue

## What to Expect

- **Acknowledgment**: We'll acknowledge your email within 48 hours
- **Updates**: We'll keep you informed about our progress
- **Credit**: We'll credit you in the fix announcement (unless you prefer to remain anonymous)
- **Timeline**: We aim to release a fix within 30 days of the initial report

## Security Best Practices for Users

### Firebase Configuration
- **Never commit** Firebase credentials to version control
- Use environment variables for sensitive configuration
- Keep `serviceAccountKey.json` outside the project directory
- Restrict Firebase Security Rules appropriately
- Enable Firebase App Check for production

### Authentication
- Use strong passwords
- Enable two-factor authentication for admin accounts
- Regularly review user access and permissions
- Sign out users after granting admin claims

### Deployment
- Use HTTPS only in production
- Enable Firebase Security Rules before deploying
- Regularly update dependencies: `npm audit` and `npm audit fix`
- Review and rotate service account keys regularly
- Use different Firebase projects for development and production

### Access Control
- Limit admin access to trusted individuals only
- Store admin service account keys securely
- Use Firebase custom claims sparingly
- Regularly audit user roles and permissions

## Known Security Considerations

### API Keys in Code
Firebase API keys in `environment.ts` are safe to expose in client-side code as they are meant to identify your Firebase project. However:
- Security comes from Firebase Security Rules, not API key secrecy
- Always configure proper Firestore and Storage security rules
- Use Firebase App Check for additional protection against abuse

### Service Account Keys
Service account keys provide full admin access to your Firebase project:
- Never commit these to version control (they're in `.gitignore`)
- Store them securely outside the project directory
- Restrict file permissions: `chmod 600 serviceAccountKey.json`
- Use different keys for each environment
- Rotate keys regularly

## Security Checklist

Before deploying to production:

- [ ] Firebase Security Rules are configured and deployed
- [ ] Service account keys are stored securely (not in repo)
- [ ] Environment files with credentials are in `.gitignore`
- [ ] HTTPS is enforced
- [ ] Dependencies are up to date (`npm audit`)
- [ ] Admin access is limited to trusted individuals
- [ ] Firebase App Check is enabled
- [ ] Sensitive user data is properly protected
- [ ] Regular security audits are scheduled

## Dependencies

We regularly monitor and update our dependencies. If you discover a vulnerability in a dependency:
1. Check if we're using the vulnerable version
2. Report it following the process above
3. Submit a pull request with the fix if possible

## Resources

- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [Firebase Security Best Practices](https://firebase.google.com/docs/rules/best-practices)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [npm Security Best Practices](https://docs.npmjs.com/packages-and-modules/securing-your-code)

## Questions?

If you have questions about security but don't have a vulnerability to report, please:
- Check our [documentation](docs/7-SECURITY-PRIVACY.md)
- Open a [GitHub Discussion](https://github.com/roshanevala/ReHome-SriLanka/discussions)
- Create a [question issue](https://github.com/roshanevala/ReHome-SriLanka/issues/new/choose)

---

Thank you for helping keep ReBuild Homes SriLanka and its users safe! 🔒
