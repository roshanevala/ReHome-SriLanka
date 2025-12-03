# Security & Privacy Guidelines

## Overview
This document outlines security measures and privacy protections for the ReBuild Homes SriLanka system.

---

## 1. Data Protection Principles

### Personal Data Categories

#### Highly Sensitive
- NIC numbers
- Exact home addresses
- Phone numbers
- Bank account details
- Financial records

#### Sensitive
- Family member details
- Income information
- Disability status
- Photos of people

#### Public
- District/Province
- Disaster type
- Priority level (without personal details)
- Project progress (anonymized)

---

## 2. Data Collection & Storage

### Encryption

#### In Transit
- **HTTPS/TLS 1.3**: All data transmission
- **Certificate Pinning**: Mobile apps
- **No HTTP**: Redirect all traffic to HTTPS

#### At Rest
- **Database Encryption**: AES-256 for all tables
- **File Encryption**: Photos and documents encrypted
- **Backup Encryption**: All backups encrypted
- **Key Management**: Use AWS KMS or similar

### Storage Best Practices

```typescript
// Example: Store NIC encrypted
interface BeneficiarySecureData {
  nic_encrypted: string;  // Encrypted NIC
  phone_encrypted: string; // Encrypted phone
  address_encrypted: string; // Encrypted address
}

// Decrypt only when needed
function decryptNIC(encrypted: string, key: string): string {
  // Use AES-256 decryption
  return decrypt(encrypted, key);
}
```

### File Upload Security
- **Virus Scanning**: Scan all uploads
- **File Type Validation**: Only allow JPG, PNG, PDF
- **Size Limits**: Max 5MB per file
- **Filename Sanitization**: Remove special characters
- **Separate Storage**: Keep files separate from database
- **Access Control**: Signed URLs with expiration

---

## 3. Authentication & Authorization

### Password Requirements
- Minimum 8 characters
- Must include: uppercase, lowercase, number, special character
- Cannot be common passwords (use dictionary check)
- Cannot reuse last 5 passwords
- Expire after 90 days (admins only)

### Multi-Factor Authentication (MFA)

**Required For**:
- Super Admin (always)
- Admin (always)
- Verifiers (optional but recommended)

**Methods**:
- SMS OTP
- Authenticator app (Google Authenticator, Authy)
- Email OTP (fallback)

### Session Management
```typescript
interface Session {
  token: string;
  userId: string;
  role: string;
  createdAt: Date;
  expiresAt: Date;
  ipAddress: string;
  userAgent: string;
}

// Implement session validation
function validateSession(token: string): boolean {
  const session = getSession(token);
  if (!session) return false;
  if (session.expiresAt < new Date()) return false;
  if (session.ipAddress !== getCurrentIP()) {
    // Flag suspicious activity
    logSecurityEvent('session_ip_mismatch', session.userId);
    return false;
  }
  return true;
}
```

### Failed Login Protection
- Lock account after 5 failed attempts
- Increase delay between attempts (exponential backoff)
- CAPTCHA after 3 failures
- Email notification to user
- Admin notification for repeated failures

---

## 4. Access Control

### Data Anonymization for Donors

When showing beneficiary data to donors, remove:
```typescript
interface BeneficiaryPublicView {
  familyCode: string;         // BEN-2024-1234 (NOT real name)
  district: string;           // OK
  gnDivision: string;         // OK (but not exact address)
  disasterType: string;       // OK
  damageLevel: string;        // OK
  familySize: number;         // OK
  childrenCount: number;      // OK
  elderlyCount: number;       // OK
  priorityLevel: string;      // OK
  estimatedCost: number;      // OK
  photos: string[];           // OK (but faces should be blurred)
  story: string;              // OK (vetted by admin)
  // REMOVED:
  // - fullName
  // - nicNumber
  // - phoneNumber
  // - exactAddress
  // - incomeAmount (only range shown)
}
```

### IP Whitelisting (Optional)
For Super Admins, allow access only from specific IPs:
```typescript
const ADMIN_ALLOWED_IPS = [
  '192.168.1.0/24',  // Office network
  '10.0.0.0/8',      // VPN range
];

function checkIPWhitelist(ip: string, role: string): boolean {
  if (role === 'super_admin') {
    return isIPInRanges(ip, ADMIN_ALLOWED_IPS);
  }
  return true; // Other roles not restricted
}
```

---

## 5. Privacy Compliance

### GDPR-like Principles (Best Practices)

#### 1. Data Minimization
Collect only what's necessary:
- ✅ Need NIC for verification → Collect it
- ❌ Don't need birth date if age is enough → Don't collect it

#### 2. Purpose Limitation
Use data only for stated purpose:
- ✅ NIC used for verification
- ❌ NIC not sold to third parties
- ❌ Phone not used for marketing

#### 3. Data Retention
```typescript
// Retention policy
const RETENTION_POLICY = {
  active_applications: 'indefinite',
  rejected_applications: '6_months',
  audit_logs: '2_years',
  completed_projects: 'indefinite',
  user_sessions: '30_days',
};

// Auto-delete old data
async function cleanupOldData() {
  // Delete rejected applications older than 6 months
  await deleteRejectedOlderThan(6, 'months');
  
  // Archive old audit logs
  await archiveAuditLogsOlderThan(2, 'years');
  
  // Clear expired sessions
  await deleteExpiredSessions();
}
```

#### 4. Right to Access
Users can request their data:
```typescript
async function exportUserData(userId: string): Promise<UserDataExport> {
  return {
    profile: await getUserProfile(userId),
    applications: await getUserApplications(userId),
    projects: await getUserProjects(userId),
    contributions: await getUserContributions(userId),
    auditLog: await getUserActivityLog(userId),
  };
}
```

#### 5. Right to Deletion
Users can request deletion (with exceptions):
```typescript
async function deleteUserAccount(userId: string, reason: string) {
  const user = await getUser(userId);
  
  // Check if deletion is allowed
  if (hasActiveProjects(userId)) {
    throw new Error('Cannot delete: active projects exist');
  }
  
  // Anonymize instead of delete (for audit trail)
  await anonymizeUser(userId);
  await logDeletion(userId, reason);
}
```

---

## 6. Photo & Document Privacy

### Photo Guidelines

#### Before Uploading
- Remove EXIF data (GPS, camera info)
- Blur faces if beneficiary requests
- Reduce resolution if too high
- Watermark with "ReBuild Homes SriLanka - Confidential"

#### Implementation
```typescript
async function processPhoto(file: File): Promise<ProcessedPhoto> {
  // Remove EXIF data
  const cleanedFile = await removeEXIF(file);
  
  // Resize if needed
  const resized = await resizeImage(cleanedFile, {
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 0.85,
  });
  
  // Generate thumbnail
  const thumbnail = await createThumbnail(resized, {
    width: 300,
    height: 200,
  });
  
  // Add watermark
  const watermarked = await addWatermark(resized, 'ReBuild Homes SriLanka');
  
  // Encrypt before storage
  const encrypted = await encryptFile(watermarked);
  
  return {
    originalSize: file.size,
    processedSize: encrypted.size,
    filename: generateSecureFilename(),
    thumbnail: thumbnail,
    url: await uploadToSecureStorage(encrypted),
  };
}
```

### Document Security
- PDF files: Password protect if containing sensitive info
- Signed URLs: Expire after 1 hour
- Access logging: Track who viewed what
- No direct file access: Must go through API

---

## 7. Communication Security

### Email Security
- Use TLS for email transmission
- SPF, DKIM, DMARC configured
- No sensitive data in email body
- Use links to secure portal instead

### SMS Security
- Use reputable SMS gateway
- No personal data in SMS (only codes/links)
- Rate limiting to prevent spam
- OTP expiration: 10 minutes

### In-App Messaging
- End-to-end encryption for sensitive messages
- Message retention: 90 days
- Cannot edit/delete after sending (audit trail)
- Admin can monitor for abuse

---

## 8. Third-Party Integrations

### Payment Gateways
- PCI DSS compliant providers only
- Never store card details
- Use tokenization
- Log all transactions

### Cloud Storage (AWS S3, etc.)
- Enable server-side encryption
- Block public access by default
- Use signed URLs with expiration
- Enable versioning for backups
- Access logging enabled

### Analytics Tools
- Anonymize user data
- No PII sent to analytics
- GDPR-compliant tools only
- Cookie consent required

---

## 9. Security Monitoring

### What to Monitor

#### Suspicious Activities
- Multiple failed login attempts
- Access from unusual locations
- Large data exports
- Rapid application submissions
- Similar applications from different users
- Unusual payment patterns

#### System Health
- Database query performance
- Server resource usage
- API response times
- Error rates
- Failed backup jobs

### Alerts & Notifications

```typescript
// Alert configuration
const SECURITY_ALERTS = {
  failed_login_threshold: 5,
  unusual_location_login: true,
  large_data_export: true,
  bulk_applications: 10 // within 1 hour
};

async function checkSecurityThresholds(event: SecurityEvent) {
  if (event.type === 'failed_login') {
    const count = await getFailedLoginCount(event.userId, '1h');
    if (count >= SECURITY_ALERTS.failed_login_threshold) {
      await sendAlert('high', 'Multiple failed logins', event);
      await lockAccount(event.userId);
    }
  }
  
  if (event.type === 'data_export') {
    if (event.recordCount > 1000) {
      await sendAlert('medium', 'Large data export', event);
      await notifyAdmin(event);
    }
  }
}
```

---

## 10. Incident Response Plan

### Security Incident Types
1. Data breach
2. Unauthorized access
3. DDoS attack
4. System compromise
5. Insider threat

### Response Procedure

#### Step 1: Detect & Assess (0-1 hour)
- Identify the incident type
- Assess severity (Low/Medium/High/Critical)
- Determine affected systems/data
- Document everything

#### Step 2: Contain (1-4 hours)
- Isolate affected systems
- Revoke compromised credentials
- Block malicious IPs
- Enable additional monitoring

#### Step 3: Investigate (4-24 hours)
- Review logs
- Identify attack vector
- Determine scope of breach
- Preserve evidence

#### Step 4: Remediate (1-7 days)
- Patch vulnerabilities
- Reset compromised accounts
- Restore from backups if needed
- Update security measures

#### Step 5: Notify (As required)
- Inform affected users
- Report to authorities if required
- Public statement if necessary
- Document lessons learned

#### Step 6: Post-Incident (Ongoing)
- Conduct post-mortem
- Update security procedures
- Train team on prevention
- Monitor for repeated attacks

---

## 11. Secure Development Practices

### Code Security

#### Input Validation
```typescript
// Always validate and sanitize input
function validateNIC(nic: string): boolean {
  // Sri Lankan NIC: 9 digits + V/X OR 12 digits
  const oldFormat = /^[0-9]{9}[VvXx]$/;
  const newFormat = /^[0-9]{12}$/;
  return oldFormat.test(nic) || newFormat.test(nic);
}

function sanitizeInput(input: string): string {
  // Remove potentially dangerous characters
  return input
    .replace(/<script>/gi, '')
    .replace(/javascript:/gi, '')
    .trim();
}
```

#### SQL Injection Prevention
```typescript
// ALWAYS use parameterized queries
// ❌ BAD
const query = `SELECT * FROM users WHERE email = '${email}'`;

// ✅ GOOD
const query = 'SELECT * FROM users WHERE email = ?';
await db.query(query, [email]);
```

#### XSS Prevention
```typescript
// Escape output when rendering
function escapeHTML(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
```

### Dependency Management
- Keep dependencies updated
- Use `npm audit` or similar
- Review security advisories
- Pin dependency versions
- Scan for vulnerabilities in CI/CD

### Code Reviews
- Mandatory for security-critical code
- Checklist includes security items
- Two-person rule for sensitive changes
- Automated security scanning

---

## 12. Backup & Disaster Recovery

### Backup Strategy

#### What to Backup
- Database (daily full, hourly incremental)
- Uploaded files (daily)
- Configuration files (on change)
- Application code (version control)

#### Backup Storage
- Primary: Cloud storage (encrypted)
- Secondary: Different region/provider
- Tertiary: Offline/cold storage (monthly)

#### Retention
- Daily backups: Keep 7 days
- Weekly backups: Keep 4 weeks
- Monthly backups: Keep 12 months
- Yearly backups: Keep indefinitely

### Recovery Procedures

#### RTO (Recovery Time Objective)
- Critical data: 1 hour
- Full system: 4 hours
- Non-critical: 24 hours

#### RPO (Recovery Point Objective)
- Maximum data loss: 1 hour
- Transaction logs: Real-time replication

#### Testing
- Test restore monthly
- Full disaster recovery drill quarterly
- Document all procedures
- Update runbooks after each test

---

## 13. Compliance Checklist

### Pre-Launch
- [ ] HTTPS enabled everywhere
- [ ] Database encryption configured
- [ ] File encryption implemented
- [ ] Password policy enforced
- [ ] MFA enabled for admins
- [ ] Session management secure
- [ ] Input validation on all forms
- [ ] SQL injection protection verified
- [ ] XSS protection implemented
- [ ] CSRF tokens in place
- [ ] Rate limiting configured
- [ ] Security headers set
- [ ] Backup system tested
- [ ] Audit logging enabled
- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] Cookie consent implemented
- [ ] Data retention policy defined
- [ ] Incident response plan documented
- [ ] Security team trained

### Ongoing
- [ ] Monthly security audits
- [ ] Quarterly penetration testing
- [ ] Regular dependency updates
- [ ] Access review (quarterly)
- [ ] Backup restoration tests
- [ ] Security training for team
- [ ] Incident response drills
- [ ] Review and update policies

---

## 14. Security Contact

### Reporting Security Issues

**Email**: security@rebuildhomes-srilanka.org

**What to Include**:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Your contact information

**Response Time**:
- Acknowledgment: Within 24 hours
- Assessment: Within 3 days
- Resolution: Based on severity
  - Critical: 24-48 hours
  - High: 1 week
  - Medium: 2 weeks
  - Low: 1 month

### Responsible Disclosure
- Report vulnerabilities privately first
- Allow 90 days for fix before public disclosure
- Recognition in Hall of Fame (if desired)
- No legal action against good-faith researchers
