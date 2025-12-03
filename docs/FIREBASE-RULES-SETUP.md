# Firebase Security Rules Setup

## Overview
Firebase Security Rules have been created for both Firestore and Storage. These need to be deployed to allow the application to function properly.

## Quick Deploy (Recommended)

Run this command to deploy the security rules:

```bash
firebase deploy --only firestore:rules,storage:rules
```

If you get an API error, wait a minute and try again after Firebase enables the required APIs.

## Manual Setup via Firebase Console

If you prefer to set up manually or the CLI isn't working:

### 1. Firestore Rules

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **rebuild-homes-srilanka**
3. Navigate to **Firestore Database** → **Rules** tab
4. Copy the contents from `firestore.rules` file
5. Paste into the rules editor
6. Click **Publish**

### 2. Storage Rules

1. In Firebase Console, navigate to **Storage** → **Rules** tab
2. Copy the contents from `storage.rules` file
3. Paste into the rules editor
4. Click **Publish**

## What These Rules Do

### Firestore Rules
- **Beneficiaries**: Authenticated users can create applications, admins can update/delete
- **Donors**: Authenticated users can register, admins have full access
- **Users**: Users can read and manage their own data
- **Pledges, Projects**: Admin-only write access
- **Public Read**: Statistics and projects are publicly readable

### Storage Rules
- **File Uploads**: Authenticated users can upload images/PDFs up to 10MB
- **Beneficiary Documents**: Uploaded to `beneficiaries/{id}/` path
- **Project Photos**: Public read, authenticated write
- **Validation**: Only images and PDFs allowed, size limits enforced

## Testing

After deploying the rules, test by:

1. **Sign up** for a new account
2. **Submit** a beneficiary application with file uploads
3. **Verify** that data appears in Firestore and files in Storage
4. Check Firebase Console → Firestore Database to see your application
5. Check Firebase Console → Storage to see uploaded files

## Troubleshooting

### "Missing or insufficient permissions"
- Make sure rules are deployed
- Verify you're logged in (check auth state in the app)
- Check Firebase Console → Authentication to see if user exists

### File Upload Fails
- Verify Storage rules are deployed
- Check file size (must be under 10MB)
- Check file type (only images and PDFs allowed)
- Verify Storage bucket is set up in Firebase project

### Still Not Working?
1. Check browser console for detailed error messages
2. Go to Firebase Console → Firestore → Rules → Playground to test rules
3. Verify your Firebase config in `src/environments/environment.ts`

## Security Notes

⚠️ **Production Recommendations:**
- The current admin check is basic. For production, use Firebase Custom Claims
- Add rate limiting for form submissions
- Consider adding CAPTCHA for public forms
- Add server-side validation with Cloud Functions
- Implement audit logging for admin actions

## Next Steps

After deploying rules:
1. Test form submission end-to-end
2. Create an admin user (add custom claim via Firebase Console)
3. Test admin dashboard functionality
4. Set up Firebase indexes if needed for complex queries
