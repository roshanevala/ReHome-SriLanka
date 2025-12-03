# Firebase Setup Guide

## Overview
This guide covers setting up Firebase for the ReBuild Homes SriLanka project, including database structure, security rules, and configuration.

---

## 1. Firebase Project Setup

### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Name: "ReBuild Homes SriLanka"
4. Enable Google Analytics (optional)
5. Create project

### Enable Services
- ✅ Authentication
- ✅ Cloud Firestore
- ✅ Storage
- ✅ Cloud Functions
- ✅ Hosting

---

## 2. Firebase Authentication Setup

### Enable Sign-In Methods

#### Email/Password
```javascript
// Already enabled by default
// Users can register with email and password
```

#### Phone Authentication
1. In Firebase Console → Authentication → Sign-in method
2. Enable "Phone" provider
3. Configure authorized domains
4. Set up reCAPTCHA (auto-handled by Firebase)

#### Google Sign-In (Optional for donors)
1. Enable "Google" provider
2. Add support email
3. Download OAuth client configuration

### Security Setup
```javascript
// In Firebase Console → Authentication → Settings
{
  "emailEnumeration": false,  // Prevent email enumeration attacks
  "requireEmailVerification": true,
  "passwordPolicy": {
    "minLength": 8,
    "requireUppercase": true,
    "requireLowercase": true,
    "requireNumeric": true,
    "requireNonAlphanumeric": true
  }
}
```

---

## 3. Cloud Firestore Structure

### Collections Overview

```
📁 users/
  └─ {userId}
  
📁 beneficiaryApplications/
  └─ {applicationId}
      └─ 📁 verifications/
      └─ 📁 documents/
      
📁 donors/
  └─ {donorId}
      └─ 📁 contributions/
      
📁 houseProjects/
  └─ {projectId}
      └─ 📁 milestones/
      └─ 📁 photos/
      └─ 📁 updates/
      
📁 notifications/
  └─ {notificationId}
  
📁 auditLog/
  └─ {logId}
  
📁 systemSettings/
  └─ {settingKey}
```

---

## 4. Firestore Data Models

### Users Collection
```typescript
// users/{userId}
interface User {
  uid: string;
  email: string;
  phone: string;
  fullName: string;
  role: 'super_admin' | 'admin' | 'verifier' | 'donor' | 'beneficiary';
  isActive: boolean;
  phoneVerified: boolean;
  emailVerified: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastLoginAt?: Timestamp;
  profilePhotoUrl?: string;
}
```

### Beneficiary Applications Collection
```typescript
// beneficiaryApplications/{applicationId}
interface BeneficiaryApplication {
  id: string;
  applicationId: string; // BEN-2024-XXXX
  userId: string;
  
  // Basic Info
  basicInfo: {
    fullName: string;
    nicNumber: string; // Encrypted
    phoneNumber: string; // Encrypted
    email?: string;
    addressBeforeDisaster: string; // Encrypted
    currentTemporaryAddress: string;
  };
  
  // Disaster Details
  disasterDetails: {
    type: string;
    date: Timestamp;
    gnDivision: string;
    district: string;
    province: string;
    description: string;
  };
  
  // Family Info
  familyInfo: {
    damageLevel: 'fully_destroyed' | 'partially_damaged';
    membersCount: number;
    ages: string;
    childrenUnder18: number;
    elderly65Plus: number;
    disabledMembers: number;
    monthlyIncomeRange: string;
  };
  
  // Documents
  documents: {
    damagePhotos: string[]; // Storage URLs
    gnLetterPath?: string;
    dsLetterPath?: string;
    dmcCertificatePath?: string;
    landOwnershipProofPath?: string;
    hasNoDocuments: boolean;
  };
  
  // Consent
  consent: {
    truthConfirmation: boolean;
    dataSharingConsent: boolean;
  };
  
  // System Fields
  status: 'pending' | 'phone_verified' | 'under_verification' | 'field_verified' | 'approved' | 'rejected' | 'matched' | 'in_progress' | 'completed';
  priorityScore: number;
  rejectionReason?: string;
  assignedVerifierId?: string;
  verifiedAt?: Timestamp;
  approvedAt?: Timestamp;
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Subcollection: beneficiaryApplications/{applicationId}/verifications/{verificationId}
interface Verification {
  id: string;
  verifierId: string;
  verificationType: 'phone' | 'document' | 'field_visit';
  verificationDate: Timestamp;
  
  phoneVerified?: boolean;
  documentsValid?: boolean;
  fieldVisitCompleted?: boolean;
  fieldVisitPhotos?: string[];
  visitNotes?: string;
  
  recommendation: 'approve' | 'reject' | 'need_more_info';
  priorityAssessment?: number;
  notesForAdmin?: string;
  
  createdAt: Timestamp;
}
```

### Donors Collection
```typescript
// donors/{donorId}
interface Donor {
  id: string;
  donorId: string; // DON-2024-XXXX
  userId: string;
  
  donorType: 'individual' | 'organisation';
  
  contactInfo: {
    fullName: string;
    organisationName?: string;
    contactPerson?: string;
    phoneNumber: string;
    email: string;
    country: string;
    city: string;
  };
  
  supportTypes: ('fund_full' | 'fund_partial' | 'materials' | 'labour' | 'land')[];
  
  preferences: {
    preferredDistricts: string[];
    familyPreference?: 'children' | 'elderly_disabled' | 'any_high_need';
    timeframe?: string;
  };
  
  financial: {
    totalBudget: number;
    remainingBudget: number;
    totalContributed: number;
  };
  
  transparency: {
    displayNameToBeneficiaries: boolean;
    wantsRegularUpdates: boolean;
    updateFrequency?: 'weekly' | 'bi-weekly' | 'monthly';
  };
  
  status: 'registered' | 'verified' | 'active' | 'completed' | 'inactive';
  housesSponsored: number;
  lastActivityAt?: Timestamp;
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Subcollection: donors/{donorId}/contributions/{contributionId}
interface DonorContribution {
  id: string;
  contributionId: string; // CONT-2024-XXXX
  projectId: string;
  
  amount: number;
  contributionType: 'full' | 'partial' | 'materials' | 'labour';
  contributionDate: Timestamp;
  
  payment: {
    method?: string;
    reference?: string;
    receiptIssued: boolean;
    receiptNumber?: string;
    receiptIssuedAt?: Timestamp;
  };
  
  notes?: string;
  createdAt: Timestamp;
}
```

### House Projects Collection
```typescript
// houseProjects/{projectId}
interface HouseProject {
  id: string;
  projectId: string; // PROJ-2024-XXXX
  beneficiaryApplicationId: string;
  
  financial: {
    estimatedCost: number;
    fundedAmount: number;
    fundingGap: number; // Calculated in app
  };
  
  contractor?: {
    name: string;
    contact: string;
    license?: string;
  };
  
  timeline: {
    startDate?: Timestamp;
    expectedCompletionDate?: Timestamp;
    actualCompletionDate?: Timestamp;
  };
  
  design?: {
    type: string;
    floorAreaSqft: number;
    bedrooms: number;
  };
  
  status: 'looking_for_donor' | 'partially_funded' | 'fully_funded_planning' | 'under_construction' | 'completed' | 'on_hold' | 'cancelled';
  
  notes?: string;
  delayReasons?: string;
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Subcollection: houseProjects/{projectId}/milestones/{milestoneId}
interface ProjectMilestone {
  id: string;
  milestoneName: string;
  milestoneOrder: number;
  
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
  
  timeline: {
    plannedStartDate?: Timestamp;
    plannedEndDate?: Timestamp;
    actualStartDate?: Timestamp;
    actualCompletionDate?: Timestamp;
  };
  
  progressPercentage: number;
  notes?: string;
  
  verification: {
    verifiedBy?: string;
    verifiedAt?: Timestamp;
  };
  
  payment: {
    paymentPercentage: number;
    paymentReleased: boolean;
    paymentReleasedAt?: Timestamp;
  };
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Subcollection: houseProjects/{projectId}/photos/{photoId}
interface ProjectPhoto {
  id: string;
  milestoneId?: string;
  
  photoType: 'damage' | 'progress' | 'completion';
  filePath: string; // Storage path
  thumbnailPath: string;
  
  caption?: string;
  uploadedBy: string;
  uploadDate: Timestamp;
  
  metadata: {
    fileSizeBytes: number;
    widthPx: number;
    heightPx: number;
    gpsLatitude?: number;
    gpsLongitude?: number;
  };
  
  isFeatured: boolean;
  displayOrder: number;
}
```

### Notifications Collection
```typescript
// notifications/{notificationId}
interface Notification {
  id: string;
  userId: string;
  
  type: string;
  title: string;
  message: string;
  
  relatedEntity?: {
    type: string;
    id: string;
  };
  
  isRead: boolean;
  readAt?: Timestamp;
  
  channels: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  
  createdAt: Timestamp;
}
```

### Audit Log Collection
```typescript
// auditLog/{logId}
interface AuditLog {
  id: string;
  userId?: string;
  
  action: string;
  entityType: string;
  entityId?: string;
  
  changes?: {
    before: any;
    after: any;
  };
  
  metadata: {
    ipAddress?: string;
    userAgent?: string;
  };
  
  createdAt: Timestamp;
}
```

---

## 5. Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper Functions
    function isSignedIn() {
      return request.auth != null;
    }
    
    function getUserRole() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;
    }
    
    function isAdmin() {
      return isSignedIn() && getUserRole() in ['super_admin', 'admin'];
    }
    
    function isVerifier() {
      return isSignedIn() && getUserRole() == 'verifier';
    }
    
    function isDonor() {
      return isSignedIn() && getUserRole() == 'donor';
    }
    
    function isBeneficiary() {
      return isSignedIn() && getUserRole() == 'beneficiary';
    }
    
    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }
    
    // Users Collection
    match /users/{userId} {
      allow read: if isSignedIn() && (isAdmin() || isOwner(userId));
      allow create: if isSignedIn();
      allow update: if isAdmin() || isOwner(userId);
      allow delete: if isAdmin();
    }
    
    // Beneficiary Applications
    match /beneficiaryApplications/{applicationId} {
      allow read: if isAdmin() || 
                     (isVerifier() && resource.data.assignedVerifierId == request.auth.uid) ||
                     (isBeneficiary() && resource.data.userId == request.auth.uid) ||
                     (isDonor() && resource.data.status == 'approved');
      
      allow create: if isBeneficiary() || isAdmin();
      
      allow update: if isAdmin() || 
                       (isBeneficiary() && resource.data.userId == request.auth.uid && resource.data.status == 'pending') ||
                       (isVerifier() && resource.data.assignedVerifierId == request.auth.uid);
      
      allow delete: if isAdmin();
      
      // Verifications Subcollection
      match /verifications/{verificationId} {
        allow read: if isAdmin() || isVerifier();
        allow create: if isAdmin() || isVerifier();
        allow update: if isAdmin();
        allow delete: if isAdmin();
      }
      
      // Documents Subcollection
      match /documents/{documentId} {
        allow read: if isAdmin() || isVerifier() || 
                       (isBeneficiary() && get(/databases/$(database)/documents/beneficiaryApplications/$(applicationId)).data.userId == request.auth.uid);
        allow write: if isAdmin() || 
                        (isBeneficiary() && get(/databases/$(database)/documents/beneficiaryApplications/$(applicationId)).data.userId == request.auth.uid);
      }
    }
    
    // Donors
    match /donors/{donorId} {
      allow read: if isAdmin() || (isDonor() && resource.data.userId == request.auth.uid);
      allow create: if isDonor() || isAdmin();
      allow update: if isAdmin() || (isDonor() && resource.data.userId == request.auth.uid);
      allow delete: if isAdmin();
      
      // Contributions Subcollection
      match /contributions/{contributionId} {
        allow read: if isAdmin() || (isDonor() && get(/databases/$(database)/documents/donors/$(donorId)).data.userId == request.auth.uid);
        allow create: if isAdmin();
        allow update: if isAdmin();
        allow delete: if isAdmin();
      }
    }
    
    // House Projects
    match /houseProjects/{projectId} {
      allow read: if isAdmin() || 
                     (isDonor() && exists(/databases/$(database)/documents/houseProjects/$(projectId)/contributions/$(request.auth.uid))) ||
                     (isBeneficiary() && resource.data.beneficiaryApplicationId in get(/databases/$(database)/documents/users/$(request.auth.uid)).data.applicationIds);
      
      allow create: if isAdmin();
      allow update: if isAdmin();
      allow delete: if isAdmin();
      
      // Milestones Subcollection
      match /milestones/{milestoneId} {
        allow read: if isAdmin() || isDonor() || isBeneficiary();
        allow write: if isAdmin();
      }
      
      // Photos Subcollection
      match /photos/{photoId} {
        allow read: if isAdmin() || isDonor() || isBeneficiary();
        allow write: if isAdmin();
      }
      
      // Updates Subcollection
      match /updates/{updateId} {
        allow read: if isAdmin() || isDonor() || isBeneficiary();
        allow write: if isAdmin();
      }
    }
    
    // Notifications
    match /notifications/{notificationId} {
      allow read: if isSignedIn() && resource.data.userId == request.auth.uid;
      allow create: if isAdmin();
      allow update: if isSignedIn() && resource.data.userId == request.auth.uid;
      allow delete: if isAdmin();
    }
    
    // Audit Log (Admin only)
    match /auditLog/{logId} {
      allow read: if isAdmin();
      allow create: if isSignedIn();
      allow update: if false;
      allow delete: if false;
    }
    
    // System Settings (Admin only)
    match /systemSettings/{settingKey} {
      allow read: if isSignedIn();
      allow write: if isAdmin();
    }
  }
}
```

---

## 6. Firebase Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // Helper Functions
    function isSignedIn() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return request.auth.token.role in ['super_admin', 'admin'];
    }
    
    function isValidImage() {
      return request.resource.size < 5 * 1024 * 1024 && // 5MB
             request.resource.contentType.matches('image/.*');
    }
    
    function isValidDocument() {
      return request.resource.size < 10 * 1024 * 1024 && // 10MB
             request.resource.contentType in ['application/pdf', 'image/jpeg', 'image/png'];
    }
    
    // Application Documents
    match /applications/{applicationId}/{document} {
      allow read: if isSignedIn() && (isAdmin() || request.auth.token.role == 'verifier');
      allow write: if isSignedIn() && isValidDocument();
    }
    
    // Damage Photos
    match /damage-photos/{applicationId}/{photoId} {
      allow read: if isSignedIn();
      allow write: if isSignedIn() && isValidImage();
    }
    
    // Project Photos
    match /project-photos/{projectId}/{photoId} {
      allow read: if isSignedIn();
      allow write: if isAdmin() && isValidImage();
    }
    
    // Field Visit Photos
    match /field-visits/{applicationId}/{photoId} {
      allow read: if isAdmin();
      allow write: if isSignedIn() && request.auth.token.role == 'verifier' && isValidImage();
    }
    
    // User Profile Photos
    match /profiles/{userId}/{photoId} {
      allow read: if isSignedIn();
      allow write: if isSignedIn() && request.auth.uid == userId && isValidImage();
    }
  }
}
```

---

## 7. Cloud Functions Examples

### onCreate Trigger - New Application
```typescript
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const onApplicationCreated = functions.firestore
  .document('beneficiaryApplications/{applicationId}')
  .onCreate(async (snap, context) => {
    const application = snap.data();
    
    // Send confirmation email
    await sendEmail(application.basicInfo.email, {
      subject: 'Application Received',
      body: `Your application ${application.applicationId} has been received.`
    });
    
    // Send SMS notification
    await sendSMS(application.basicInfo.phoneNumber, 
      `Application ${application.applicationId} received. We will contact you soon.`
    );
    
    // Create notification
    await admin.firestore().collection('notifications').add({
      userId: application.userId,
      type: 'application_created',
      title: 'Application Submitted',
      message: 'Your application has been successfully submitted',
      isRead: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    // Log to audit
    await admin.firestore().collection('auditLog').add({
      userId: application.userId,
      action: 'create_application',
      entityType: 'beneficiaryApplication',
      entityId: context.params.applicationId,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
  });
```

### onUpdate Trigger - Status Change
```typescript
export const onApplicationStatusChange = functions.firestore
  .document('beneficiaryApplications/{applicationId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    
    if (before.status !== after.status) {
      const application = after;
      
      let message = '';
      if (after.status === 'approved') {
        message = 'Congratulations! Your application has been approved.';
      } else if (after.status === 'rejected') {
        message = 'Your application status has been updated.';
      }
      
      // Send notification
      await admin.firestore().collection('notifications').add({
        userId: application.userId,
        type: 'status_change',
        title: 'Application Status Update',
        message: message,
        isRead: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      // Send email
      await sendEmail(application.basicInfo.email, {
        subject: 'Application Status Update',
        body: message
      });
    }
  });
```

### Callable Function - Calculate Priority Score
```typescript
export const calculatePriorityScore = functions.https.onCall(async (data, context) => {
  // Verify admin
  if (!context.auth || !['super_admin', 'admin'].includes(context.auth.token.role)) {
    throw new functions.https.HttpsError('permission-denied', 'Not authorized');
  }
  
  const { applicationId } = data;
  const appDoc = await admin.firestore()
    .collection('beneficiaryApplications')
    .doc(applicationId)
    .get();
  
  if (!appDoc.exists) {
    throw new functions.https.HttpsError('not-found', 'Application not found');
  }
  
  const app = appDoc.data();
  let score = 0;
  
  // Damage level
  if (app.familyInfo.damageLevel === 'fully_destroyed') score += 30;
  else score += 15;
  
  // Children
  score += Math.min(app.familyInfo.childrenUnder18 * 3, 12);
  
  // Elderly
  score += Math.min(app.familyInfo.elderly65Plus * 5, 15);
  
  // Disabled
  score += Math.min(app.familyInfo.disabledMembers * 8, 16);
  
  // Income
  if (app.familyInfo.monthlyIncomeRange === '<10k') score += 15;
  else if (app.familyInfo.monthlyIncomeRange === '10-25k') score += 12;
  else if (app.familyInfo.monthlyIncomeRange === '25-50k') score += 8;
  else if (app.familyInfo.monthlyIncomeRange === '50-100k') score += 5;
  
  // Update application
  await appDoc.ref.update({
    priorityScore: score,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });
  
  return { score };
});
```

### Scheduled Function - Daily Digest
```typescript
export const sendDailyDigest = functions.pubsub
  .schedule('0 9 * * *') // 9 AM daily
  .timeZone('Asia/Colombo')
  .onRun(async (context) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Get stats
    const newApplications = await admin.firestore()
      .collection('beneficiaryApplications')
      .where('createdAt', '>=', yesterday)
      .get();
    
    const approvedApplications = await admin.firestore()
      .collection('beneficiaryApplications')
      .where('approvedAt', '>=', yesterday)
      .get();
    
    // Send to admins
    const admins = await admin.firestore()
      .collection('users')
      .where('role', 'in', ['super_admin', 'admin'])
      .get();
    
    for (const admin of admins.docs) {
      await sendEmail(admin.data().email, {
        subject: 'Daily ReBuild Homes Digest',
        body: `
          New applications: ${newApplications.size}
          Approved applications: ${approvedApplications.size}
        `
      });
    }
  });
```

---

## 8. Firebase Configuration

### Angular Environment Setup

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  firebase: {
    apiKey: "your-api-key",
    authDomain: "rehome-srilanka.firebaseapp.com",
    projectId: "rehome-srilanka",
    storageBucket: "rehome-srilanka.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef"
  }
};

// src/environments/environment.prod.ts
export const environment = {
  production: true,
  firebase: {
    apiKey: "your-prod-api-key",
    authDomain: "rehome-srilanka.firebaseapp.com",
    projectId: "rehome-srilanka",
    storageBucket: "rehome-srilanka.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef"
  }
};
```

### Install Firebase Dependencies
```bash
npm install firebase @angular/fire
```

### App Module Setup
```typescript
// src/app/app.config.ts
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { provideFunctions, getFunctions } from '@angular/fire/functions';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    provideFunctions(() => getFunctions()),
    // ... other providers
  ]
};
```

---

## 9. Indexes

### Composite Indexes (firebase.json)
```json
{
  "firestore": {
    "indexes": [
      {
        "collectionGroup": "beneficiaryApplications",
        "queryScope": "COLLECTION",
        "fields": [
          { "fieldPath": "status", "order": "ASCENDING" },
          { "fieldPath": "priorityScore", "order": "DESCENDING" }
        ]
      },
      {
        "collectionGroup": "beneficiaryApplications",
        "queryScope": "COLLECTION",
        "fields": [
          { "fieldPath": "disasterDetails.district", "order": "ASCENDING" },
          { "fieldPath": "status", "order": "ASCENDING" }
        ]
      },
      {
        "collectionGroup": "houseProjects",
        "queryScope": "COLLECTION",
        "fields": [
          { "fieldPath": "status", "order": "ASCENDING" },
          { "fieldPath": "timeline.startDate", "order": "ASCENDING" }
        ]
      }
    ]
  }
}
```

---

## 10. Backup Strategy

### Automated Backups
```bash
# Enable automated backups in Firebase Console
# Settings → Backups → Enable
# Retention: 30 days minimum
```

### Export Data (Admin SDK)
```typescript
import { getFirestore } from 'firebase-admin/firestore';

async function exportAllData() {
  const db = getFirestore();
  
  const collections = [
    'beneficiaryApplications',
    'donors',
    'houseProjects',
    'users'
  ];
  
  for (const collection of collections) {
    const snapshot = await db.collection(collection).get();
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Save to file or backup storage
    await saveBackup(collection, data);
  }
}
```

---

## 11. Cost Optimization

### Free Tier Limits (Spark Plan)
- Firestore: 1 GB storage, 50K reads, 20K writes/day
- Storage: 5 GB
- Functions: 125K invocations, 40K GB-seconds/month
- Hosting: 10 GB/month

### Blaze Plan (Pay-as-you-go)
- More generous free tier
- Auto-scaling
- Recommended for production

### Cost Saving Tips
1. Use Firestore queries efficiently
2. Implement pagination
3. Cache frequently accessed data
4. Optimize Cloud Functions
5. Compress images before upload
6. Use Storage lifecycle policies

---

## 12. Security Best Practices

### Custom Claims for Roles
```typescript
import * as admin from 'firebase-admin';

async function setUserRole(uid: string, role: string) {
  await admin.auth().setCustomUserClaims(uid, { role });
  
  // Also store in Firestore for queries
  await admin.firestore().collection('users').doc(uid).update({ role });
}
```

### Encrypt Sensitive Data
```typescript
import * as crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // 32 bytes
const IV_LENGTH = 16;

function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text: string): string {
  const parts = text.split(':');
  const iv = Buffer.from(parts.shift(), 'hex');
  const encryptedText = Buffer.from(parts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
```

---

## 13. Testing

### Firestore Emulator
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize emulators
firebase init emulators

# Start emulators
firebase emulators:start
```

### Unit Tests with Emulator
```typescript
import { initializeTestEnvironment } from '@firebase/rules-unit-testing';

let testEnv;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: 'rebuildhomes-test',
    firestore: {
      rules: fs.readFileSync('firestore.rules', 'utf8')
    }
  });
});

afterAll(async () => {
  await testEnv.cleanup();
});

test('Admin can read all applications', async () => {
  const adminDb = testEnv.authenticatedContext('admin-uid', { role: 'admin' }).firestore();
  const applications = await adminDb.collection('beneficiaryApplications').get();
  expect(applications.docs.length).toBeGreaterThan(0);
});
```

---

## 14. Deployment

### Deploy Everything
```bash
firebase deploy
```

### Deploy Specific Services
```bash
# Firestore rules only
firebase deploy --only firestore:rules

# Storage rules only
firebase deploy --only storage

# Functions only
firebase deploy --only functions

# Hosting only
firebase deploy --only hosting
```

### CI/CD with GitHub Actions
```yaml
# .github/workflows/firebase-deploy.yml
name: Deploy to Firebase
on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: rebuildhomes-srilanka
```

---

## Quick Start Checklist

- [ ] Create Firebase project
- [ ] Enable Authentication (Email, Phone)
- [ ] Enable Firestore
- [ ] Enable Storage
- [ ] Enable Cloud Functions
- [ ] Deploy security rules
- [ ] Set up indexes
- [ ] Configure environment files
- [ ] Install Firebase SDK
- [ ] Test with emulators
- [ ] Deploy to production
- [ ] Enable backups
- [ ] Set up monitoring

---

**Firebase is now configured and ready for development!** 🚀
