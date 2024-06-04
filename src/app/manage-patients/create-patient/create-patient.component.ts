import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Department } from '../../manage-patients/manage-patients.page';

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
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      departmentId: [null, Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      birthDate: ['', Validators.required],
      admissionReason: ['', Validators.required],
    });
  }

  ngOnInit() {}

  dismiss() {
    this.modalController.dismiss();
  }

  submit() {
    if (this.form.valid) {
      this.modalController.dismiss(this.form.value);
    }
  }
}
