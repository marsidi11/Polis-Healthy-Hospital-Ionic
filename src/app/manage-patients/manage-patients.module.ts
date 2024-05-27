import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManagePatientsPageRoutingModule } from './manage-patients-routing.module';

import { ManagePatientsPage } from './manage-patients.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManagePatientsPageRoutingModule
  ],
  declarations: [ManagePatientsPage]
})
export class ManagePatientsPageModule {}
