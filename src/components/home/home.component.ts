
import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/firebase-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
})
export class HomeComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private dataService = inject(DataService);

  showAuthModal = signal(false);
  authMode = signal<'login' | 'signup'>('login');
  authError = signal<string>('');
  isLoading = signal(false);

  // Impact statistics
  totalFamiliesHelped = signal(0);
  totalDonors = signal(0);
  totalPledges = signal(0);
  
  // Approved applications and donors for display
  approvedApplications = signal<any[]>([]);
  recentDonors = signal<any[]>([]);

  currentUser$ = this.authService.user$;

  async ngOnInit() {
    await this.loadImpactData();
  }

  async loadImpactData() {
    try {
      // Load statistics
      const stats = await this.dataService.getStatistics();
      this.totalFamiliesHelped.set(stats.approvedApplications);
      this.totalDonors.set(stats.totalDonors);
      this.totalPledges.set(stats.totalPledges);

      // Load approved applications (limit to 6 for display)
      const allApplications = await this.dataService.getAll<any>('beneficiaries');
      const approved = allApplications
        .filter(app => app.status === 'approved')
        .slice(0, 6);
      this.approvedApplications.set(approved);

      // Load recent donors (limit to 6)
      const donors = await this.dataService.getAll<any>('donors');
      this.recentDonors.set(donors.slice(0, 6));
    } catch (error) {
      console.error('Error loading impact data:', error);
    }
  }

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

  // Utility method to format currency
  formatCurrency(amount: number): string {
    if (amount >= 1000000) {
      return `LKR ${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `LKR ${(amount / 1000).toFixed(0)}K`;
    }
    return `LKR ${amount}`;
  }

  // Get the first damage photo if available
  getFirstPhoto(application: any): string | null {
    if (application.documents && Array.isArray(application.documents)) {
      const damagePhotos = application.documents.filter((doc: any) => 
        doc.type === 'damagePhoto' && doc.url
      );
      return damagePhotos.length > 0 ? damagePhotos[0].url : null;
    }
    return null;
  }
}
