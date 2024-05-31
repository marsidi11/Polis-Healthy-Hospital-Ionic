import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageClinicalRecordsPageRoutingModule } from './manage-clinical-records-routing.module';

import { ManageClinicalRecordsPage } from './manage-clinical-records.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageClinicalRecordsPageRoutingModule
  ],
  declarations: [ManageClinicalRecordsPage]
})
export class ManageClinicalRecordsPageModule {}
