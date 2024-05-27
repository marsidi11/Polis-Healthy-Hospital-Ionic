import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageDepartmentsPageRoutingModule } from './manage-departments-routing.module';

import { ManageDepartmentsPage } from './manage-departments.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageDepartmentsPageRoutingModule
  ],
  declarations: [ManageDepartmentsPage]
})
export class ManageDepartmentsPageModule {}
