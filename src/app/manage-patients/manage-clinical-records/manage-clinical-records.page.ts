import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClinicalRecordService, ClinicalRecord } from '../../services/clinical-record.service';
import { PatientService, Patient } from '../../services/patient.service';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-manage-clinical-records',
  templateUrl: './manage-clinical-records.page.html',
  styleUrls: ['./manage-clinical-records.page.scss']
})
export class ManageClinicalRecordsPage implements OnInit {
  patientId!: number;
  clinicalRecords: ClinicalRecord[] = [];
  filteredClinicalRecords: ClinicalRecord[] = [];
  patient: Patient;
  searchTerm: string = '';

  constructor(
    private route: ActivatedRoute,
    private clinicalRecordService: ClinicalRecordService,
    private patientService: PatientService,
    private alertController: AlertController,
    private toastController: ToastController,
  ) {
    this.patient = {
      id: 0,
      firstName: '',
      lastName: '',
      birthDate: '',
      department: null,
      admissionState: []
    };
  }

  ngOnInit() {
    this.patientId = +this.route.snapshot.paramMap.get('patientId')!;
    this.getClinicalRecords();
    this.getPatient();
  }

  async presentSuccessToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'top',
      cssClass: 'toast-success',
      buttons: [
        {
          text: 'Dismiss',
          role: 'cancel'
        }
      ]
    });
    toast.present();
  }

  async presentErrorToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'top',
      cssClass: 'toast-error',
      buttons: [
        {
          text: 'Dismiss',
          role: 'cancel'
        }
      ]
    });
    toast.present();
  }

  getClinicalRecords(): void {
    this.clinicalRecordService.getClinicalRecords(this.patientId).subscribe((clinicalRecords: ClinicalRecord[]) => {
      this.clinicalRecords = clinicalRecords;
      this.filteredClinicalRecords = this.clinicalRecords;
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

  getPatient() {
    this.patientService.getPatient(this.patientId).subscribe(patient => {
      this.patient = patient;
    });
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
            if (!data.clinicalRecord) {
              this.presentErrorToast('All fields are required.');
              return false;
            }
            this.createClinicalRecord(data.clinicalRecord);
            return true;
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
            if (!data.clinicalRecord) {
              this.presentErrorToast('All fields are required.');
              return false;
            }
            this.editClinicalRecord(record.id, data.clinicalRecord);
            return true;
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
      this.presentSuccessToast('Clinical record added successfully.');
    });
  }

  editClinicalRecord(id: number, clinicalRecord: string) {
    const record = this.clinicalRecords.find(r => r.id === id);
    if (record) {
      record.clinicalRecord = clinicalRecord;
      this.clinicalRecordService.editClinicalRecord(id, record).subscribe(() => {
        this.filterClinicalRecords(); // Refresh the filtered list
        this.presentSuccessToast('Clinical record updated successfully.');
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
              this.presentSuccessToast('Clinical record deleted successfully.');
            });
          }
        }
      ]
    });

    await alert.present();
  }
}

