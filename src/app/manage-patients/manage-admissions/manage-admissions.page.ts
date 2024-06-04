import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AdmissionService, Department, Admission } from '../../services/admission.service';
import { PatientService } from '../../services/patient.service';

@Component({
  selector: 'app-manage-admissions',
  templateUrl: './manage-admissions.page.html',
  styleUrls: ['./manage-admissions.page.scss']
})
export class ManageAdmissionsPage implements OnInit {
  patientId: number;
  patient: undefined;
  departments: Department[] = [];
  filteredDepartments: Department[] = [];
  currentAdmission: Admission | undefined;
  searchTerm: string = '';

  constructor(
    private route: ActivatedRoute,
    private alertController: AlertController,
    private admissionService: AdmissionService,
    private patientService: PatientService
  ) {
    this.patientId = +this.route.snapshot.paramMap.get('patientId')!;
  }

  ngOnInit() {
    this.getPatient();
    this.getDepartments();
    this.getAdmission();
  }

  getPatient() {
    this.patientService.getPatients().subscribe(patients => {
      this.patient = patients.find(p => p.id === this.patientId);
    });
  }

  getDepartments() {
    this.admissionService.getDepartments().subscribe(departments => {
      this.departments = departments;
      this.filteredDepartments = departments; // Initialize filtered departments
      this.filterDepartments(); // Filter departments initially
    });
  }

  getAdmission() {
    this.admissionService.getAdmissionByPatientId(this.patientId).subscribe(admission => {
      this.currentAdmission = admission;
      this.filterDepartments(); // Re-filter departments after getting admission
    });
  }

  filterDepartments() {
    if (this.searchTerm) {
      this.filteredDepartments = this.departments.filter(department =>
        department.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredDepartments = this.departments;
    }
  }

  async openAdmitModal(departmentId: number) {
    const alert = await this.alertController.create({
      header: this.currentAdmission ? 'Transfer Patient' : 'Admit Patient',
      inputs: [
        {
          name: 'cause',
          type: 'text',
          placeholder: this.currentAdmission ? 'Cause of Transfer' : 'Cause of Admission'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: this.currentAdmission ? 'Transfer' : 'Admit',
          handler: data => {
            this.admitPatient(departmentId, data.cause);
          }
        }
      ]
    });

    await alert.present();
  }

  admitPatient(departmentId: number, cause: string) {
    const admission: Admission = { patientId: this.patientId, departmentId, cause };
    this.admissionService.admitPatient(admission).subscribe(() => {
      this.getAdmission();
    });
  }
}
