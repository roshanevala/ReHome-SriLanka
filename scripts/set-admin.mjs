#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import admin from 'firebase-admin'

function printUsage() {
  console.log(`\nUsage:\n  node scripts/set-admin.mjs <email> [--confirm] [--dry-run]\n\nEnv vars:\n  GOOGLE_APPLICATION_CREDENTIALS: path to service account JSON (required)\n  FIREBASE_PROJECT_ID: your Firebase project ID (optional, inferred from creds)\n`)
}

function isValidEmail(email) {
  return /.+@.+\..+/.test(email)
}

function requireCreds() {
  const credsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS
  if (!credsPath) {
    console.error('Error: GOOGLE_APPLICATION_CREDENTIALS not set.')
    printUsage()
    process.exit(1)
  }
  if (!fs.existsSync(credsPath)) {
    console.error(`Error: Credentials file not found at ${credsPath}`)
    process.exit(1)
  }
  return credsPath
}

async function main() {
  const [email, ...flags] = process.argv.slice(2)
  const confirm = flags.includes('--confirm')
  const dryRun = flags.includes('--dry-run')

  if (!email || !isValidEmail(email)) {
    console.error('Error: Provide a valid user email.')
    printUsage()
    process.exit(1)
  }

  const credsPath = requireCreds()
  const creds = JSON.parse(fs.readFileSync(credsPath, 'utf-8'))

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(creds),
      projectId: process.env.FIREBASE_PROJECT_ID || creds.project_id,
    })
  }

  const auth = admin.auth()

  // Try to find the user by email
  let user
  try {
    user = await auth.getUserByEmail(email)
  } catch (err) {
    console.error(`Error: Cannot find user by email: ${email}`)
    console.error(err.message || err)
    process.exit(1)
  }

  const currentClaims = user.customClaims || {}
  console.log(`User: ${user.uid}`)
  console.log('Current claims:', currentClaims)

  if (currentClaims.admin === true) {
    console.log('User already has admin=true. Nothing to change.')
    process.exit(0)
  }

  const newClaims = { ...currentClaims, admin: true }

  if (dryRun && !confirm) {
    console.log('[DRY RUN] Would set claims to:', newClaims)
    process.exit(0)
  }

  if (!confirm) {
    console.error('Refusing to modify claims without --confirm flag.')
    console.log('Tip: Run with --dry-run to preview changes.')
    process.exit(1)
  }

  try {
    await auth.setCustomUserClaims(user.uid, newClaims)
    console.log('Success: admin=true claim set.')
    console.log('Note: User needs to refresh token (sign out/in).')
  } catch (err) {
    console.error('Failed to set custom claims:', err.message || err)
    process.exit(1)
  }
}

main().catch((e) => {
  console.error('Unexpected error:', e)
  process.exit(1)
})
