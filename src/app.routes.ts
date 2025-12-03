import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { BeneficiaryFormComponent } from './components/beneficiary-form/beneficiary-form.component';
import { DonorFormComponent } from './components/donor-form/donor-form.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';

export const APP_ROUTES: Routes = [
  { path: '', component: HomeComponent, title: 'ReBuild Homes SriLanka - Home' },
  { path: 'apply-for-help', component: BeneficiaryFormComponent, title: 'ReBuild Homes SriLanka - Beneficiary Application' },
  { path: 'offer-support', component: DonorFormComponent, title: 'ReBuild Homes SriLanka - Donor Registration' },
  { path: 'admin', component: AdminDashboardComponent, title: 'ReBuild Homes SriLanka - Admin Dashboard' },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];