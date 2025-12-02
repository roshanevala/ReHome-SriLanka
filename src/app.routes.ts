import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { BeneficiaryFormComponent } from './components/beneficiary-form/beneficiary-form.component';
import { DonorFormComponent } from './components/donor-form/donor-form.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';

export const APP_ROUTES: Routes = [
  { path: '', component: HomeComponent, title: 'ReHome Sri Lanka - Home' },
  { path: 'apply-for-help', component: BeneficiaryFormComponent, title: 'ReHome Sri Lanka - Beneficiary Application' },
  { path: 'offer-support', component: DonorFormComponent, title: 'ReHome Sri Lanka - Donor Registration' },
  { path: 'admin', component: AdminDashboardComponent, title: 'ReHome Sri Lanka - Admin Dashboard' },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];