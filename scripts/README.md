# Scripts Documentation

This directory contains utility scripts for managing the ReBuild Homes SriLanka application.

## 📄 Available Scripts

### `set-admin.mjs`

A secure utility for granting administrative privileges to users via Firebase custom claims.

#### Purpose
Grants `admin: true` custom claims to a specified user account, allowing them to access the Admin Dashboard and perform administrative functions.

#### Prerequisites
- Firebase Admin SDK service account key
- User must already be registered in Firebase Authentication

#### Setup

1. **Get Service Account Key**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Navigate to: Project Settings → Service Accounts
   - Click "Generate new private key"
   - Save the JSON file securely (e.g., `~/.configs/firebase/rehome-admin.json`)
   - **⚠️ NEVER commit this file to git or share it publicly!**

2. **Set Environment Variable**
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS="$HOME/.configs/firebase/rehome-admin.json"
   ```

   Optionally set your Firebase project ID (will be inferred from credentials if not set):
   ```bash
   export FIREBASE_PROJECT_ID="your-project-id"
   ```

#### Usage

**Preview (Dry Run)**
```bash
node scripts/set-admin.mjs user@example.com --dry-run
```

**Apply Changes**
```bash
node scripts/set-admin.mjs user@example.com --confirm
```

#### Arguments

- `<email>` - User email address (required)
- `--dry-run` - Preview the change without applying it
- `--confirm` - Apply the change (required to make actual changes)

#### Examples

```bash
# Check what would happen (safe, no changes)
node scripts/set-admin.mjs alice@example.com --dry-run

# Actually grant admin access
node scripts/set-admin.mjs alice@example.com --confirm

# Set environment variable inline (one-time use)
GOOGLE_APPLICATION_CREDENTIALS="$HOME/.configs/firebase/key.json" \
  node scripts/set-admin.mjs bob@example.com --confirm
```

#### Important Notes

1. **User Must Reauthenticate**: After granting admin access, the user must sign out and sign back in for the new permissions to take effect. This refreshes their authentication token with the new custom claims.

2. **Security**: 
   - Store service account keys outside the repository
   - Use environment variables for paths
   - Never commit keys to version control
   - Restrict access to the key file (chmod 600)
   - Use different keys for development and production

3. **Verification**:
   ```bash
   # After running the script successfully
   # 1. User signs out of the application
   # 2. User signs back in
   # 3. Admin Dashboard link should now appear in the navigation
   ```

4. **Error Handling**:
   - If the email doesn't exist, you'll see: `Error: User not found`
   - If credentials are missing: `Error: GOOGLE_APPLICATION_CREDENTIALS not set`
   - If the file path is wrong: `Error: Credentials file not found`

#### Troubleshooting

**"GOOGLE_APPLICATION_CREDENTIALS not set"**
- Set the environment variable before running the script
- Use absolute path to the service account key file

**"User not found"**
- Ensure the user has registered in the application first
- Check the email spelling
- Verify you're using the correct Firebase project

**"Permission denied"**
- Verify your service account key has the correct permissions
- Ensure you're using an Admin SDK key, not a web API key

**Changes not taking effect**
- User must sign out and sign back in
- Clear browser cache and cookies
- Check browser console for errors
- Verify custom claims in Firebase Console: Authentication → Users → (select user) → Custom claims

#### Security Best Practices

1. **Key Storage**:
   ```bash
   # Create a secure location
   mkdir -p ~/.configs/firebase
   chmod 700 ~/.configs/firebase
   
   # Move your key there
   mv ~/Downloads/serviceAccountKey.json ~/.configs/firebase/rehome-admin.json
   chmod 600 ~/.configs/firebase/rehome-admin.json
   ```

2. **Add to Shell Profile** (for persistent environment variable):
   ```bash
   # Add to ~/.zshrc or ~/.bashrc
   export GOOGLE_APPLICATION_CREDENTIALS="$HOME/.configs/firebase/rehome-admin.json"
   ```

3. **Different Keys for Environments**:
   - Development: `rehome-dev-admin.json`
   - Staging: `rehome-staging-admin.json`
   - Production: `rehome-prod-admin.json`

#### Advanced Usage

**Revoking Admin Access**:
Currently not implemented in this script. To revoke admin access, you'll need to:
1. Use Firebase Console: Authentication → Users → Custom claims
2. Or create a similar script that sets `admin: false`

**Checking Current Claims**:
```bash
# You can verify claims in Firebase Console:
# Authentication → Users → (select user) → Custom claims should show {"admin": true}
```

## 🔐 Security Reminders

- ❌ Never commit service account keys to git
- ❌ Never share service account keys publicly
- ❌ Never use production keys in development
- ✅ Store keys outside the project directory
- ✅ Use environment variables for paths
- ✅ Restrict file permissions (chmod 600)
- ✅ Use different keys for each environment
- ✅ Rotate keys regularly

## 📚 Related Documentation

- [Firebase Setup Guide](../docs/10-FIREBASE-SETUP.md)
- [User Roles & Permissions](../docs/6-USER-ROLES-PERMISSIONS.md)
- [Security & Privacy](../docs/7-SECURITY-PRIVACY.md)
- [Firebase Admin SDK Documentation](https://firebase.google.com/docs/admin/setup)
