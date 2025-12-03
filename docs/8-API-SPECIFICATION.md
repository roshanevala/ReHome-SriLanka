# Firebase SDK Integration Guide

## Overview
This document shows how to interact with Firebase services for the ReBuild Homes SriLanka system.

**Technology**: Firebase SDK (AngularFire)

**Services Used**:
- Firebase Authentication
- Cloud Firestore
- Cloud Storage
- Cloud Functions

---

## Authentication with Firebase

### Register User
**Service**: Firebase Authentication

```typescript
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';

interface RegisterData {
  email: string;
  phone: string;
  password: string;
  fullName: string;
  role: 'beneficiary' | 'donor';
}

async registerUser(data: RegisterData): Promise<void> {
  try {
    // Create auth user
    const userCredential = await createUserWithEmailAndPassword(
      this.auth,
      data.email,
      data.password
    );
    
    const user = userCredential.user;
    
    // Create user document in Firestore
    await setDoc(doc(this.firestore, 'users', user.uid), {
      uid: user.uid,
      email: data.email,
      phone: data.phone,
      fullName: data.fullName,
      role: data.role,
      isActive: true,
      phoneVerified: false,
      emailVerified: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    // Send email verification
    await sendEmailVerification(user);
    
    console.log('User registered:', user.uid);
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}
```

---

### Login
```http
POST /auth/login
```

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "accessToken": "jwt-token",
    "refreshToken": "refresh-token",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "fullName": "John Doe",
      "role": "beneficiary",
      "phoneVerified": true
    }
  }
}
```

---

### Verify Phone
```http
POST /auth/verify-phone
```

**Request Body**:
```json
{
  "userId": "uuid",
  "otp": "123456"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Phone verified successfully"
}
```

---

### Logout
```http
POST /auth/logout
```

**Headers**: `Authorization: Bearer {token}`

**Response** (200):
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Beneficiary Application Endpoints

### Create Application
```http
POST /applications
```

**Headers**: `Authorization: Bearer {token}`

**Request Body**:
```json
{
  "fullName": "Jane Doe",
  "nicNumber": "123456789V",
  "phoneNumber": "+94771234567",
  "email": "jane@example.com",
  "addressBeforeDisaster": "123, Main Street, Colombo",
  "currentTemporaryAddress": "Temporary shelter, Camp 5",
  "disasterType": "flood",
  "disasterDate": "2024-05-15",
  "gnDivision": "Kadawatha",
  "district": "Gampaha",
  "province": "Western",
  "disasterDescription": "Our house was completely flooded...",
  "damageLevel": "fully_destroyed",
  "familyMembersCount": 5,
  "familyAges": "45,42,18,15,8",
  "childrenUnder18": 3,
  "elderly65Plus": 0,
  "disabledMembers": 0,
  "monthlyIncomeRange": "<10k",
  "damagePhotos": ["photo1.jpg", "photo2.jpg"],
  "gnLetterPath": "letter.pdf",
  "truthConfirmation": true,
  "dataSharingConsent": true
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "applicationId": "BEN-2024-1234",
    "status": "pending",
    "message": "Application submitted successfully. You will receive verification details soon."
  }
}
```

---

### Get My Application
```http
GET /applications/me
```

**Headers**: `Authorization: Bearer {token}`

**Response** (200):
```json
{
  "success": true,
  "data": {
    "applicationId": "BEN-2024-1234",
    "status": "under_verification",
    "fullName": "Jane Doe",
    "district": "Gampaha",
    "disasterType": "flood",
    "priorityScore": 85,
    "submittedAt": "2024-11-01T10:00:00Z",
    "lastUpdated": "2024-11-05T14:30:00Z"
  }
}
```

---

### Update Application
```http
PATCH /applications/{applicationId}
```

**Headers**: `Authorization: Bearer {token}`

**Note**: Only allowed if status is "pending"

**Request Body**: (Partial update)
```json
{
  "currentTemporaryAddress": "New temporary address",
  "phoneNumber": "+94779876543"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Application updated successfully"
}
```

---

### Upload Documents
```http
POST /applications/{applicationId}/documents
```

**Headers**: 
- `Authorization: Bearer {token}`
- `Content-Type: multipart/form-data`

**Form Data**:
- `documentType`: "gn_letter" | "damage_photo" | "land_proof"
- `file`: File upload

**Response** (200):
```json
{
  "success": true,
  "data": {
    "fileName": "uploaded-file.pdf",
    "fileUrl": "https://secure-url",
    "uploadedAt": "2024-11-05T10:00:00Z"
  }
}
```

---

## Admin - Application Management

### List All Applications
```http
GET /admin/applications
```

**Headers**: `Authorization: Bearer {admin-token}`

**Query Parameters**:
- `status`: Filter by status
- `district`: Filter by district
- `priority`: Filter by priority level
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)

**Response** (200):
```json
{
  "success": true,
  "data": {
    "applications": [
      {
        "applicationId": "BEN-2024-1234",
        "fullName": "Jane Doe",
        "district": "Gampaha",
        "status": "under_verification",
        "priorityScore": 85,
        "submittedAt": "2024-11-01T10:00:00Z",
        "assignedVerifier": "John Smith"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

---

### Get Application Details (Admin)
```http
GET /admin/applications/{applicationId}
```

**Headers**: `Authorization: Bearer {admin-token}`

**Response** (200):
```json
{
  "success": true,
  "data": {
    "applicationId": "BEN-2024-1234",
    "fullName": "Jane Doe",
    "nicNumber": "123456789V",
    "phoneNumber": "+94771234567",
    "status": "under_verification",
    "priorityScore": 85,
    "verificationHistory": [
      {
        "type": "phone",
        "verifiedBy": "System",
        "verifiedAt": "2024-11-02T08:00:00Z",
        "result": "success"
      }
    ],
    "documents": [...],
    "photos": [...]
  }
}
```

---

### Assign Verifier
```http
POST /admin/applications/{applicationId}/assign
```

**Headers**: `Authorization: Bearer {admin-token}`

**Request Body**:
```json
{
  "verifierId": "uuid"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Application assigned successfully"
}
```

---

### Approve Application
```http
POST /admin/applications/{applicationId}/approve
```

**Headers**: `Authorization: Bearer {admin-token}`

**Request Body**:
```json
{
  "priorityScore": 85,
  "notes": "Family verified. High priority case."
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Application approved",
  "data": {
    "applicationId": "BEN-2024-1234",
    "status": "approved",
    "priorityScore": 85
  }
}
```

---

### Reject Application
```http
POST /admin/applications/{applicationId}/reject
```

**Headers**: `Authorization: Bearer {admin-token}`

**Request Body**:
```json
{
  "reason": "Duplicate application"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Application rejected"
}
```

---

## Verifier Endpoints

### Get My Assigned Applications
```http
GET /verifier/applications
```

**Headers**: `Authorization: Bearer {verifier-token}`

**Query Parameters**:
- `status`: Filter by verification status

**Response** (200):
```json
{
  "success": true,
  "data": {
    "applications": [
      {
        "applicationId": "BEN-2024-1234",
        "fullName": "Jane Doe",
        "district": "Gampaha",
        "status": "under_verification",
        "assignedAt": "2024-11-02T10:00:00Z"
      }
    ]
  }
}
```

---

### Add Verification Record
```http
POST /verifier/applications/{applicationId}/verify
```

**Headers**: `Authorization: Bearer {verifier-token}`

**Request Body**:
```json
{
  "verificationType": "field_visit",
  "documentsValid": true,
  "fieldVisitCompleted": true,
  "visitNotes": "Visited site. Damage confirmed.",
  "recommendation": "approve",
  "priorityAssessment": 9
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Verification recorded successfully"
}
```

---

## Donor Endpoints

### Get Available Beneficiaries
```http
GET /donors/beneficiaries
```

**Headers**: `Authorization: Bearer {donor-token}`

**Query Parameters**:
- `district`: Filter by district
- `priorityLevel`: critical | high | medium | low
- `damageLevel`: fully_destroyed | partially_damaged
- `page`: Page number
- `limit`: Items per page

**Response** (200):
```json
{
  "success": true,
  "data": {
    "beneficiaries": [
      {
        "familyCode": "BEN-2024-1234",
        "district": "Gampaha",
        "gnDivision": "Kadawatha",
        "disasterType": "flood",
        "damageLevel": "fully_destroyed",
        "familySize": 5,
        "childrenCount": 3,
        "elderlyCount": 0,
        "disabledCount": 0,
        "priorityLevel": "critical",
        "estimatedCost": 1200000,
        "fundingStatus": "unfunded",
        "photos": ["url1", "url2"],
        "story": "A brief story about the family..."
      }
    ],
    "pagination": {...}
  }
}
```

---

### Pledge Sponsorship
```http
POST /donors/sponsor
```

**Headers**: `Authorization: Bearer {donor-token}`

**Request Body**:
```json
{
  "beneficiaryApplicationId": "uuid",
  "sponsorshipType": "full" | "partial",
  "amount": 1200000,
  "displayName": true,
  "wantsUpdates": true
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Sponsorship request submitted",
  "data": {
    "requestId": "uuid",
    "status": "pending_admin_approval"
  }
}
```

---

### Get My Projects
```http
GET /donors/projects
```

**Headers**: `Authorization: Bearer {donor-token}`

**Response** (200):
```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "projectId": "PROJ-2024-1234",
        "familyCode": "BEN-2024-1234",
        "district": "Gampaha",
        "status": "under_construction",
        "contributionAmount": 1200000,
        "progress": 65,
        "startDate": "2024-08-15",
        "expectedCompletion": "2024-11-30",
        "milestonesCompleted": 3,
        "milestonesTotal": 5,
        "latestUpdate": "Roofing completed successfully",
        "photos": [...]
      }
    ]
  }
}
```

---

### Get Project Details
```http
GET /donors/projects/{projectId}
```

**Headers**: `Authorization: Bearer {donor-token}`

**Response** (200):
```json
{
  "success": true,
  "data": {
    "projectId": "PROJ-2024-1234",
    "familyCode": "BEN-2024-1234",
    "location": {
      "district": "Gampaha",
      "gnDivision": "Kadawatha"
    },
    "family": {
      "size": 5,
      "childrenCount": 3
    },
    "financial": {
      "estimatedCost": 1200000,
      "yourContribution": 1200000,
      "actualSpent": 800000
    },
    "timeline": {
      "startDate": "2024-08-15",
      "expectedCompletion": "2024-11-30",
      "progress": 65
    },
    "milestones": [
      {
        "name": "Foundation",
        "status": "completed",
        "completedDate": "2024-09-05",
        "photos": [...]
      },
      {
        "name": "Walls & Structure",
        "status": "completed",
        "completedDate": "2024-10-10",
        "photos": [...]
      },
      {
        "name": "Roofing",
        "status": "in_progress",
        "progress": 80,
        "photos": [...]
      }
    ],
    "updates": [
      {
        "date": "2024-10-28",
        "message": "Roofing 80% complete",
        "photos": [...]
      }
    ]
  }
}
```

---

## Project Management Endpoints (Admin)

### Create Project
```http
POST /admin/projects
```

**Headers**: `Authorization: Bearer {admin-token}`

**Request Body**:
```json
{
  "beneficiaryApplicationId": "uuid",
  "estimatedCost": 1200000,
  "designType": "standard_2br",
  "floorAreaSqft": 650,
  "bedrooms": 2
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "projectId": "PROJ-2024-1234",
    "status": "looking_for_donor"
  }
}
```

---

### Update Project Status
```http
PATCH /admin/projects/{projectId}
```

**Headers**: `Authorization: Bearer {admin-token}`

**Request Body**:
```json
{
  "status": "under_construction",
  "contractorName": "ABC Construction",
  "contractorContact": "+94771234567",
  "startDate": "2024-08-15",
  "expectedCompletionDate": "2024-11-30"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Project updated successfully"
}
```

---

### Add Milestone Update
```http
POST /admin/projects/{projectId}/milestones/{milestoneId}
```

**Headers**: `Authorization: Bearer {admin-token}`

**Request Body**:
```json
{
  "status": "completed",
  "actualCompletionDate": "2024-09-05",
  "notes": "Foundation work completed as per plan",
  "progressPercentage": 100,
  "paymentReleased": true
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Milestone updated successfully"
}
```

---

### Upload Project Photos
```http
POST /admin/projects/{projectId}/photos
```

**Headers**: 
- `Authorization: Bearer {admin-token}`
- `Content-Type: multipart/form-data`

**Form Data**:
- `milestoneId`: uuid (optional)
- `photoType`: "progress" | "completion"
- `caption`: Text
- `files`: Multiple file uploads

**Response** (200):
```json
{
  "success": true,
  "data": {
    "uploadedPhotos": [
      {
        "photoId": "uuid",
        "url": "https://secure-url",
        "thumbnail": "https://thumbnail-url"
      }
    ]
  }
}
```

---

## Reports & Analytics Endpoints

### Get Dashboard Stats (Admin)
```http
GET /admin/dashboard
```

**Headers**: `Authorization: Bearer {admin-token}`

**Response** (200):
```json
{
  "success": true,
  "data": {
    "applications": {
      "total": 500,
      "pending": 50,
      "underVerification": 30,
      "approved": 300,
      "rejected": 120
    },
    "donors": {
      "total": 150,
      "active": 120,
      "totalContributed": 180000000
    },
    "projects": {
      "total": 100,
      "looking_for_donor": 20,
      "under_construction": 50,
      "completed": 30
    },
    "recentActivity": [...]
  }
}
```

---

### Generate Report
```http
POST /admin/reports/generate
```

**Headers**: `Authorization: Bearer {admin-token}`

**Request Body**:
```json
{
  "reportType": "applications" | "donors" | "projects" | "financial",
  "dateRange": {
    "from": "2024-01-01",
    "to": "2024-12-31"
  },
  "filters": {
    "district": "Gampaha",
    "status": "completed"
  },
  "format": "pdf" | "excel" | "csv"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "reportId": "uuid",
    "downloadUrl": "https://download-url",
    "expiresAt": "2024-12-04T10:00:00Z"
  }
}
```

---

## Notification Endpoints

### Get My Notifications
```http
GET /notifications
```

**Headers**: `Authorization: Bearer {token}`

**Query Parameters**:
- `unreadOnly`: true | false
- `page`: Page number
- `limit`: Items per page

**Response** (200):
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "uuid",
        "type": "application_status",
        "title": "Application Approved",
        "message": "Your application has been approved!",
        "isRead": false,
        "createdAt": "2024-11-05T10:00:00Z"
      }
    ],
    "unreadCount": 5
  }
}
```

---

### Mark Notification as Read
```http
PATCH /notifications/{notificationId}/read
```

**Headers**: `Authorization: Bearer {token}`

**Response** (200):
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

---

## Error Responses

### Standard Error Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "nicNumber",
        "message": "NIC format is invalid"
      }
    ]
  }
}
```

### Common Error Codes
- `VALIDATION_ERROR` (400): Invalid input
- `UNAUTHORIZED` (401): Not authenticated
- `FORBIDDEN` (403): No permission
- `NOT_FOUND` (404): Resource not found
- `CONFLICT` (409): Duplicate resource
- `RATE_LIMIT` (429): Too many requests
- `SERVER_ERROR` (500): Internal error

---

## Rate Limiting

**Limits**:
- Authentication endpoints: 5 requests/minute
- Application creation: 3 requests/hour
- File uploads: 10 requests/hour
- Other endpoints: 100 requests/minute

**Headers**:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1699876543
```

---

## Pagination

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

**Response Format**:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```
