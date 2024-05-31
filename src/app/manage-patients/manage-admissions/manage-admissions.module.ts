import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageAdmissionsPageRoutingModule } from './manage-admissions-routing.module';

import { ManageAdmissionsPage } from './manage-admissions.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageAdmissionsPageRoutingModule
  ],
  declarations: [ManageAdmissionsPage]
})
export class ManageAdmissionsPageModule {}
