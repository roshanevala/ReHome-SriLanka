
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DataService } from '../../services/data.service';
import { BeneficiaryApplication, ApplicationStatus } from '../../models/models';

type AdminTab = 'pending' | 'approved' | 'donors' | 'rejected';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardComponent {
  dataService = inject(DataService);

  activeTab = signal<AdminTab>('pending');
  selectedApplication = signal<BeneficiaryApplication | null>(null);

  allApplications = this.dataService.beneficiaryApplications;
  allDonors = this.dataService.donors;
  
  pendingApplications = computed(() => this.allApplications().filter(a => a.status === 'Pending' || a.status === 'Under Verification'));
  approvedApplications = computed(() => this.allApplications().filter(a => a.status === 'Approved' || a.status === 'House In Progress' || a.status === 'Completed'));
  rejectedApplications = computed(() => this.allApplications().filter(a => a.status === 'Rejected'));

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

  updateStatus(appId: string, status: ApplicationStatus) {
    this.dataService.updateApplicationStatus(appId, status);
    if (status === 'Approved' || status === 'Rejected') {
        this.selectedApplication.set(null); // Close detail view after action
    } else {
        // Optimistically update the selected application's status
        this.selectedApplication.update(app => app ? {...app, status: status} : null);
    }
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
