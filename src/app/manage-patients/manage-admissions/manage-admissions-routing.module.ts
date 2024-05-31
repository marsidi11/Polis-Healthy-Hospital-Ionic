import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageAdmissionsPage } from './manage-admissions.page';

const routes: Routes = [
  {
    path: '',
    component: ManageAdmissionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageAdmissionsPageRoutingModule {}
