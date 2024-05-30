import { Component, OnInit } from '@angular/core';
import { DepartmentService } from '../services/department.service';

@Component({
  selector: 'app-manage-departments',
  templateUrl: './manage-departments.page.html',
  styleUrls: ['./manage-departments.page.scss']
})
export class ManageDepartmentsPage implements OnInit {
  departments: any[] = [];

  constructor(private departmentService: DepartmentService) {}

  ngOnInit() {
    this.getDepartments();
  }

  getDepartments(): void {
    this.departmentService.getDepartments().subscribe(departments => this.departments = departments);
  }
}
