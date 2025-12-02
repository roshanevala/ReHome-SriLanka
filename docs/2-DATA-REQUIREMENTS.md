# Data Collection Requirements

## A. Beneficiary Application Form

### 1. Basic Information
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Full Name | Text | Yes | As per NIC |
| NIC Number | Text | Yes | Validation required |
| Phone Number | Text | Yes | WhatsApp preferred |
| Email | Email | No | Optional contact |
| Address Before Disaster | Text Area | Yes | Full address |
| Current Temporary Address | Text Area | Yes | Where staying now |

### 2. Disaster Details
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Type of Disaster | Dropdown | Yes | Flood, Landslide, Fire, etc. |
| Date of Disaster | Date | Yes | When it happened |
| GN Division | Text | Yes | Administrative division |
| District | Dropdown | Yes | From predefined list |
| Province | Dropdown | Yes | Auto-fill from district |
| Description | Text Area | Yes | What happened (200-500 words) |

### 3. House Damage & Family Situation
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Damage Level | Radio | Yes | Fully Destroyed / Partially Damaged |
| Number of Family Members | Number | Yes | Total people |
| Ages of Members | Text | Yes | E.g., "45, 42, 18, 15, 8" |
| Children Under 18 | Number | Yes | Calculated or input |
| Elderly (65+) | Number | Yes | Calculated or input |
| Disabled Members | Number | Yes | Including details |
| Monthly Income Range | Dropdown | Yes | <10k, 10-25k, 25-50k, 50-100k, >100k LKR |

### 4. Evidence & Documents
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Photos of Damage | File Upload | Yes | Minimum 3 photos, max 10 |
| GN Officer Letter | File Upload | No | PDF/Image |
| Divisional Secretariat Letter | File Upload | No | PDF/Image |
| DMC Certificate | File Upload | No | PDF/Image |
| Land Ownership Proof | File Upload | No | Deed/Permit/Lease |
| No Documents Option | Checkbox | - | "I don't have documents; please help verify" |

### 5. Consent & Agreement
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Truth Confirmation | Checkbox | Yes | "I confirm these details are true" |
| Data Sharing Consent | Checkbox | Yes | "I agree to share information with donors" |

### 6. System Fields (Auto-Generated)
| Field | Type | Notes |
|-------|------|-------|
| Application ID | UUID | Auto-generated unique ID |
| Submission Date | DateTime | Auto timestamp |
| Status | Enum | Pending, Under Verification, Approved, Rejected, In Progress, Completed |
| Priority Score | Number | Calculated: 0-100 |
| Verification Notes | Text | Admin use only |
| Assigned Verifier | Reference | User ID |
| Approved Date | DateTime | When approved |
| Rejected Reason | Text | If rejected |

---

## B. Donor Registration Form

### 1. Basic Information
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Donor Type | Radio | Yes | Individual / Organisation |
| Full Name | Text | Yes | Individual name |
| Organisation Name | Text | Conditional | Required if Organisation |
| Contact Person | Text | Conditional | Required if Organisation |
| Phone Number | Text | Yes | WhatsApp preferred |
| Email | Email | Yes | Primary contact |
| Country | Dropdown | Yes | Predefined list |
| City | Text | Yes | Free text |

### 2. Type of Support
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Support Type | Checkbox (Multi) | Yes | Can select multiple |
| - Fund Full House | Checkbox | - | Complete house funding |
| - Fund Partial House | Checkbox | - | Contribute to shared pool |
| - Provide Materials | Checkbox | - | Cement, bricks, roofing, etc. |
| - Provide Labour | Checkbox | - | Construction teams |
| - Provide Land | Checkbox | - | For resettlement |

### 3. Preferences
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Preferred Districts | Multi-select | No | Can choose multiple or "Any" |
| Family Preference | Radio | No | Children / Elderly-Disabled / Any High-Need |
| Budget/Capacity | Number | Yes | Total LKR amount |
| Timeframe | Dropdown | Yes | 1-3 months, 3-6 months, 6-12 months, Flexible |

### 4. Transparency Options
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Display Name to Beneficiaries | Radio | Yes | Yes / No / Anonymous |
| Want Regular Updates | Checkbox | Yes | Photo/video updates during construction |
| Update Frequency | Dropdown | Conditional | Weekly, Bi-weekly, Monthly |

### 5. System Fields (Auto-Generated)
| Field | Type | Notes |
|-------|------|-------|
| Donor ID | UUID | Auto-generated |
| Registration Date | DateTime | Auto timestamp |
| Status | Enum | Registered, Verified, Active, Completed, Inactive |
| Total Committed | Number | Budget total |
| Remaining Budget | Number | Updated as allocated |
| Houses Sponsored | Number | Count of projects |
| Last Activity Date | DateTime | Last interaction |

---

## C. Verification Record

### Admin/Verifier Use
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Verification Type | Dropdown | Yes | Phone, Document, Field Visit |
| Verifier Name | Reference | Yes | User ID |
| Verification Date | DateTime | Yes | When verified |
| Phone Verified | Boolean | - | OTP success |
| Documents Valid | Boolean | - | If documents provided |
| Field Visit Completed | Boolean | - | If applicable |
| Field Visit Photos | File Upload | No | Evidence from visit |
| Visit Notes | Text Area | No | Verifier observations |
| Recommendation | Radio | Yes | Approve / Reject / Need More Info |
| Priority Assessment | Number | Yes | 1-10 score |
| Notes for Admin | Text Area | No | Internal comments |

---

## D. House Project Tracking

### Project Details
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Project ID | UUID | Yes | Auto-generated |
| Beneficiary ID | Reference | Yes | Linked application |
| Estimated Cost | Number | Yes | Total LKR |
| Funded Amount | Number | Yes | Current funding |
| Funding Gap | Number | Auto | Estimated - Funded |
| Contractor Name | Text | No | If assigned |
| Contractor Contact | Text | No | Phone/email |
| Start Date | Date | No | Construction start |
| Expected Completion | Date | No | Target date |
| Actual Completion | Date | No | When finished |

### Milestones
| Milestone | Date | Photos | Status |
|-----------|------|--------|--------|
| Design Approved | DateTime | Yes | Pending/Complete |
| Foundation | DateTime | Yes | Pending/Complete |
| Walls & Structure | DateTime | Yes | Pending/Complete |
| Roofing | DateTime | Yes | Pending/Complete |
| Doors & Windows | DateTime | Yes | Pending/Complete |
| Finishing | DateTime | Yes | Pending/Complete |
| Handover | DateTime | Yes | Pending/Complete |

### Project Status
- **Looking for Donor**: Approved but not funded
- **Partially Funded**: Some funding received
- **Fully Funded - Planning**: Money secured, planning phase
- **Under Construction**: Active building
- **Completed**: House finished and handed over
- **On Hold**: Paused for some reason
- **Cancelled**: Project cancelled

---

## E. Donor Contribution Record

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Contribution ID | UUID | Yes | Auto-generated |
| Donor ID | Reference | Yes | Who contributed |
| Project ID | Reference | Yes | Which house |
| Amount | Number | Yes | LKR |
| Contribution Type | Dropdown | Yes | Full / Partial / Materials / Labour |
| Date | DateTime | Yes | When contributed |
| Payment Method | Dropdown | No | Bank Transfer, Cash, Materials, etc. |
| Receipt Issued | Boolean | Yes | Confirmation sent |
| Notes | Text | No | Additional details |

---

## Validation Rules

### NIC Validation
- Sri Lankan format: 9 digits + V/X OR 12 digits
- Must be unique in system

### Phone Validation
- Sri Lankan format: +94 or 0, followed by 9 digits
- Must be unique per application

### Email Validation
- Standard email format
- Optional for beneficiaries, required for donors

### File Upload Limits
- Max file size: 5MB per file
- Accepted formats: JPG, PNG, PDF
- Max photos: 10 per application

### Amount Validation
- Must be positive numbers
- LKR amounts only
- Minimum donation: LKR 10,000

### Date Validation
- Disaster date: Must be within last 5 years
- Future dates not allowed for past events
- Start date must be before end date
