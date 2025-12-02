
export type ApplicationStatus = 'Pending' | 'Under Verification' | 'Approved' | 'Rejected' | 'House In Progress' | 'Completed';

export interface BeneficiaryApplication {
  id: string;
  fullName: string;
  nic: string;
  phone: string;
  email?: string;
  addressBefore: string;
  currentAddress: string;
  disasterType: 'Flood' | 'Landslide' | 'Other';
  disasterDate: string;
  district: string;
  gnDivision: string;
  description: string;
  damageLevel: 'Fully Destroyed' | 'Partially Damaged';
  familyMembers: number;
  familyComposition: string; // e.g., "2 adults, 3 children"
  monthlyIncome: string;
  hasLandDeed: boolean;
  status: ApplicationStatus;
  priorityScore: number;
  photos: string[];
  documents: string[];
}

export type DonorType = 'Individual' | 'Organisation';
export type SupportType = 'Fund Full House' | 'Fund Part of House' | 'Provide Materials' | 'Provide Labour' | 'Provide Land';

export interface Donor {
  id: string;
  donorType: DonorType;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  country: string;
  supportType: SupportType[];
  budget: number;
  preferredDistrict: string;
  timeframe: string; // e.g., "1-3 months"
  displayName: boolean;
  wantsUpdates: boolean;
  status: 'Registered' | 'Verified' | 'Active' | 'Completed';
}
