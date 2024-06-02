import { Component, OnInit } from '@angular/core';
import { PatientService } from '../services/patient.service';
import { AlertController, NavController } from '@ionic/angular';

export interface Patient {
  id: number;
  name: string;
  age: number;
  department: string;
}

@Component({
  selector: 'app-manage-patients',
  templateUrl: './manage-patients.page.html',
  styleUrls: ['./manage-patients.page.scss']
})
export class ManagePatientsPage implements OnInit {
  patients: Patient[] = [];
  filteredPatients: Patient[] = [];
  searchTerm: string = '';

  constructor(
    private patientService: PatientService,
    private alertController: AlertController,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.getPatients();
  }

  getPatients(): void {
    this.patientService.getPatients().subscribe(patients => {
      this.patients = patients;
      this.filteredPatients = patients;
    });
  }

  filterPatients() {
    if (this.searchTerm.trim() === '') {
      this.filteredPatients = this.patients;
    } else {
      this.filteredPatients = this.patients.filter(patient =>
        patient.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  async openCreateModal() {
    const alert = await this.alertController.create({
      header: 'Create Patient',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Patient Name'
        },
        {
          name: 'age',
          type: 'number',
          placeholder: 'Patient Age'
        },
        {
          name: 'department',
          type: 'text',
          placeholder: 'Department'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Create',
          handler: data => {
            this.createPatient(data.name, data.age, data.department);
          }
        }
      ]
    });

    await alert.present();
  }

  async openEditModal(patient: Patient) {
    const alert = await this.alertController.create({
      header: 'Edit Patient',
      inputs: [
        {
          name: 'name',
          type: 'text',
          value: patient.name,
          placeholder: 'Patient Name'
        },
        {
          name: 'age',
          type: 'number',
          value: patient.age,
          placeholder: 'Patient Age'
        },
        {
          name: 'department',
          type: 'text',
          value: patient.department,
          placeholder: 'Department'
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
            this.editPatient(patient.id, data.name, data.age, data.department);
          }
        }
      ]
    });

    await alert.present();
  }

  async openDischargeModal(patient: Patient) {
    const alert = await this.alertController.create({
      header: 'Discharge Patient',
      inputs: [
        {
          name: 'dischargeReason',
          type: 'radio',
          label: 'Healthy',
          value: 'Healthy',
          checked: true
        },
        {
          name: 'dischargeReason',
          type: 'radio',
          label: 'Transfer',
          value: 'Transfer'
        },
        {
          name: 'dischargeReason',
          type: 'radio',
          label: 'Death',
          value: 'Death'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Discharge',
          handler: data => {
            this.dischargePatient(patient.id, data.dischargeReason);
          }
        }
      ]
    });

    await alert.present();
  }

  createPatient(name: string, age: number, department: string) {
    const newPatient: Patient = { id: this.patients.length + 1, name, age, department };
    this.patientService.createPatient(newPatient).subscribe(patient => {
      this.patients.push(patient);
      this.filterPatients(); // Refresh the filtered list
    });
  }

  editPatient(id: number, name: string, age: number, department: string) {
    const patient = this.patients.find(p => p.id === id);
    if (patient) {
      patient.name = name;
      patient.age = age;
      patient.department = department;
      this.patientService.editPatient(patient).subscribe(() => {
        this.filterPatients(); // Refresh the filtered list
      });
    }
  }

  dischargePatient(id: number, dischargeReason: string) {
    this.patientService.dischargePatient(id, dischargeReason).subscribe(() => {
      const patient = this.patients.find(p => p.id === id);
      if (patient) {
        patient.department = ''; // Clear department to indicate discharge
        this.filterPatients(); // Refresh the filtered list
      }
    });
  }

  async deletePatient(patient: Patient) {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: `Are you sure you want to delete the patient ${patient.name}?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Delete',
          handler: () => {
            this.patientService.deletePatient(patient.id).subscribe(() => {
              this.patients = this.patients.filter(p => p.id !== patient.id);
              this.filterPatients(); // Refresh the filtered list
            });
          }
        }
      ]
    });

    await alert.present();
  }

  navigateToManageClinicalRecords(patientId: number): void {
    this.navCtrl.navigateForward(`/manage-clinical-records/${patientId}`);
  }

  navigateToManageAdmissions(patientId: number): void {
    this.navCtrl.navigateForward(`/manage-admissions/${patientId}`);
  }
}
