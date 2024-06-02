import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClinicalRecordService } from '../../services/clinical-record.service';
import { AlertController } from '@ionic/angular';

export interface ClinicalRecord {
  id: number;
  diagnosis: string;
  medications: string[];
  allergies: string[];
}

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
        record.diagnosis.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }
  

  async openCreateModal() {
    const alert = await this.alertController.create({
      header: 'Add Clinical Data',
      inputs: [
        {
          name: 'diagnosis',
          type: 'text',
          placeholder: 'Diagnosis'
        },
        {
          name: 'medications',
          type: 'text',
          placeholder: 'Medications (comma separated)'
        },
        {
          name: 'allergies',
          type: 'text',
          placeholder: 'Allergies (comma separated)'
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
            const medications = data.medications.split(',').map((med: string) => med.trim());
            const allergies = data.allergies.split(',').map((allergy: string) => allergy.trim());
            this.addClinicalRecord(data.diagnosis, medications, allergies);
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
          name: 'diagnosis',
          type: 'text',
          value: record.diagnosis,
          placeholder: 'Diagnosis'
        },
        {
          name: 'medications',
          type: 'text',
          value: record.medications.join(', '),
          placeholder: 'Medications (comma separated)'
        },
        {
          name: 'allergies',
          type: 'text',
          value: record.allergies.join(', '),
          placeholder: 'Allergies (comma separated)'
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
            const medications = data.medications.split(',').map((med: string) => med.trim());
            const allergies = data.allergies.split(',').map((allergy: string) => allergy.trim());
            this.editClinicalRecord(record.id, data.diagnosis, medications, allergies);
          }
        }
      ]
    });

    await alert.present();
  }

  addClinicalRecord(diagnosis: string, medications: string[], allergies: string[]) {
    const newRecord: ClinicalRecord = { id: this.clinicalRecords.length + 1, diagnosis, medications, allergies };
    this.clinicalRecordService.addClinicalRecord(this.patientId, newRecord).subscribe((record: ClinicalRecord) => {
      this.clinicalRecords.push(record);
      this.filterClinicalRecords(); // Refresh the filtered list
    });
  }

  editClinicalRecord(id: number, diagnosis: string, medications: string[], allergies: string[]) {
    const record = this.clinicalRecords.find(r => r.id === id);
    if (record) {
      record.diagnosis = diagnosis;
      record.medications = medications;
      record.allergies = allergies;
      this.clinicalRecordService.editClinicalRecord(this.patientId, record).subscribe(() => {
        this.filterClinicalRecords(); // Refresh the filtered list
      });
    }
  }

  async deleteClinicalRecord(record: ClinicalRecord) {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: `Are you sure you want to delete the clinical record with diagnosis ${record.diagnosis}?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Delete',
          handler: () => {
            this.clinicalRecordService.deleteClinicalRecord(this.patientId, record.id).subscribe(() => {
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

