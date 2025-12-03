
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/firebase-data.service';
import { StorageService } from '../../services/storage.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-beneficiary-form',
  templateUrl: './beneficiary-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, CommonModule],
})
export class BeneficiaryFormComponent {
  private fb = inject(FormBuilder);
  private dataService = inject(DataService);
  private storageService = inject(StorageService);
  private authService = inject(AuthService);
  private router = inject(Router);

  formStatus = signal<'idle' | 'submitting' | 'success' | 'error'>('idle');
  errorMessage = signal<string>('');
  
  // File upload signals
  selectedFiles = signal<{
    damagePhotos: File[];
    nic: File | null;
    incomeProof: File | null;
    landDeed: File | null;
  }>({
    damagePhotos: [],
    nic: null,
    incomeProof: null,
    landDeed: null
  });

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

  onFileSelect(event: Event, fileType: string) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const files = this.selectedFiles();
    
    if (fileType === 'damagePhotos') {
      files.damagePhotos = Array.from(input.files);
    } else if (fileType === 'nic') {
      files.nic = input.files[0];
    } else if (fileType === 'incomeProof') {
      files.incomeProof = input.files[0];
    } else if (fileType === 'landDeed') {
      files.landDeed = input.files[0];
    }
    
    this.selectedFiles.set({ ...files });
  }

  async onSubmit() {
    if (this.applicationForm.invalid) {
      this.applicationForm.markAllAsTouched();
      return;
    }
    
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.errorMessage.set('You must be logged in to submit an application');
      this.formStatus.set('error');
      return;
    }

    this.formStatus.set('submitting');
    
    try {
      // Create application in Firestore
      const applicationId = await this.dataService.createBeneficiaryApplication({
        ...this.applicationForm.value,
        userId: user.uid,
        userEmail: user.email,
        status: 'pending',
        createdAt: new Date().toISOString()
      });

      // Upload files to Firebase Storage
      const files = this.selectedFiles();
      const filesToUpload: { type: string; file: File }[] = [];
      
      if (files.damagePhotos.length > 0) {
        files.damagePhotos.forEach(file => {
          filesToUpload.push({ type: 'damagePhotos', file });
        });
      }
      if (files.nic) filesToUpload.push({ type: 'nic', file: files.nic });
      if (files.incomeProof) filesToUpload.push({ type: 'incomeProof', file: files.incomeProof });
      if (files.landDeed) filesToUpload.push({ type: 'landDeed', file: files.landDeed });

      if (filesToUpload.length > 0) {
        const uploadedFiles = await this.storageService.uploadBeneficiaryDocuments(
          applicationId,
          filesToUpload
        );

        // Update application with file URLs
        await this.dataService.update('beneficiaries', applicationId, {
          documents: uploadedFiles
        });
      }

      this.formStatus.set('success');
      setTimeout(() => this.router.navigate(['/']), 3000);
      
    } catch (error: any) {
      console.error('Error submitting application:', error);
      this.errorMessage.set(error.message || 'Failed to submit application');
      this.formStatus.set('error');
    }
  }

  isInvalid(controlName: string): boolean {
    const control = this.applicationForm.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }
}
