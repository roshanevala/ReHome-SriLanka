
import { ChangeDetectionStrategy, Component, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/firebase-data.service';
import { where, orderBy } from '@angular/fire/firestore';
import { ApplicationStatus } from '../../models/models';

interface BeneficiaryApplication {
  id?: string;
  fullName: string;
  status: string;
  district: string;
  disasterType: string;
  createdAt: string;
  [key: string]: any;
}

interface Statistics {
  totalBeneficiaries: number;
  totalDonors: number;
  totalPledges: number;
  pendingApplications: number;
  approvedApplications: number;
}

type AdminTab = 'overview' | 'pending' | 'approved' | 'rejected' | 'donors';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class AdminDashboardComponent implements OnInit {
  private dataService = inject(DataService);

  activeTab = signal<AdminTab>('overview');
  selectedApplication = signal<BeneficiaryApplication | null>(null);
  statistics = signal<Statistics>({
    totalBeneficiaries: 0,
    totalDonors: 0,
    totalPledges: 0,
    pendingApplications: 0,
    approvedApplications: 0
  });

  allApplications = signal<BeneficiaryApplication[]>([]);
  pendingApplications = signal<BeneficiaryApplication[]>([]);
  approvedApplications = signal<BeneficiaryApplication[]>([]);
  rejectedApplications = signal<BeneficiaryApplication[]>([]);
  allDonors = signal<any[]>([]);
  
  isLoading = signal(false);

  async ngOnInit() {
    await this.loadData();
  }

  async loadData() {
    this.isLoading.set(true);
    try {
      // Load statistics
      const stats = await this.dataService.getStatistics();
      this.statistics.set(stats);

      // Load all applications
      const applications = await this.dataService.getAll<BeneficiaryApplication>('beneficiaries');
      this.allApplications.set(applications);

      // Filter by status
      this.pendingApplications.set(applications.filter(a => a.status === 'pending'));
      this.approvedApplications.set(applications.filter(a => a.status === 'approved'));
      this.rejectedApplications.set(applications.filter(a => a.status === 'rejected'));

      // Load donors
      const donors = await this.dataService.getAll('donors');
      this.allDonors.set(donors);

    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  changeTab(tab: AdminTab) {
    this.activeTab.set(tab);
    this.selectedApplication.set(null);
  }

  selectApplication(application: BeneficiaryApplication) {
    this.selectedApplication.set(application);
  }

  closeDetailView() {
    this.selectedApplication.set(null);
  }

  async updateStatus(appId: string, status: string) {
    try {
      await this.dataService.updateApplicationStatus(appId, status);
      await this.loadData(); // Reload data
      this.selectedApplication.set(null);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  }

  async approveApplication(appId: string) {
    await this.updateStatus(appId, 'approved');
  }

  async rejectApplication(appId: string) {
    await this.updateStatus(appId, 'rejected');
  }

  getStatusColor(status: ApplicationStatus): string {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Under Verification': return 'bg-blue-100 text-blue-800';
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'House In Progress': return 'bg-indigo-100 text-indigo-800';
      case 'Completed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}
