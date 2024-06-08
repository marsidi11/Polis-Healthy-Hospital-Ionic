import { Component, Input, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Department } from '../../services/department.service';

@Component({
  selector: 'app-create-patient',
  templateUrl: './create-patient.component.html',
  styleUrls: ['./create-patient.component.scss'],
})
export class CreatePatientModalComponent implements OnInit {
  @Input() departments!: Department[];  
  form: FormGroup;

  constructor(
    private modalController: ModalController,
    private fb: FormBuilder,
    private toastController: ToastController
  ) {
    this.form = this.fb.group({
      departmentId: [null, Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      birthDate: ['', Validators.required],
      admissionReason: ['', Validators.required],
    });
  }

  ngOnInit() {
    console.log('Departments:', this.departments);
  }

  dismiss() {
    this.modalController.dismiss();
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

  submit() {
    if (this.form.valid) {
      const formValue = this.form.value;
      if (formValue.birthDate) {
        const date = new Date(formValue.birthDate);
        formValue.birthDate = date.toISOString().split('T')[0]; // convert date to ISO 8601 format
      }
      this.modalController.dismiss(formValue);
    } else {
      this.presentErrorToast('All fields are required.');
    }
  }
}
