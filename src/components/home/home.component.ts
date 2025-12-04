
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
})
export class HomeComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  showAuthModal = signal(false);
  authMode = signal<'login' | 'signup'>('login');
  authError = signal<string>('');
  isLoading = signal(false);

  currentUser$ = this.authService.user$;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  signupForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  });

  openAuthModal(mode: 'login' | 'signup') {
    this.authMode.set(mode);
    this.showAuthModal.set(true);
    this.authError.set('');
  }

  closeAuthModal() {
    this.showAuthModal.set(false);
    this.loginForm.reset();
    this.signupForm.reset();
    this.authError.set('');
  }

  switchMode() {
    this.authMode.set(this.authMode() === 'login' ? 'signup' : 'login');
    this.authError.set('');
  }

  async onLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.authError.set('');

    try {
      await this.authService.signIn(
        this.loginForm.value.email!,
        this.loginForm.value.password!
      );
      this.closeAuthModal();
    } catch (error: any) {
      this.authError.set(error.message || 'Login failed. Please check your credentials.');
    } finally {
      this.isLoading.set(false);
    }
  }

  async onGoogleLogin() {
    this.isLoading.set(true);
    this.authError.set('');

    try {
      await this.authService.signInWithGoogle();
      this.closeAuthModal();
    } catch (error: any) {
      this.authError.set(error.message || 'Google sign-in failed. Please try again.');
    } finally {
      this.isLoading.set(false);
    }
  }

  async onSignup() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    const password = this.signupForm.value.password;
    const confirmPassword = this.signupForm.value.confirmPassword;

    if (password !== confirmPassword) {
      this.authError.set('Passwords do not match');
      return;
    }

    this.isLoading.set(true);
    this.authError.set('');

    try {
      await this.authService.signUp(
        this.signupForm.value.email!,
        this.signupForm.value.password!,
        this.signupForm.value.name!
      );
      this.closeAuthModal();
    } catch (error: any) {
      this.authError.set(error.message || 'Signup failed. Please try again.');
    } finally {
      this.isLoading.set(false);
    }
  }

  async logout() {
    try {
      await this.authService.logout();
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
}
