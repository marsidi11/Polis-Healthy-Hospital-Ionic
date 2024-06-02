import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AdmissionService, Department, Admission } from '../../services/admission.service';
import { PatientService, Patient } from '../../services/patient.service';

@Component({
  selector: 'app-manage-admissions',
  templateUrl: './manage-admissions.page.html',
  styleUrls: ['./manage-admissions.page.scss']
})
export class ManageAdmissionsPage implements OnInit {
  patientId: number;
  patient: Patient | undefined;
  departments: Department[] = [];
  currentAdmission: Admission | undefined;

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
    });
  }

  getAdmission() {
    this.admissionService.getAdmissionByPatientId(this.patientId).subscribe(admission => {
      this.currentAdmission = admission;
    });
  }

  async openAdmitModal(departmentId: number) {
    const alert = await this.alertController.create({
      header: 'Admit Patient',
      inputs: [
        {
          name: 'cause',
          type: 'text',
          placeholder: 'Cause of Admission'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Admit',
          handler: data => {
            this.admitPatient(departmentId, data.cause);
          }
        }
      ]
    });

    await alert.present();
  }

  async openTransferModal(departmentId: number) {
    const alert = await this.alertController.create({
      header: 'Transfer Patient',
      inputs: [
        {
          name: 'cause',
          type: 'text',
          placeholder: 'Cause of Transfer'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Transfer',
          handler: data => {
            this.transferPatient(departmentId, data.cause);
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

  transferPatient(departmentId: number, cause: string) {
    this.admitPatient(departmentId, cause);
  }
}
