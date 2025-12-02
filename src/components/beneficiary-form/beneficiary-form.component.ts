
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-beneficiary-form',
  templateUrl: './beneficiary-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
})
export class BeneficiaryFormComponent {
  private fb = inject(FormBuilder);
  private dataService = inject(DataService);
  private router = inject(Router);

  formStatus = signal<'idle' | 'submitting' | 'success'>('idle');

  applicationForm = this.fb.group({
    fullName: ['', Validators.required],
    nic: ['', Validators.required],
    phone: ['', [Validators.required, Validators.pattern('^0[0-9]{9}$')]],
    email: ['', Validators.email],
    addressBefore: ['', Validators.required],
    currentAddress: ['', Validators.required],
    disasterType: ['Flood', Validators.required],
    disasterDate: ['', Validators.required],
    district: ['', Validators.required],
    gnDivision: ['', Validators.required],
    description: ['', Validators.required],
    damageLevel: ['Fully Destroyed', Validators.required],
    familyMembers: [1, [Validators.required, Validators.min(1)]],
    familyComposition: ['', Validators.required],
    monthlyIncome: ['< LKR 30,000', Validators.required],
    hasLandDeed: [false, Validators.required],
    consentData: [false, Validators.requiredTrue],
    consentTruth: [false, Validators.requiredTrue],
  });

  onSubmit() {
    if (this.applicationForm.invalid) {
      this.applicationForm.markAllAsTouched();
      return;
    }
    
    this.formStatus.set('submitting');
    
    // In a real app, this would be an async API call
    setTimeout(() => {
      const formValue = this.applicationForm.value;
      this.dataService.addBeneficiaryApplication({
        fullName: formValue.fullName!,
        nic: formValue.nic!,
        phone: formValue.phone!,
        email: formValue.email || undefined,
        addressBefore: formValue.addressBefore!,
        currentAddress: formValue.currentAddress!,
        disasterType: formValue.disasterType as 'Flood' | 'Landslide' | 'Other',
        disasterDate: formValue.disasterDate!,
        district: formValue.district!,
        gnDivision: formValue.gnDivision!,
        description: formValue.description!,
        damageLevel: formValue.damageLevel as 'Fully Destroyed' | 'Partially Damaged',
        familyMembers: formValue.familyMembers!,
        familyComposition: formValue.familyComposition!,
        monthlyIncome: formValue.monthlyIncome!,
        hasLandDeed: formValue.hasLandDeed!,
        photos: [], // Handled separately
        documents: [], // Handled separately
      });
      this.formStatus.set('success');
      setTimeout(() => this.router.navigate(['/']), 3000);
    }, 1500);
  }

  isInvalid(controlName: string): boolean {
    const control = this.applicationForm.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }
}
