# User Roles & Permissions

## Overview
This document defines the different user roles in the ReBuild Homes SriLanka system and their respective permissions.

---

## Role Hierarchy

```
Super Admin
    ├── Admin
    ├── Verifier
    ├── Donor
    └── Beneficiary
```

---

## 1. Super Admin

**Purpose**: Complete system control and configuration

### Permissions

#### User Management
- ✅ Create/edit/delete all users
- ✅ Assign/change user roles
- ✅ Activate/deactivate user accounts
- ✅ Reset passwords for any user
- ✅ View user activity logs

#### Application Management
- ✅ View all beneficiary applications
- ✅ Edit application details
- ✅ Override verification status
- ✅ Manually set priority scores
- ✅ Delete applications (with audit trail)

#### Donor Management
- ✅ View all donor records
- ✅ Edit donor information
- ✅ Adjust donor budgets
- ✅ View all contributions

#### Project Management
- ✅ Create/edit/delete projects
- ✅ Assign contractors
- ✅ Override project status
- ✅ Manage milestones
- ✅ Approve fund releases

#### System Configuration
- ✅ Configure system settings
- ✅ Manage reference data (districts, disaster types)
- ✅ Set verification rules
- ✅ Configure notifications
- ✅ Access audit logs
- ✅ Generate all reports
- ✅ Backup/restore data

**Access**: Full system access

---

## 2. Admin

**Purpose**: Day-to-day operations management

### Permissions

#### User Management
- ✅ Create verifier accounts
- ✅ View user lists
- ✅ Deactivate users (not delete)
- ❌ Cannot change Super Admin accounts
- ❌ Cannot assign admin roles

#### Application Management
- ✅ View all applications
- ✅ Assign applications to verifiers
- ✅ Approve/reject applications
- ✅ Calculate priority scores
- ✅ View verification history
- ✅ Request field visits
- ❌ Cannot delete applications

#### Donor Management
- ✅ View all donors
- ✅ Verify donor information
- ✅ View contribution history
- ✅ Generate donor reports
- ❌ Cannot delete donor accounts

#### Matching & Projects
- ✅ Match donors with beneficiaries
- ✅ Create house projects
- ✅ Assign contractors
- ✅ Update project status
- ✅ Upload milestone photos
- ✅ Approve fund releases
- ✅ Generate project reports
- ❌ Cannot override completed projects

#### Communication
- ✅ Send notifications to users
- ✅ Generate reports for donors
- ✅ Communicate with beneficiaries

#### Reports & Analytics
- ✅ View dashboard analytics
- ✅ Generate standard reports
- ✅ Export data (limited)
- ❌ Cannot access raw audit logs

**Dashboard Views**:
- Pending applications count
- Verification queue
- Active projects status
- Donor activity
- Completion metrics

---

## 3. Verifier

**Purpose**: Verify beneficiary applications

### Permissions

#### Application Verification
- ✅ View assigned applications
- ✅ Verify phone numbers (send OTP)
- ✅ Review documents
- ✅ Upload field visit evidence
- ✅ Add verification notes
- ✅ Recommend approve/reject
- ✅ Request additional documents
- ❌ Cannot approve/reject (only recommend)
- ❌ Cannot see other verifiers' work

#### Field Visits
- ✅ Schedule field visits
- ✅ Upload visit photos
- ✅ Submit visit reports
- ✅ Record family interviews

#### Communication
- ✅ Contact assigned beneficiaries
- ✅ Request document clarifications
- ❌ Cannot contact donors

#### Reports
- ✅ View own verification statistics
- ✅ View assigned work queue
- ❌ Cannot access system-wide reports

**Dashboard Views**:
- My assigned applications
- Verification queue
- Completed verifications
- Field visits scheduled
- Performance metrics (personal)

**Limited to**: Applications assigned to them

---

## 4. Donor

**Purpose**: Contribute funds and track projects

### Permissions

#### Profile Management
- ✅ View/edit own profile
- ✅ Update contact information
- ✅ Set donation preferences
- ✅ Manage visibility settings
- ❌ Cannot change donor ID or status

#### Browse Beneficiaries
- ✅ View approved applications list
- ✅ Filter by district/priority/need
- ✅ View anonymized family details
- ✅ See damage photos
- ❌ Cannot see NIC or exact addresses
- ❌ Cannot see rejected applications

#### Contributions
- ✅ Pledge sponsorship (full/partial)
- ✅ Contribute to funding pools
- ✅ View own contribution history
- ✅ Download receipts
- ❌ Cannot modify past contributions

#### Project Tracking
- ✅ View sponsored projects
- ✅ See construction progress
- ✅ View milestone updates
- ✅ See project photos
- ✅ Download completion reports
- ❌ Cannot edit project details
- ❌ Cannot see other donors' projects

#### Communication
- ✅ Send messages to admin
- ✅ Request project updates
- ✅ Provide feedback
- ❌ Cannot directly contact beneficiaries

#### Reports
- ✅ View personal impact summary
- ✅ Export own contribution records
- ✅ Download tax receipts

**Dashboard Views**:
- My sponsored projects
- Available families to sponsor
- Project milestones timeline
- Total impact (houses completed)
- Remaining budget

**Limited to**: Own contributions and sponsored projects

---

## 5. Beneficiary

**Purpose**: Submit application and track progress

### Permissions

#### Application
- ✅ Create new application
- ✅ Edit pending application
- ✅ Upload documents/photos
- ✅ View own application status
- ❌ Cannot edit after submission
- ❌ Cannot delete application

#### Verification
- ✅ Respond to verification requests
- ✅ Upload additional documents if requested
- ✅ Schedule field visit appointments
- ✅ View verification status
- ❌ Cannot see verifier notes

#### Project Tracking
- ✅ View own project status (if matched)
- ✅ See construction milestones
- ✅ View progress photos
- ✅ Receive completion certificate
- ❌ Cannot see donor details (unless donor agrees)
- ❌ Cannot modify project details

#### Communication
- ✅ Send messages to admin
- ✅ Respond to verification requests
- ❌ Cannot contact donors directly
- ❌ Cannot contact other beneficiaries

**Dashboard Views**:
- Application status
- Verification progress
- Project timeline (if matched)
- Recent updates
- Messages from admin

**Limited to**: Own application and project only

---

## Permission Matrix

| Feature | Super Admin | Admin | Verifier | Donor | Beneficiary |
|---------|-------------|-------|----------|-------|-------------|
| **User Management** |
| Create users | ✅ | Verifiers only | ❌ | ❌ | ❌ |
| Delete users | ✅ | ❌ | ❌ | ❌ | ❌ |
| Assign roles | ✅ | Limited | ❌ | ❌ | ❌ |
| **Applications** |
| View all | ✅ | ✅ | Assigned only | ❌ | Own only |
| Create | ✅ | ✅ | ❌ | ❌ | ✅ |
| Edit | ✅ | ✅ | ❌ | ❌ | Pending only |
| Delete | ✅ | ❌ | ❌ | ❌ | ❌ |
| Approve/Reject | ✅ | ✅ | Recommend | ❌ | ❌ |
| **Verification** |
| Assign verifier | ✅ | ✅ | ❌ | ❌ | ❌ |
| Verify phone | ✅ | ✅ | ✅ | ❌ | ❌ |
| Review docs | ✅ | ✅ | ✅ | ❌ | ❌ |
| Field visit | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Donors** |
| View all | ✅ | ✅ | ❌ | Own only | ❌ |
| Register | ✅ | ✅ | ❌ | ✅ | ❌ |
| Verify | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Matching** |
| Create match | ✅ | ✅ | ❌ | Request | ❌ |
| View matches | ✅ | ✅ | ❌ | Own only | Own only |
| **Projects** |
| Create | ✅ | ✅ | ❌ | ❌ | ❌ |
| Edit | ✅ | ✅ | ❌ | ❌ | ❌ |
| View all | ✅ | ✅ | ❌ | ❌ | ❌ |
| View own | ✅ | ✅ | ❌ | ✅ | ✅ |
| Update status | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Milestones** |
| Create | ✅ | ✅ | ❌ | ❌ | ❌ |
| Update | ✅ | ✅ | ❌ | ❌ | ❌ |
| Upload photos | ✅ | ✅ | ❌ | ❌ | ❌ |
| View | ✅ | ✅ | ❌ | Sponsored | Own |
| **Payments** |
| Release funds | ✅ | ✅ | ❌ | ❌ | ❌ |
| View all | ✅ | ✅ | ❌ | ❌ | ❌ |
| View own | ✅ | ✅ | ❌ | ✅ | ❌ |
| **Reports** |
| System reports | ✅ | ✅ | ❌ | ❌ | ❌ |
| Personal reports | ✅ | ✅ | ✅ | ✅ | ✅ |
| Export data | ✅ | Limited | ❌ | Own only | Own only |
| **Configuration** |
| System settings | ✅ | ❌ | ❌ | ❌ | ❌ |
| Reference data | ✅ | ❌ | ❌ | ❌ | ❌ |
| Audit logs | ✅ | View only | ❌ | ❌ | ❌ |

---

## Access Control Implementation

### Authentication
```typescript
interface User {
  id: string;
  email: string;
  role: 'super_admin' | 'admin' | 'verifier' | 'donor' | 'beneficiary';
  permissions: string[];
  isActive: boolean;
}
```

### Permission Checking
```typescript
// Example permission checks
function canApproveApplication(user: User): boolean {
  return ['super_admin', 'admin'].includes(user.role);
}

function canViewApplication(user: User, applicationId: string): boolean {
  if (['super_admin', 'admin'].includes(user.role)) {
    return true;
  }
  if (user.role === 'verifier') {
    return isAssignedToVerifier(user.id, applicationId);
  }
  if (user.role === 'beneficiary') {
    return isOwnApplication(user.id, applicationId);
  }
  return false;
}

function canViewProject(user: User, projectId: string): boolean {
  if (['super_admin', 'admin'].includes(user.role)) {
    return true;
  }
  if (user.role === 'donor') {
    return hasDonorContributed(user.id, projectId);
  }
  if (user.role === 'beneficiary') {
    return isOwnProject(user.id, projectId);
  }
  return false;
}
```

---

## Security Rules

### Data Visibility

**Beneficiary Personal Data** (NIC, exact address, phone):
- ✅ Super Admin: Full access
- ✅ Admin: Full access
- ✅ Verifier: Full access (assigned only)
- ❌ Donor: Anonymized only
- ✅ Beneficiary: Own data only

**Donor Financial Data** (budget, contributions):
- ✅ Super Admin: Full access
- ✅ Admin: Full access
- ❌ Verifier: No access
- ✅ Donor: Own data only
- ❌ Beneficiary: No access

**Verification Notes**:
- ✅ Super Admin: All notes
- ✅ Admin: All notes
- ✅ Verifier: Own notes only
- ❌ Donor: Summary only
- ❌ Beneficiary: No access

---

## Session Management

### Session Duration
- **Super Admin/Admin**: 8 hours
- **Verifier**: 4 hours
- **Donor**: 24 hours (remember me option)
- **Beneficiary**: 24 hours (remember me option)

### Security Features
- Multi-factor authentication (MFA) for admin roles
- IP whitelisting option for super admin
- Automatic logout on inactivity
- Session revocation on password change
- Device tracking

---

## Activity Logging

### What to Log
- All login attempts (success/failure)
- Password changes
- Role changes
- Application status changes
- Approval/rejection decisions
- Fund releases
- Data exports
- Failed permission checks

### Log Format
```json
{
  "timestamp": "2024-12-03T10:30:00Z",
  "user_id": "uuid",
  "role": "admin",
  "action": "approve_application",
  "entity_type": "beneficiary_application",
  "entity_id": "uuid",
  "ip_address": "192.168.1.1",
  "result": "success"
}
```

---

## Role Assignment Rules

### Who Can Assign Roles

| From Role | To Role | Assigned By |
|-----------|---------|-------------|
| - | Super Admin | System/Existing Super Admin |
| - | Admin | Super Admin only |
| - | Verifier | Super Admin, Admin |
| - | Donor | Self-registration (needs verification) |
| - | Beneficiary | Self-registration |

### Role Changes
- Super Admin: Cannot be changed (only by another Super Admin)
- Admin → Verifier: Allowed
- Verifier → Admin: Requires Super Admin approval
- Donor/Beneficiary: Cannot change to admin roles
