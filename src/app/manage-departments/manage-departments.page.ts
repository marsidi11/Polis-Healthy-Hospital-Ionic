import { Component, OnInit } from '@angular/core';
import { DepartmentService } from '../services/department.service';
import { AlertController, ModalController } from '@ionic/angular';

export interface Department {
  id: number;
  name: string;
}

@Component({
  selector: 'app-manage-departments',
  templateUrl: './manage-departments.page.html',
  styleUrls: ['./manage-departments.page.scss']
})
export class ManageDepartmentsPage implements OnInit {
  departments: Department[] = [];
  filteredDepartments: Department[] = [];
  searchTerm: string = '';

  constructor(
    private departmentService: DepartmentService,
    private alertController: AlertController,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.getDepartments();
  }

  getDepartments(): void {
    this.departmentService.getDepartments().subscribe(departments => {
      this.departments = departments;
      this.filteredDepartments = departments;
    });
  }

  filterDepartments() {
    if (this.searchTerm.trim() === '') {
      this.filteredDepartments = this.departments;
    } else {
      this.filteredDepartments = this.departments.filter(department =>
        department.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  async openCreateModal() {
    const alert = await this.alertController.create({
      header: 'Create Department',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Department Name'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Create',
          handler: data => {
            this.createDepartment(data.name);
          }
        }
      ]
    });

    await alert.present();
  }

  async openEditModal(department: Department) {
    const alert = await this.alertController.create({
      header: 'Edit Department',
      inputs: [
        {
          name: 'name',
          type: 'text',
          value: department.name,
          placeholder: 'Department Name'
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
            this.editDepartment(department.id, data.name);
          }
        }
      ]
    });

    await alert.present();
  }

  createDepartment(name: string) {
    const newDepartment: Department = { id: this.departments.length + 1, name };
    this.departmentService.createDepartment(newDepartment).subscribe(department => {
      this.departments.push(department);
      this.filterDepartments(); // Refresh the filtered list
    });
  }

  editDepartment(id: number, name: string) {
    const department = this.departments.find(dep => dep.id === id);
    if (department) {
      department.name = name;
      this.departmentService.editDepartment(department).subscribe(() => {
        this.filterDepartments(); // Refresh the filtered list
      });
    }
  }

  async deleteDepartment(department: Department) {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: `Are you sure you want to delete the department ${department.name}?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Delete',
          handler: () => {
            this.departmentService.deleteDepartment(department.id).subscribe(() => {
              this.departments = this.departments.filter(dep => dep.id !== department.id);
              this.filterDepartments(); // Refresh the filtered list
            });
          }
        }
      ]
    });

    await alert.present();
  }
}
