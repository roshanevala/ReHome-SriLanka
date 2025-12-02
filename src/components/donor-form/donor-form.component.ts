
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { SupportType } from '../../models/models';

@Component({
  selector: 'app-donor-form',
  templateUrl: './donor-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
})
export class DonorFormComponent {
  private fb = inject(FormBuilder);
  private dataService = inject(DataService);
  private router = inject(Router);

  formStatus = signal<'idle' | 'submitting' | 'success'>('idle');

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

  onSubmit() {
    if (this.donorForm.invalid) {
      this.donorForm.markAllAsTouched();
      return;
    }

    this.formStatus.set('submitting');
    
    setTimeout(() => {
      const formValue = this.donorForm.value;
      const selectedSupportTypes: SupportType[] = [];
      if (formValue.supportTypeFundFull) selectedSupportTypes.push('Fund Full House');
      if (formValue.supportTypeFundPart) selectedSupportTypes.push('Fund Part of House');
      if (formValue.supportTypeMaterials) selectedSupportTypes.push('Provide Materials');
      if (formValue.supportTypeLabour) selectedSupportTypes.push('Provide Labour');
      if (formValue.supportTypeLand) selectedSupportTypes.push('Provide Land');

      this.dataService.addDonor({
        donorType: formValue.donorType as 'Individual' | 'Organisation',
        name: formValue.name!,
        contactPerson: formValue.contactPerson!,
        phone: formValue.phone!,
        email: formValue.email!,
        country: formValue.country!,
        supportType: selectedSupportTypes,
        budget: formValue.budget!,
        preferredDistrict: formValue.preferredDistrict!,
        timeframe: formValue.timeframe!,
        displayName: formValue.displayName!,
        wantsUpdates: formValue.wantsUpdates!,
      });
      this.formStatus.set('success');
      setTimeout(() => this.router.navigate(['/']), 3000);
    }, 1500);
  }

  isInvalid(controlName: string): boolean {
    const control = this.donorForm.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }
}
