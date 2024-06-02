import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdmissionService } from '../../services/admission.service';
import { AlertController } from '@ionic/angular';

export interface Admission {
  id: number;
  admissionDate: string;
  dischargeDate: string;
  reason: string;
}

@Component({
  selector: 'app-manage-admissions',
  templateUrl: './manage-admissions.page.html',
  styleUrls: ['./manage-admissions.page.scss']
})
export class ManageAdmissionsPage implements OnInit {
  patientId!: number; // Ensure patientId is initialized properly
  admissions: Admission[] = [];

  constructor(
    private route: ActivatedRoute,
    private admissionService: AdmissionService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.patientId = +this.route.snapshot.paramMap.get('patientId')!;
    this.getAdmissions();
  }

  getAdmissions(): void {
    this.admissionService.getAdmissions(this.patientId).subscribe((admissions: Admission[]) => {
      this.admissions = admissions;
    });
  }

  async openEditModal(admission: Admission) {
    const alert = await this.alertController.create({
      header: 'Edit Admission',
      inputs: [
        {
          name: 'admissionDate',
          type: 'date',
          value: admission.admissionDate,
          placeholder: 'Admission Date'
        },
        {
          name: 'dischargeDate',
          type: 'date',
          value: admission.dischargeDate,
          placeholder: 'Discharge Date'
        },
        {
          name: 'reason',
          type: 'text',
          value: admission.reason,
          placeholder: 'Reason'
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
            this.editAdmission(admission.id, data.admissionDate, data.dischargeDate, data.reason);
          }
        }
      ]
    });

    await alert.present();
  }

  editAdmission(id: number, admissionDate: string, dischargeDate: string, reason: string) {
    const admission = this.admissions.find(a => a.id === id);
    if (admission) {
      admission.admissionDate = admissionDate;
      admission.dischargeDate = dischargeDate;
      admission.reason = reason;
      this.admissionService.editAdmission(this.patientId, admission).subscribe(() => {
        this.getAdmissions(); // Refresh the list
      });
    }
  }

  async deleteAdmission(admissionId: number) {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: `Are you sure you want to delete this admission?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Delete',
          handler: () => {
            this.admissionService.deleteAdmission(this.patientId, admissionId).subscribe(() => {
              this.admissions = this.admissions.filter(a => a.id !== admissionId);
              this.getAdmissions(); // Refresh the list
            });
          }
        }
      ]
    });

    await alert.present();
  }
}
