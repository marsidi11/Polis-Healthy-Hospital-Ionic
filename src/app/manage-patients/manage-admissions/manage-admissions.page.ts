import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
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
  ) {
    this.patientId = +this.route.snapshot.paramMap.get('patientId')!;
    this.patient = {} as Patient; // Initialize patient
  }

  ngOnInit() {
    this.getPatient();
    this.getDepartments();
  }

  getPatient() {
    this.patientService.getPatient(this.patientId).subscribe(patient => {
      this.patient = patient;
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
    const alert = await this.alertController.create({
      header: this.patient.department?.departmentName ? 'Transfer Patient' : 'Admit Patient',
      inputs: [
        {
          name: 'transferReason',
          type: 'text',
          placeholder: this.patient.department?.departmentName ? 'Reason of Transfer' : 'Reason of Admission'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: this.patient.department?.departmentName ? 'Transfer' : 'Admit',
          handler: data => {
            this.admitPatient(departmentId, data.transferReason);
          }
        }
      ]
    });

    await alert.present();
  }

  admitPatient(departmentId: number, transferReason: string) {
    this.patientService.admitPatient(this.patientId, departmentId, transferReason).subscribe(() => {
      console.log(`Patient admitted to department id=${departmentId} with reason=${transferReason}`);
    }, error => {
      console.error(`Error admitting patient: ${error}`);
    });
  }
}
