import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManagePatientsPage } from './manage-patients.page';

const routes: Routes = [
  {
    path: '',
    component: ManagePatientsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagePatientsPageRoutingModule {}
