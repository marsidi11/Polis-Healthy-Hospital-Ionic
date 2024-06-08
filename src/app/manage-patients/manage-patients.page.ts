import { Component, OnInit } from '@angular/core';
import { PatientService, Patient } from '../services/patient.service';
import { DepartmentService, Department } from '../services/department.service';
import { AlertController, ModalController, NavController, ToastController } from '@ionic/angular'; // Import NavController
import { CreatePatientModalComponent } from './create-patient/create-patient.component';

@Component({
  selector: 'app-manage-patients',
  templateUrl: './manage-patients.page.html',
  styleUrls: ['./manage-patients.page.scss'],
})
export class ManagePatientsPage implements OnInit {
  patients: Patient[] = [];
  departments: Department[] = [];
  filteredPatients: Patient[] = [];
  searchTerm: string = '';

  constructor(
    private patientService: PatientService,
    private departmentService: DepartmentService,
    private alertController: AlertController,
    private modalController: ModalController,
    private toastController: ToastController,
    private navCtrl: NavController 
  ) {}

  ngOnInit() {
    this.getPatients();
    this.getDepartments();
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

  getPatients(): void {
    this.patientService.getPatients().subscribe((patients) => {
      this.patients = patients;
      this.filteredPatients = patients;
    });
  }

  filterPatients() {
    if (this.searchTerm.trim() === '') {
      this.filteredPatients = this.patients;
    } else {
      this.filteredPatients = this.patients.filter((patient) =>
        (patient.firstName.toLowerCase() + ' ' + patient.lastName.toLowerCase()).includes(this.searchTerm.toLowerCase())
      );
    }
  }

  getDepartments() {
    this.departmentService.getDepartments().subscribe((departments) => {
      this.departments = departments;
      console.log('Departments:', departments);
    });
  }

  async openCreateModal() {
    const modal = await this.modalController.create({
      component: CreatePatientModalComponent,
      componentProps: {
        departments: this.departments,
      },
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        const data = result.data;
        const selectedDepartment = this.departments.find((dept) => dept.id === data.departmentId);
        if (selectedDepartment) {
          this.createPatient(
            data.firstName,
            data.lastName,
            data.birthDate,
            selectedDepartment.id,
            data.admissionReason
          );
        } else {
          console.error('No department selected');
        }
      }
    });

    await modal.present();
  }

  createPatient(
    firstName: string,
    lastName: string,
    birthDate: string,
    departmentId: number,
    admissionReason: string
  ) {
    const newPatient = {
      firstName,
      lastName,
      birthDate,
      departmentId,
      admissionReason
    };
    console.log(newPatient);
    this.patientService.createPatient(newPatient).subscribe(
      patient => {
      this.patients.push(patient);
      this.filterPatients(); // Refresh the filtered list
      this.presentSuccessToast('Patient created successfully');
    },
    (error) => {
      this.presentErrorToast(error);
    }
  );
  }

  async openEditModal(patient: Patient) {
    const alert = await this.alertController.create({
      header: 'Edit Patient',
      inputs: [
        {
          name: 'firstName',
          type: 'text',
          value: patient.firstName,
          placeholder: 'Patient First Name',
        },
        {
          name: 'lastName',
          type: 'text',
          value: patient.lastName,
          placeholder: 'Patient Last Name',
        },
        {
          name: 'birthDate',
          type: 'date',
          value: patient.birthDate,
          placeholder: 'Patient Birth Date',
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Save',
          handler: data => {
            this.editPatient(patient.id, data.firstName, data.lastName, data.birthDate);
          }
        },
      ],
    });

    await alert.present();
  }

  async openDischargeModal(patient: Patient) {
    // Check if the patient is already discharged
    if (patient.admissionState.some(state => state.discharged)) {
      this.presentErrorToast('Patient is already discharged.');
    } else {
      const alert = await this.alertController.create({
        header: 'Discharge Patient',
        inputs: [
          {
            name: 'dischargeCause',
            type: 'radio',
            label: 'Healthy',
            value: 'PATIENT_RECOVERY',
            checked: true,
          },
          {
            name: 'dischargeCause',
            type: 'radio',
            label: 'Transfer',
            value: 'PATIENT_HOSPITAL_TRANSFER',
          },
          {
            name: 'dischargeCause',
            type: 'radio',
            label: 'Death',
            value: 'PATIENT_DEATH',
          },
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
          },
          {
            text: 'Discharge',
            handler: (data) => {
              this.patientService.dischargePatient(patient.id, data).subscribe({
                next: (dischargedPatient) => {
                  // Handle the successfully discharged patient.
                  patient.department = null; // Set department to null
                  patient.admissionState = patient.admissionState.map(state => ({ ...state, discharged: true }));
                  this.presentSuccessToast('Patient discharged successfully.');
                },
                error: (err) => {
                  this.presentErrorToast(err);
                }
              });
            },
          },
        ],
      });
  
      await alert.present();
    }
  }
  

  editPatient(
    id: number,
    firstName: string,
    lastName: string,
    birthDate: string,
  ) {
    const patient = this.patients.find((p) => p.id === id);
    if (patient) {
      const updatedPatient = {
        ...patient,
        departmentId: patient.department?.id,
        firstName,
        lastName,
        birthDate,
      };
      this.patientService.editPatient(id, updatedPatient).subscribe((updatedPatient) => {
        const index = this.patients.findIndex((p) => p.id === id);
        if (index !== -1) {
          this.patients[index] = updatedPatient;
          this.filterPatients();
          this.presentSuccessToast('Patient updated successfully.');
        }
      });
    }
  }

  dischargePatient(id: number, dischargeCause: string) {
    this.patientService.dischargePatient(id, dischargeCause).subscribe((updatedPatient) => {
      const index = this.patients.findIndex((p) => p.id === id);
      if (index !== -1) {
        this.patients[index] = updatedPatient;
        this.filterPatients();
      }
    });
  }

  async deletePatient(patient: Patient) {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: `Are you sure you want to delete the patient ${patient.firstName} ${patient.lastName}?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Delete',
          handler: () => {
            this.patientService.deletePatient(patient.id).subscribe(() => {
              this.patients = this.patients.filter((p) => p.id !== patient.id);
              this.filterPatients();
              this.presentSuccessToast('Patient deleted successfully.');
            });
          },
        },
      ],
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
