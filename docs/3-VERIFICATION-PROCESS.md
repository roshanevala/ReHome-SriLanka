# Verification Process Workflow

## Overview
The verification process is critical to prevent fraud and ensure only genuine cases receive help. This document outlines the step-by-step verification workflow.

---

## Verification Stages

### Stage 1: Initial Submission
**Trigger**: Beneficiary submits application form

**Automatic Actions**:
1. Generate unique Application ID
2. Set status to `Pending`
3. Send confirmation SMS/email to applicant
4. Assign to verification queue
5. Log submission timestamp

**Notification**:
- Beneficiary receives: "Your application (ID: XXX-YYYY) has been received. You will be contacted for verification."
- Admin receives: New application notification in dashboard

---

### Stage 2: Phone Verification
**Trigger**: Application enters verification queue

**Process**:
1. System sends OTP via SMS/WhatsApp to provided number
2. Applicant enters OTP in system (or via SMS reply)
3. System validates OTP (expires in 10 minutes)
4. If successful: Mark `phone_verified = true`
5. If failed (3 attempts): Flag for manual review

**Alternative**: Admin can manually call to verify if OTP fails

**Status Update**: `Pending` → `Phone Verified`

**Notification**:
- Success: "Phone verified successfully. Your application is under review."
- Failure: "Verification failed. Our team will contact you directly."

---

### Stage 3: Document & Photo Review
**Trigger**: Phone verification complete

**Assigned To**: Admin/Verifier

**Review Checklist**:
- [ ] Photos of damage are clear and genuine
- [ ] Photos show actual house damage (not downloaded images)
- [ ] GN/DS/DMC letters present (if provided)
- [ ] Letters have official stamps/signatures
- [ ] Land ownership documents (if provided)
- [ ] NIC matches name provided
- [ ] Address matches disaster-affected area

**Red Flags** (require extra scrutiny):
- Stock photos or downloaded images
- No documents at all
- Inconsistent information
- Address not in known disaster zone
- Very new or suspicious documents

**Actions**:
1. Verifier logs into admin panel
2. Reviews all uploaded evidence
3. Checks disaster records for that area/date
4. Cross-references with known disaster zones
5. Makes notes in verification record

**Status Update**: `Phone Verified` → `Under Verification`

**Possible Outcomes**:
- **Pass**: Move to Stage 4 (Approval/Field Visit)
- **Fail**: Move to Stage 6 (Rejection)
- **Unclear**: Request additional documents or trigger field visit

---

### Stage 4: Field Verification (Optional but Recommended)
**Trigger**: 
- Admin requests field visit
- High-value applications (automatic)
- Unclear documentation
- Random audit (10% of applications)

**Who Conducts**:
- GN Officers
- Local NGO partners
- Religious organization representatives
- Trusted local volunteers
- ReBuild Homes field team

**Field Visit Process**:
1. **Pre-Visit**:
   - Contact beneficiary to schedule visit
   - Coordinate with local GN office
   - Prepare visit checklist

2. **During Visit**:
   - Verify identity (NIC check)
   - Visit actual damage site
   - Take fresh photos (with timestamp/GPS)
   - Interview family members
   - Check with neighbors if needed
   - Assess current living situation

3. **Post-Visit**:
   - Upload visit photos to system
   - Fill out field visit report
   - Provide recommendation (Approve/Reject)
   - Note any special circumstances

**Field Visit Report Template**:
```
Visit Date: _____________
Verifier Name: _____________
Beneficiary Name: _____________
Application ID: _____________

✓ Identity Verified (NIC checked)
✓ Damage Site Visited
✓ Photos Taken (uploaded)
✓ Family Interviewed

Damage Assessment:
[ ] Fully Destroyed  [ ] Partially Damaged  [ ] Minimal Damage

Current Shelter:
[ ] Relative's House  [ ] Temporary Camp  [ ] Rental  [ ] Other: _______

Family Situation:
Number of members: ___
Children: ___ | Elderly: ___ | Disabled: ___

Vulnerability Assessment (1-10): ___

Recommendation:
[ ] Strongly Recommend Approval
[ ] Approve with Standard Priority
[ ] Need More Information
[ ] Reject Application

Notes:
_________________________________________________
_________________________________________________

Verifier Signature: _____________
```

**Status Update**: `Under Verification` → `Field Verified`

---

### Stage 5: Approval & Priority Assignment
**Trigger**: All verification steps passed

**Admin Actions**:
1. Review all verification evidence
2. Calculate priority score
3. Set approval status
4. Assign priority level
5. Add to approved beneficiaries list

**Priority Score Calculation** (0-100):

| Factor | Score |
|--------|-------|
| **Damage Level** | |
| Fully Destroyed | +30 |
| Partially Damaged | +15 |
| **Family Composition** | |
| Children under 5 | +5 per child (max +15) |
| Children 5-18 | +3 per child (max +12) |
| Elderly (65+) | +5 per person (max +15) |
| Disabled members | +8 per person (max +16) |
| **Economic Situation** | |
| No income | +15 |
| Income <10k | +12 |
| Income 10-25k | +8 |
| Income 25-50k | +5 |
| **Other Factors** | |
| Single parent household | +5 |
| No land ownership | +5 |
| Multiple disasters | +5 |
| Field visit confirmed | +3 |

**Priority Levels**:
- **Critical (90-100)**: Urgent cases - fully destroyed, vulnerable families, no resources
- **High (70-89)**: Significant need - destroyed home, family with children/elderly
- **Medium (50-69)**: Moderate need - partial damage or some resources
- **Low (30-49)**: Standard need - will benefit but less urgent

**Status Update**: `Field Verified` → `Approved`

**Notifications**:
- **Beneficiary**: "Congratulations! Your application has been approved. Application ID: XXX-YYYY. Priority: [Level]. We will match you with donors soon."
- **Admin Dashboard**: Add to "Approved - Awaiting Match" list

---

### Stage 6: Rejection (with Reason)
**Trigger**: Verification fails

**Common Rejection Reasons**:
1. Duplicate application
2. False information provided
3. No actual damage found
4. Not disaster-related damage
5. Owns other properties
6. Adequate alternative housing available
7. Outside service area
8. Ineligible for other reasons

**Process**:
1. Admin documents rejection reason
2. System records reason in database
3. Status set to `Rejected`
4. Notification sent to applicant

**Status Update**: Any stage → `Rejected`

**Notification**:
- **Sensitive Approach**: "Thank you for your application (ID: XXX-YYYY). After careful review, we are unable to proceed with your application at this time. If you believe this is an error, please contact us at [contact info]."
- **Never**: Include harsh or specific rejection reasons publicly

**Data Retention**: Keep rejected applications for audit purposes (6 months)

---

## Verification Timeline

| Stage | Target Time | Maximum Time |
|-------|-------------|--------------|
| Initial Submission | Immediate | - |
| Phone Verification | 24 hours | 3 days |
| Document Review | 3 days | 7 days |
| Field Visit (if needed) | 7 days | 14 days |
| Final Approval | 1 day | 3 days |
| **Total Process** | **7-10 days** | **21 days** |

---

## Verification Dashboard

### For Admins
**View Options**:
- All pending verifications
- My assigned verifications
- Overdue verifications (past deadline)
- Flagged for review
- Recently approved
- Recently rejected

**Filters**:
- By district
- By disaster type
- By submission date
- By priority score
- By verification stage
- By verifier assigned

**Actions**:
- Assign to verifier
- Request field visit
- Approve application
- Reject application
- Request more information
- Add notes
- View full application

---

## Quality Assurance

### Random Audits
- 10% of approved applications undergo random audit
- Different verifier reviews the case
- Ensures consistency and accuracy

### Verifier Performance Metrics
- Number of verifications completed
- Average verification time
- Approval rate
- Rejection rate
- Field visit completion rate
- Quality score (from audits)

### Red Flag Monitoring
- Multiple applications from same IP
- Similar photos across applications
- Suspicious patterns in data
- Verifiers with unusual patterns

---

## Verification Best Practices

### Do's ✓
- Be thorough but fair
- Document everything
- Treat all applicants with dignity
- Verify facts, not assumptions
- Use local knowledge when available
- Follow up when uncertain
- Keep beneficiaries informed

### Don'ts ✗
- Rush through verifications
- Make assumptions based on appearance
- Share applicant details publicly
- Delay unnecessarily
- Be harsh or judgmental
- Skip steps to save time
- Ignore red flags

---

## Emergency Fast-Track Process

For urgent cases (e.g., family with newborn in unsuitable shelter):
1. Admin can flag as "Emergency Priority"
2. Phone verification done same day
3. Field visit within 48 hours
4. Approval within 3 days total
5. Immediate match with willing donors

**Criteria for Emergency**:
- Medical emergency in family
- Completely homeless (no shelter)
- Safety risk (landslide zone, flood risk)
- Newborn or very young children
- Extreme weather approaching
