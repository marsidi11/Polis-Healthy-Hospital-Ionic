import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageClinicalRecordsPage } from './manage-clinical-records.page';

const routes: Routes = [
  {
    path: '',
    component: ManageClinicalRecordsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageClinicalRecordsPageRoutingModule {}
