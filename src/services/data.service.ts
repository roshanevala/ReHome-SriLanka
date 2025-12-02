
import { Injectable, signal } from '@angular/core';
import { BeneficiaryApplication, Donor, ApplicationStatus } from '../models/models';

@Injectable({ providedIn: 'root' })
export class DataService {
  private _beneficiaryApplications = signal<BeneficiaryApplication[]>([
    {
      id: 'APP-001',
      fullName: 'Kamal Perera',
      nic: '198512345V',
      phone: '0771234567',
      addressBefore: '123, Main St, Ratnapura',
      currentAddress: 'Community Hall, Ratnapura',
      disasterType: 'Flood',
      disasterDate: '2024-05-15',
      district: 'Ratnapura',
      gnDivision: 'Div-01',
      description: 'House was completely submerged and collapsed.',
      damageLevel: 'Fully Destroyed',
      familyMembers: 4,
      familyComposition: '2 adults, 2 children (ages 5, 8)',
      monthlyIncome: 'LKR 30,000 - 50,000',
      hasLandDeed: true,
      status: 'Pending',
      priorityScore: 85,
      photos: [],
      documents: []
    },
    {
      id: 'APP-002',
      fullName: 'Nimala Silva',
      nic: '197023456V',
      phone: '0712345678',
      addressBefore: '45, Hillside Rd, Kandy',
      currentAddress: 'Relative\'s house, Kandy',
      disasterType: 'Landslide',
      disasterDate: '2024-05-20',
      district: 'Kandy',
      gnDivision: 'Div-05',
      description: 'Back wall of the house collapsed due to landslide.',
      damageLevel: 'Partially Damaged',
      familyMembers: 3,
      familyComposition: '1 adult, 2 elderly parents',
      monthlyIncome: '< LKR 30,000',
      hasLandDeed: false,
      status: 'Approved',
      priorityScore: 92,
      photos: [],
      documents: []
    }
  ]);
  
  private _donors = signal<Donor[]>([
    {
      id: 'DON-001',
      donorType: 'Organisation',
      name: 'Global Aid Foundation',
      contactPerson: 'John Doe',
      phone: '0112345678',
      email: 'contact@globalaid.org',
      country: 'USA',
      supportType: ['Fund Full House'],
      budget: 5000000,
      preferredDistrict: 'Any',
      timeframe: 'Immediately',
      displayName: true,
      wantsUpdates: true,
      status: 'Verified'
    }
  ]);

  beneficiaryApplications = this._beneficiaryApplications.asReadonly();
  donors = this._donors.asReadonly();

  addBeneficiaryApplication(application: Omit<BeneficiaryApplication, 'id' | 'status' | 'priorityScore'>) {
    const newApp: BeneficiaryApplication = {
      ...application,
      id: `APP-${Date.now().toString().slice(-4)}`,
      status: 'Pending',
      priorityScore: Math.floor(Math.random() * 40) + 60, // Random score for demo
    };
    this._beneficiaryApplications.update(apps => [...apps, newApp]);
  }

  addDonor(donor: Omit<Donor, 'id' | 'status'>) {
    const newDonor: Donor = {
      ...donor,
      id: `DON-${Date.now().toString().slice(-4)}`,
      status: 'Registered',
    };
    this._donors.update(donors => [...donors, newDonor]);
  }
  
  updateApplicationStatus(appId: string, status: ApplicationStatus) {
    this._beneficiaryApplications.update(apps => 
      apps.map(app => app.id === appId ? { ...app, status } : app)
    );
  }
}
