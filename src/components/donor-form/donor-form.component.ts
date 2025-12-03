
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/firebase-data.service';
import { AuthService } from '../../services/auth.service';
import { SupportType } from '../../models/models';

@Component({
  selector: 'app-donor-form',
  templateUrl: './donor-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, CommonModule],
})
export class DonorFormComponent {
  private fb = inject(FormBuilder);
  private dataService = inject(DataService);
  private authService = inject(AuthService);
  private router = inject(Router);

  formStatus = signal<'idle' | 'submitting' | 'success' | 'error'>('idle');
  errorMessage = signal<string>('');

  supportTypes: SupportType[] = ['Fund Full House', 'Fund Part of House', 'Provide Materials', 'Provide Labour', 'Provide Land'];

  donorForm = this.fb.group({
    donorType: ['Individual', Validators.required],
    name: ['', Validators.required],
    contactPerson: [''],
    phone: ['', [Validators.required, Validators.pattern('^0[0-9]{9}$')]],
    email: ['', [Validators.required, Validators.email]],
    country: ['', Validators.required],
    supportTypeFundFull: [false],
    supportTypeFundPart: [false],
    supportTypeMaterials: [false],
    supportTypeLabour: [false],
    supportTypeLand: [false],
    budget: [0, Validators.min(0)],
    preferredDistrict: ['Any'],
    timeframe: ['1-3 months', Validators.required],
    displayName: [false, Validators.required],
    wantsUpdates: [true, Validators.required],
  });

  constructor() {
    this.donorForm.get('donorType')?.valueChanges.subscribe(value => {
      const contactPersonControl = this.donorForm.get('contactPerson');
      if (value === 'Organisation') {
        contactPersonControl?.setValidators([Validators.required]);
      } else {
        contactPersonControl?.clearValidators();
      }
      contactPersonControl?.updateValueAndValidity();
    });
  }

  async onSubmit() {
    if (this.donorForm.invalid) {
      this.donorForm.markAllAsTouched();
      return;
    }

    const user = this.authService.getCurrentUser();
    if (!user) {
      this.errorMessage.set('You must be logged in to register as a donor');
      this.formStatus.set('error');
      return;
    }

    this.formStatus.set('submitting');

    try {
      // Build support types array from checkboxes
      const supportTypes: string[] = [];
      if (this.donorForm.value.supportTypeFundFull) supportTypes.push('Fund Full House');
      if (this.donorForm.value.supportTypeFundPart) supportTypes.push('Fund Part of House');
      if (this.donorForm.value.supportTypeMaterials) supportTypes.push('Provide Materials');
      if (this.donorForm.value.supportTypeLabour) supportTypes.push('Provide Labour');
      if (this.donorForm.value.supportTypeLand) supportTypes.push('Provide Land');

      // Create donor record in Firestore
      await this.dataService.createDonor({
        userId: user.uid,
        userEmail: user.email,
        donorType: this.donorForm.value.donorType,
        name: this.donorForm.value.name,
        contactPerson: this.donorForm.value.contactPerson || null,
        phone: this.donorForm.value.phone,
        email: this.donorForm.value.email,
        country: this.donorForm.value.country,
        supportTypes,
        budget: this.donorForm.value.budget || 0,
        preferredDistrict: this.donorForm.value.preferredDistrict,
        timeframe: this.donorForm.value.timeframe,
        displayName: this.donorForm.value.displayName,
        wantsUpdates: this.donorForm.value.wantsUpdates,
        status: 'active',
        createdAt: new Date().toISOString()
      });

      this.formStatus.set('success');
      setTimeout(() => this.router.navigate(['/']), 3000);

    } catch (error: any) {
      console.error('Error registering donor:', error);
      this.errorMessage.set(error.message || 'Failed to register. Please try again.');
      this.formStatus.set('error');
    }
  }

  isInvalid(controlName: string): boolean {
    const control = this.donorForm.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }
}
