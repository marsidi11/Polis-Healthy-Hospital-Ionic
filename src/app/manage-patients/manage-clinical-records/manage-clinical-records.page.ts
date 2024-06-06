import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClinicalRecordService, ClinicalRecord } from '../../services/clinical-record.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-manage-clinical-records',
  templateUrl: './manage-clinical-records.page.html',
  styleUrls: ['./manage-clinical-records.page.scss']
})
export class ManageClinicalRecordsPage implements OnInit {
  patientId!: number;
  clinicalRecords: ClinicalRecord[] = [];
  filteredClinicalRecords: ClinicalRecord[] = [];
  searchTerm: string = '';

  constructor(
    private route: ActivatedRoute,
    private clinicalRecordService: ClinicalRecordService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.patientId = +this.route.snapshot.paramMap.get('patientId')!;
    this.getClinicalRecords();
  }

  getClinicalRecords(): void {
  this.clinicalRecordService.getClinicalRecords(this.patientId).subscribe((clinicalRecords: ClinicalRecord[]) => {
    this.clinicalRecords = clinicalRecords;
    this.filteredClinicalRecords = this.clinicalRecords;
    console.log(this.filteredClinicalRecords)
  });
}

  filterClinicalRecords() {
    if (this.searchTerm.trim() === '') {
      this.filteredClinicalRecords = this.clinicalRecords;
    } else {
      this.filteredClinicalRecords = this.clinicalRecords.filter(record =>
        record.clinicalRecord.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }
  

  async openCreateModal() {
    const alert = await this.alertController.create({
      header: 'Add Clinical Data',
      inputs: [
        {
          name: 'clinicalRecord',
          type: 'text',
          placeholder: 'Clinical Record'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Add',
          handler: data => {
            this.createClinicalRecord(data.clinicalRecord);
          }
        }
      ]
    });

    await alert.present();
  }

  async openEditModal(record: ClinicalRecord) {
    const alert = await this.alertController.create({
      header: 'Edit Clinical Data',
      inputs: [
        {
          name: 'clinicalRecord',
          type: 'text',
          value: record.clinicalRecord,
          placeholder: 'Clinical Record'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Save',
          handler: data => {
            this.editClinicalRecord(record.id, data.clinicalRecord);
          }
        }
      ]
    });

    await alert.present();
  }

  createClinicalRecord(clinicalRecord: string) {
    this.clinicalRecordService.createClinicalRecord(this.patientId, clinicalRecord).subscribe((record: ClinicalRecord) => {
      this.clinicalRecords.push(record);
      this.filterClinicalRecords(); // Refresh the filtered list
    });
  }

  editClinicalRecord(id: number, clinicalRecord: string) {
    const record = this.clinicalRecords.find(r => r.id === id);
    if (record) {
      record.clinicalRecord = clinicalRecord;
      this.clinicalRecordService.editClinicalRecord(id, record).subscribe(() => {
        this.filterClinicalRecords(); // Refresh the filtered list
      });
    }
  }

  async deleteClinicalRecord(record: ClinicalRecord) {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: `Are you sure you want to delete the clinical record with diagnosis ${record.clinicalRecord}?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Delete',
          handler: () => {
            this.clinicalRecordService.deleteClinicalRecord(record.id).subscribe(() => {
              this.clinicalRecords = this.clinicalRecords.filter(r => r.id !== record.id);
              this.filterClinicalRecords(); // Refresh the filtered list
            });
          }
        }
      ]
    });

    await alert.present();
  }
}

