import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManagePatientsPage } from './manage-patients.page';

const routes: Routes = [
  {
    path: '',
    component: ManagePatientsPage
  },  {
    path: 'manage-admissions',
    loadChildren: () => import('./manage-admissions/manage-admissions.module').then( m => m.ManageAdmissionsPageModule)
  },
  {
    path: 'manage-clinical-records',
    loadChildren: () => import('./manage-clinical-records/manage-clinical-records.module').then( m => m.ManageClinicalRecordsPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagePatientsPageRoutingModule {}
