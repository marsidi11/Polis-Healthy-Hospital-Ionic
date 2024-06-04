import { Component, OnInit } from '@angular/core';
import { PatientService } from '../services/patient.service';
import { DepartmentService } from '../services/department.service';
import { AlertController, ModalController, NavController } from '@ionic/angular'; // Import NavController
import { CreatePatientModalComponent } from './create-patient/create-patient.component';

export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  departmentCode: string;
  departmentId: number;
  birthDate: string;
  admissionReason: string;
}

export interface Department {
  id: number;
  departmentCode: string;
  name: string;
}

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
    private navCtrl: NavController // Inject NavController here
  ) {}

  ngOnInit() {
    this.getPatients();
    this.getDepartments();
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
            selectedDepartment.departmentCode,
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
    departmentCode: string,
    departmentId: number,
    admissionReason: string
  ) {
    const newPatient = {
      firstName,
      lastName,
      birthDate,
      departmentCode,
      departmentId,
      admissionReason,
    } as Patient;
    console.log(newPatient);
    this.patientService.createPatient(newPatient).subscribe((patient) => {
      this.patients.push(patient);
      this.filterPatients(); // Refresh the filtered list
    });
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
        },
        {
          name: 'departmentTitle',
          type: 'text',
          value: 'Select Department',
          disabled: true,
        },
        {
          name: 'departmentId',
          type: 'radio',
          label: 'Department 1',
          value: '1',
        },
        {
          name: 'admissionReason',
          type: 'text',
          value: patient.admissionReason,
          placeholder: 'Admission Reason',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Save',
          handler: (data) => {
            const selectedDepartment = this.departments.find((dept) => dept.id === data.departmentId);
            if (selectedDepartment) {
              this.editPatient(
                patient.id,
                data.firstName,
                data.lastName,
                data.birthDate,
                selectedDepartment.departmentCode,
                selectedDepartment.id,
                data.admissionReason
              );
              return true;
            } else {
              console.error('No department selected');
              return false;
            }
          },
        },
      ],
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
          checked: true,
        },
        {
          name: 'dischargeReason',
          type: 'radio',
          label: 'Transfer',
          value: 'Transfer',
        },
        {
          name: 'dischargeReason',
          type: 'radio',
          label: 'Death',
          value: 'Death',
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
            this.dischargePatient(patient.id, data.dischargeReason);
          },
        },
      ],
    });

    await alert.present();
  }

  editPatient(
    id: number,
    firstName: string,
    lastName: string,
    birthDate: string,
    departmentCode: string,
    departmentId: number,
    admissionReason: string
  ) {
    const patient = this.patients.find((p) => p.id === id);
    if (patient) {
      const updatedPatient = {
        ...patient,
        firstName,
        lastName,
        birthDate,
        departmentCode,
        departmentId,
        admissionReason,
      };
      this.patientService.editPatient(id, updatedPatient).subscribe((updatedPatient) => {
        const index = this.patients.findIndex((p) => p.id === id);
        if (index !== -1) {
          this.patients[index] = updatedPatient;
          this.filterPatients();
        }
      });
    }
  }

  dischargePatient(id: number, dischargeReason: string) {
    this.patientService.dischargePatient(id, dischargeReason).subscribe((updatedPatient) => {
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
