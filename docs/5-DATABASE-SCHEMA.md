# Database Schema & Technical Structure

## Database Overview

This document defines the database structure for the ReHome Sri Lanka system using **Firebase Cloud Firestore** (NoSQL).

---

## Firebase Firestore Structure

### Collections & Subcollections Hierarchy

```
📁 users/
  └─ {userId}
  
📁 beneficiaryApplications/
  └─ {applicationId}
      └─ 📁 verifications/
          └─ {verificationId}
      └─ 📁 documents/
          └─ {documentId}
      
📁 donors/
  └─ {donorId}
      └─ 📁 contributions/
          └─ {contributionId}
      
📁 houseProjects/
  └─ {projectId}
      └─ 📁 milestones/
          └─ {milestoneId}
      └─ 📁 photos/
          └─ {photoId}
      └─ 📁 updates/
          └─ {updateId}
      
📁 notifications/
  └─ {notificationId}
  
📁 auditLog/
  └─ {logId}
  
📁 systemSettings/
  └─ {settingKey}
```

---

## Firestore Document Structures

### 1. Users Collection
**Path**: `users/{userId}`

Firebase Authentication handles user management. This collection stores additional user metadata.

```typescript
interface User {
  uid: string;                    // From Firebase Auth
  email: string;
  phone: string;
  fullName: string;
  role: 'super_admin' | 'admin' | 'verifier' | 'donor' | 'beneficiary';
  isActive: boolean;
  phoneVerified: boolean;         // From Firebase Auth
  emailVerified: boolean;         // From Firebase Auth
  profilePhotoUrl?: string;
  createdAt: Timestamp;           // Firestore Timestamp
  updatedAt: Timestamp;
  lastLoginAt?: Timestamp;
}
```

**Firebase Auth handles**:
- Password hashing
- Email verification
- Phone verification (OTP)
- Session management

**Indexes**: Auto-indexed by document ID (userId)
**Security**: See Firebase Security Rules in setup guide

---

### 2. BeneficiaryApplications
Applications from people who lost their homes.

```sql
CREATE TABLE beneficiary_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  application_id VARCHAR(50) UNIQUE NOT NULL, -- Format: BEN-YYYY-XXXX
  
  -- Basic Info
  full_name VARCHAR(255) NOT NULL,
  nic_number VARCHAR(12) UNIQUE NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  address_before_disaster TEXT NOT NULL,
  current_temporary_address TEXT NOT NULL,
  
  -- Disaster Details
  disaster_type VARCHAR(50) NOT NULL, -- flood, landslide, fire, etc.
  disaster_date DATE NOT NULL,
  gn_division VARCHAR(255) NOT NULL,
  district VARCHAR(100) NOT NULL,
  province VARCHAR(100) NOT NULL,
  disaster_description TEXT NOT NULL,
  
  -- Family Situation
  damage_level ENUM('fully_destroyed', 'partially_damaged') NOT NULL,
  family_members_count INT NOT NULL,
  family_ages TEXT, -- Comma-separated: "45,42,18,15,8"
  children_under_18 INT DEFAULT 0,
  elderly_65_plus INT DEFAULT 0,
  disabled_members INT DEFAULT 0,
  monthly_income_range VARCHAR(50), -- <10k, 10-25k, etc.
  
  -- Evidence
  damage_photos JSON, -- Array of file paths
  gn_letter_path VARCHAR(255),
  ds_letter_path VARCHAR(255),
  dmc_certificate_path VARCHAR(255),
  land_ownership_proof_path VARCHAR(255),
  has_no_documents BOOLEAN DEFAULT false,
  
  -- Consent
  truth_confirmation BOOLEAN NOT NULL,
  data_sharing_consent BOOLEAN NOT NULL,
  
  -- System Fields
  status ENUM(
    'pending',
    'phone_verified',
    'under_verification',
    'field_verified',
    'approved',
    'rejected',
    'matched',
    'in_progress',
    'completed'
  ) DEFAULT 'pending',
  priority_score INT DEFAULT 0, -- 0-100
  rejection_reason TEXT,
  assigned_verifier_id UUID REFERENCES users(id),
  verified_at TIMESTAMP,
  approved_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_application_id (application_id),
  INDEX idx_nic (nic_number),
  INDEX idx_status (status),
  INDEX idx_district (district),
  INDEX idx_priority (priority_score DESC),
  INDEX idx_disaster_date (disaster_date)
);
```

---

### 3. Donors
Donor registration and information.

```sql
CREATE TABLE donors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  donor_id VARCHAR(50) UNIQUE NOT NULL, -- Format: DON-YYYY-XXXX
  
  -- Basic Info
  donor_type ENUM('individual', 'organisation') NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  organisation_name VARCHAR(255),
  contact_person VARCHAR(255),
  phone_number VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  country VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  
  -- Support Type (can select multiple)
  support_types JSON, -- ["fund_full", "fund_partial", "materials", "labour", "land"]
  
  -- Preferences
  preferred_districts JSON, -- Array of district names or ["any"]
  family_preference VARCHAR(50), -- children, elderly_disabled, any_high_need
  total_budget DECIMAL(15, 2) NOT NULL,
  remaining_budget DECIMAL(15, 2) NOT NULL,
  timeframe VARCHAR(50), -- 1-3 months, 3-6 months, etc.
  
  -- Transparency
  display_name_to_beneficiaries BOOLEAN DEFAULT true,
  wants_regular_updates BOOLEAN DEFAULT true,
  update_frequency VARCHAR(20), -- weekly, bi-weekly, monthly
  
  -- System Fields
  status ENUM('registered', 'verified', 'active', 'completed', 'inactive') DEFAULT 'registered',
  houses_sponsored INT DEFAULT 0,
  total_contributed DECIMAL(15, 2) DEFAULT 0,
  last_activity_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_donor_id (donor_id),
  INDEX idx_status (status),
  INDEX idx_country (country),
  INDEX idx_remaining_budget (remaining_budget)
);
```

---

### 4. Verifications
Track verification activities for each application.

```sql
CREATE TABLE verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  beneficiary_application_id UUID REFERENCES beneficiary_applications(id) ON DELETE CASCADE,
  verifier_user_id UUID REFERENCES users(id),
  
  verification_type ENUM('phone', 'document', 'field_visit') NOT NULL,
  verification_date TIMESTAMP NOT NULL,
  
  -- Verification Results
  phone_verified BOOLEAN DEFAULT false,
  documents_valid BOOLEAN,
  field_visit_completed BOOLEAN,
  field_visit_photos JSON, -- Array of photo paths
  visit_notes TEXT,
  
  -- Assessment
  recommendation ENUM('approve', 'reject', 'need_more_info') NOT NULL,
  priority_assessment INT, -- 1-10
  notes_for_admin TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_application (beneficiary_application_id),
  INDEX idx_verifier (verifier_user_id),
  INDEX idx_type (verification_type)
);
```

---

### 5. HouseProjects
Track house construction projects.

```sql
CREATE TABLE house_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id VARCHAR(50) UNIQUE NOT NULL, -- Format: PROJ-YYYY-XXXX
  beneficiary_application_id UUID REFERENCES beneficiary_applications(id) ON DELETE CASCADE,
  
  -- Project Details
  estimated_cost DECIMAL(15, 2) NOT NULL,
  funded_amount DECIMAL(15, 2) DEFAULT 0,
  funding_gap DECIMAL(15, 2) GENERATED ALWAYS AS (estimated_cost - funded_amount) STORED,
  
  -- Contractor Info
  contractor_name VARCHAR(255),
  contractor_contact VARCHAR(100),
  contractor_license VARCHAR(100),
  
  -- Timeline
  start_date DATE,
  expected_completion_date DATE,
  actual_completion_date DATE,
  
  -- Status
  status ENUM(
    'looking_for_donor',
    'partially_funded',
    'fully_funded_planning',
    'under_construction',
    'completed',
    'on_hold',
    'cancelled'
  ) DEFAULT 'looking_for_donor',
  
  -- Design
  design_type VARCHAR(100),
  floor_area_sqft INT,
  bedrooms INT,
  
  -- Notes
  construction_notes TEXT,
  delay_reasons TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_project_id (project_id),
  INDEX idx_beneficiary (beneficiary_application_id),
  INDEX idx_status (status),
  INDEX idx_start_date (start_date)
);
```

---

### 6. DonorContributions
Track individual donor contributions to projects.

```sql
CREATE TABLE donor_contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contribution_id VARCHAR(50) UNIQUE NOT NULL, -- Format: CONT-YYYY-XXXX
  donor_id UUID REFERENCES donors(id) ON DELETE CASCADE,
  house_project_id UUID REFERENCES house_projects(id) ON DELETE CASCADE,
  
  amount DECIMAL(15, 2) NOT NULL,
  contribution_type VARCHAR(50) NOT NULL, -- full, partial, materials, labour
  contribution_date DATE NOT NULL,
  payment_method VARCHAR(50), -- bank_transfer, cash, materials, etc.
  payment_reference VARCHAR(255),
  
  receipt_issued BOOLEAN DEFAULT false,
  receipt_number VARCHAR(100),
  receipt_issued_at TIMESTAMP,
  
  notes TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_contribution_id (contribution_id),
  INDEX idx_donor (donor_id),
  INDEX idx_project (house_project_id),
  INDEX idx_date (contribution_date)
);
```

---

### 7. ProjectMilestones
Track construction milestones for each project.

```sql
CREATE TABLE project_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  house_project_id UUID REFERENCES house_projects(id) ON DELETE CASCADE,
  
  milestone_name VARCHAR(100) NOT NULL, -- foundation, walls, roofing, etc.
  milestone_order INT NOT NULL, -- 1, 2, 3, ...
  
  status ENUM('pending', 'in_progress', 'completed', 'delayed') DEFAULT 'pending',
  
  planned_start_date DATE,
  planned_end_date DATE,
  actual_start_date DATE,
  actual_completion_date DATE,
  
  progress_percentage INT DEFAULT 0, -- 0-100
  
  notes TEXT,
  verified_by_user_id UUID REFERENCES users(id),
  verified_at TIMESTAMP,
  
  payment_percentage DECIMAL(5, 2), -- Percentage of total cost to release
  payment_released BOOLEAN DEFAULT false,
  payment_released_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_project (house_project_id),
  INDEX idx_status (status),
  INDEX idx_order (milestone_order)
);
```

---

### 8. ProjectPhotos
Store photos for projects (damage, construction progress, completion).

```sql
CREATE TABLE project_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  house_project_id UUID REFERENCES house_projects(id) ON DELETE CASCADE,
  milestone_id UUID REFERENCES project_milestones(id) ON DELETE SET NULL,
  
  photo_type VARCHAR(50) NOT NULL, -- damage, progress, completion
  file_path VARCHAR(500) NOT NULL,
  thumbnail_path VARCHAR(500),
  
  caption TEXT,
  uploaded_by_user_id UUID REFERENCES users(id),
  upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Metadata
  file_size_bytes INT,
  width_px INT,
  height_px INT,
  gps_latitude DECIMAL(10, 8),
  gps_longitude DECIMAL(11, 8),
  
  is_featured BOOLEAN DEFAULT false,
  display_order INT DEFAULT 0,
  
  INDEX idx_project (house_project_id),
  INDEX idx_milestone (milestone_id),
  INDEX idx_type (photo_type),
  INDEX idx_upload_date (upload_date)
);
```

---

### 9. Notifications
Track system notifications to users.

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  notification_type VARCHAR(50) NOT NULL, -- application_status, milestone_update, etc.
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  
  related_entity_type VARCHAR(50), -- beneficiary_application, house_project, etc.
  related_entity_id UUID,
  
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP,
  
  sent_via_email BOOLEAN DEFAULT false,
  sent_via_sms BOOLEAN DEFAULT false,
  sent_via_push BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_user (user_id),
  INDEX idx_is_read (is_read),
  INDEX idx_created (created_at DESC)
);
```

---

### 10. AuditLog
Track all important system actions for security and accountability.

```sql
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  
  action VARCHAR(100) NOT NULL, -- login, create, update, delete, approve, reject
  entity_type VARCHAR(50) NOT NULL, -- user, application, project, etc.
  entity_id UUID,
  
  before_data JSON, -- State before change
  after_data JSON, -- State after change
  
  ip_address VARCHAR(45),
  user_agent TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_user (user_id),
  INDEX idx_entity (entity_type, entity_id),
  INDEX idx_action (action),
  INDEX idx_created (created_at DESC)
);
```

---

## Supporting Tables

### 11. Districts (Reference Data)
```sql
CREATE TABLE districts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  province VARCHAR(100) NOT NULL,
  INDEX idx_province (province)
);
```

### 12. DisasterTypes (Reference Data)
```sql
CREATE TABLE disaster_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT
);
```

### 13. SystemSettings
```sql
CREATE TABLE system_settings (
  key VARCHAR(100) PRIMARY KEY,
  value TEXT NOT NULL,
  data_type VARCHAR(20) NOT NULL, -- string, number, boolean, json
  description TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_by_user_id UUID REFERENCES users(id)
);
```

---

## Indexes & Performance

### Additional Composite Indexes

```sql
-- For faster beneficiary searches
CREATE INDEX idx_ben_status_priority 
ON beneficiary_applications(status, priority_score DESC);

CREATE INDEX idx_ben_district_status 
ON beneficiary_applications(district, status);

-- For donor matching
CREATE INDEX idx_donor_active_budget 
ON donors(status, remaining_budget DESC) 
WHERE status = 'active';

-- For project tracking
CREATE INDEX idx_project_status_date 
ON house_projects(status, start_date);

-- For milestone queries
CREATE INDEX idx_milestone_project_order 
ON project_milestones(house_project_id, milestone_order);
```

---

## Data Integrity Rules

### Foreign Key Constraints
- ON DELETE CASCADE: When parent deleted, children auto-deleted
- ON DELETE SET NULL: When parent deleted, reference becomes null
- ON DELETE RESTRICT: Prevent deletion if children exist

### Check Constraints
```sql
ALTER TABLE beneficiary_applications 
ADD CONSTRAINT chk_priority_score 
CHECK (priority_score >= 0 AND priority_score <= 100);

ALTER TABLE project_milestones 
ADD CONSTRAINT chk_progress_percentage 
CHECK (progress_percentage >= 0 AND progress_percentage <= 100);

ALTER TABLE donors 
ADD CONSTRAINT chk_budget_positive 
CHECK (total_budget >= 0 AND remaining_budget >= 0);

ALTER TABLE donor_contributions 
ADD CONSTRAINT chk_amount_positive 
CHECK (amount > 0);
```

---

## Common Queries

### Get Approved High-Priority Beneficiaries
```sql
SELECT 
  application_id,
  full_name,
  district,
  gn_division,
  damage_level,
  family_members_count,
  priority_score
FROM beneficiary_applications
WHERE status = 'approved'
ORDER BY priority_score DESC
LIMIT 20;
```

### Get Donor's Projects with Progress
```sql
SELECT 
  hp.project_id,
  ba.application_id,
  ba.district,
  hp.status,
  hp.funded_amount,
  COUNT(pm.id) as total_milestones,
  SUM(CASE WHEN pm.status = 'completed' THEN 1 ELSE 0 END) as completed_milestones
FROM house_projects hp
JOIN beneficiary_applications ba ON hp.beneficiary_application_id = ba.id
JOIN donor_contributions dc ON hp.id = dc.house_project_id
LEFT JOIN project_milestones pm ON hp.id = pm.house_project_id
WHERE dc.donor_id = :donor_id
GROUP BY hp.id, ba.id;
```

### Get Verification Queue
```sql
SELECT 
  ba.application_id,
  ba.full_name,
  ba.district,
  ba.status,
  ba.created_at,
  COALESCE(v.verification_type, 'none') as last_verification
FROM beneficiary_applications ba
LEFT JOIN LATERAL (
  SELECT verification_type 
  FROM verifications 
  WHERE beneficiary_application_id = ba.id 
  ORDER BY verification_date DESC 
  LIMIT 1
) v ON true
WHERE ba.status IN ('pending', 'phone_verified', 'under_verification')
ORDER BY ba.created_at ASC;
```

---

## Backup & Maintenance

### Recommended Schedule
- **Daily**: Incremental backup
- **Weekly**: Full backup
- **Monthly**: Archive old audit logs
- **Quarterly**: Data quality audit

### Data Retention
- **Active Records**: Indefinite
- **Rejected Applications**: 6 months, then archive
- **Audit Logs**: 2 years
- **Photos**: Permanent (with backup)
- **Completed Projects**: Permanent
