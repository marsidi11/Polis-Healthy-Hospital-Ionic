import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageDepartmentsPage } from './manage-departments.page';

const routes: Routes = [
  {
    path: '',
    component: ManageDepartmentsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageDepartmentsPageRoutingModule {}
