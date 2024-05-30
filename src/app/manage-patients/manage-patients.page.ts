import { Component, OnInit } from '@angular/core';
import { PatientService } from '../services/patient.service';

@Component({
  selector: 'app-manage-patients',
  templateUrl: './manage-patients.page.html',
  styleUrls: ['./manage-patients.page.scss']
})
export class ManagePatientsPage implements OnInit {
  patients: any[] = [];

  constructor(private patientService: PatientService) {}

  ngOnInit() {
    this.getPatients();
  }

  getPatients(): void {
    this.patientService.getPatients().subscribe(patients => this.patients = patients);
  }
}
