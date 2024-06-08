import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, ModalController, NavController, ToastController } from '@ionic/angular'; 
import { PatientService, Patient } from '../../services/patient.service';
import { DepartmentService, Department } from '../../services/department.service';

@Component({
  selector: 'app-manage-admissions',
  templateUrl: './manage-admissions.page.html',
  styleUrls: ['./manage-admissions.page.scss']
})

export class ManageAdmissionsPage implements OnInit {
  patientId: number;
  departments: Department[] = [];
  patient: Patient;
  filteredDepartments: Department[] = [];
  searchTerm: string = '';

  constructor(
    private route: ActivatedRoute,
    private alertController: AlertController,
    private patientService: PatientService,
    private departmentService: DepartmentService,
    private toastController: ToastController,

  ) {
    this.patientId = +this.route.snapshot.paramMap.get('patientId')!;
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
    this.getPatient();
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

  getPatient() {
    this.patientService.getPatient(this.patientId).subscribe(patient => {
      this.patient = patient;
      console.log(this.patient);
    });
  }

  getDepartments() {
    this.departmentService.getDepartments().subscribe(departments => {
      this.departments = departments;
      this.filteredDepartments = departments; // Initialize filtered departments
      this.filterDepartments(); // Filter departments initially
    });
  }

  filterDepartments() {
    if (this.searchTerm) {
      this.filteredDepartments = this.departments.filter(department =>
        department.departmentName.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredDepartments = this.departments;
    }
  }

  async openAdmitModal(departmentId: number) {
    const hasDepartment = this.patient.department && this.patient.department.departmentName;
    const alert = await this.alertController.create({
      header: hasDepartment ? 'Transfer Patient' : 'Admit Patient',
      inputs: [
        {
          name: 'transferReason',
          type: 'text',
          placeholder: hasDepartment ? 'Reason of Transfer' : 'Reason of Admission'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: hasDepartment ? 'Transfer' : 'Admit',
          handler: data => {
            if (!data.transferReason || data.transferReason.trim() === '') {
              this.presentErrorToast('Reason of Transfer/Admission is required.');
              return false; // Prevents the modal from closing
            }
  
            this.admitPatient(
              departmentId, 
              data.transferReason, 
              this.patient.firstName, 
              this.patient.lastName, 
              this.patient.birthDate
            );
  
            return true; // Prevents the modal from closing immediately
          }
        }
      ]
    });
  
    await alert.present();
  }
  
  admitPatient(departmentId: number, transferReason: string, firstName: string, lastName: string, birthDate: string) {
    const patientData = {
      firstName,
      lastName,
      birthDate,
      departmentId,
      transferReason
    };
  
    this.patientService.admitPatient(this.patientId, patientData).subscribe(() => {
      const department = this.departments.find(dep => dep.id === departmentId);
  
      // Update local patient state
      if (department) {
        this.patient.department = {
          id: department.id,
          departmentCode: department.departmentCode,
          departmentName: department.departmentName
        };
      }
  
      // Show success toast
      this.presentSuccessToast('Patient successfully admitted/transferred.');
    }, error => {
      console.error(`Error admitting patient: ${error}`);
      // Show error toast
      this.presentErrorToast(error.message || 'An error occurred.');
    });
  }
}