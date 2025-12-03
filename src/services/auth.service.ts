import { Injectable, inject } from '@angular/core';
import { 
  Auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  User,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential
} from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  
  // Observable of current user
  user$: Observable<User | null> = new Observable((observer) => {
    const unsubscribe = onAuthStateChanged(this.auth, (user) => {
      observer.next(user);
    });
    return () => unsubscribe();
  });

  // Get current user
  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  // Email/Password Sign Up
  async signUp(email: string, password: string, displayName?: string): Promise<User> {
    const credential = await createUserWithEmailAndPassword(this.auth, email, password);
    if (displayName && credential.user) {
      await updateProfile(credential.user, { displayName });
    }
    return credential.user;
  }

  // Email/Password Sign In
  async signIn(email: string, password: string): Promise<User> {
    const credential = await signInWithEmailAndPassword(this.auth, email, password);
    return credential.user;
  }

  // Sign Out
  async logout(): Promise<void> {
    return signOut(this.auth);
  }

  // Password Reset
  async resetPassword(email: string): Promise<void> {
    return sendPasswordResetEmail(this.auth, email);
  }

  // Phone Authentication
  async setupRecaptcha(elementId: string): Promise<RecaptchaVerifier> {
    return new RecaptchaVerifier(this.auth, elementId, {
      size: 'invisible'
    });
  }

  async sendPhoneVerificationCode(
    phoneNumber: string, 
    recaptchaVerifier: RecaptchaVerifier
  ): Promise<any> {
    return signInWithPhoneNumber(this.auth, phoneNumber, recaptchaVerifier);
  }

  async verifyPhoneCode(verificationId: string, code: string): Promise<User> {
    const credential = PhoneAuthProvider.credential(verificationId, code);
    const result = await signInWithCredential(this.auth, credential);
    return result.user;
  }

  // Check if user is admin (checks custom claims)
  async isAdmin(): Promise<boolean> {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    // Force token refresh to get latest claims
    const idTokenResult = await user.getIdTokenResult(true);
    return !!idTokenResult.claims['admin'];
  }

  // Check if user is verifier
  async isVerifier(): Promise<boolean> {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    const idTokenResult = await user.getIdTokenResult();
    return !!idTokenResult.claims['verifier'];
  }
}
