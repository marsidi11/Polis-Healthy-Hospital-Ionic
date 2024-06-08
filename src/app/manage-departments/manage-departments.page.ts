import { Component, OnInit } from '@angular/core';
import { DepartmentService } from '../services/department.service';
import { AlertController, ModalController, ToastController } from '@ionic/angular';

export interface Department {
  id: number;
  departmentCode: string;
  departmentName: string;
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
    private modalController: ModalController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
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

  getDepartments(): void {
    this.departmentService.getDepartments().subscribe(
      departments => {
        this.departments = departments;
        this.filteredDepartments = departments;
        console.log('Departments:', departments);
      },
      error => {
        this.presentErrorToast(error);
      }
    );
  }

  filterDepartments() {
    if (this.searchTerm.trim() === '') {
      this.filteredDepartments = this.departments;
    } else {
      this.filteredDepartments = this.departments.filter(department =>
        department.departmentName.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  async openCreateModal() {
    const alert = await this.alertController.create({
      header: 'Create Department',
      inputs: [
        {
          name: 'departmentCode',
          type: 'text',
          placeholder: 'Department Code'
        },
        {
          name: 'departmentName',
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
            if (!data.departmentCode || !data.departmentName) {
              this.presentErrorToast('All fields are required.');
              return false;
            }
            this.createDepartment(data.departmentCode, data.departmentName);
            return true;
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
          name: 'departmentCode',
          type: 'text',
          value: department.departmentCode,
          placeholder: 'Department Code'
        },
        {
          name: 'departmentName',
          type: 'text',
          value: department.departmentName,
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
            if (!data.departmentCode || !data.departmentName) {
              this.presentErrorToast('All fields are required.');
              return false;
            }
            this.editDepartment(department.id, data.departmentName, data.departmentCode);
            return true;
          }
        }
      ]
    });
  
    await alert.present();
  }
  

  createDepartment(departmentCode: string, departmentName: string) {
    const newDepartment = { departmentCode, departmentName } as Department;
    this.departmentService.createDepartment(newDepartment).subscribe(
      department => {
        this.departments.push(department);
        this.filterDepartments(); // Refresh the filtered list
        this.presentSuccessToast('Department created successfully.');
      },
      error => {
        this.presentErrorToast(error);
      }
    );
  }

  editDepartment(id: number, departmentName: string, departmentCode: string) {
    const department = this.departments.find(dep => dep.id === id);
    if (department) {
      department.departmentName = departmentName;
      department.departmentCode = departmentCode;
      this.departmentService.editDepartment(id, department).subscribe(
        updatedDepartment => {
          // Update the local department with the updated details
          const index = this.departments.findIndex(dep => dep.id === id);
          if (index !== -1) {
            this.departments[index] = updatedDepartment;
            this.filterDepartments(); // Refresh the filtered list
            this.presentSuccessToast('Department updated successfully.');
          }
        },
        error => {
          this.presentErrorToast(error);
        }
      );
    }
  }

  async deleteDepartment(id: number, department: Department) {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: `Are you sure you want to delete the department ${department.departmentName}?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Delete',
          handler: () => {
            this.departmentService.deleteDepartment(id).subscribe(
              () => {
                this.departments = this.departments.filter(dep => dep.id !== id);
                this.filterDepartments(); // Refresh the filtered list
                this.presentSuccessToast('Department deleted successfully.');
              },
              error => {
                this.presentErrorToast(error);
              }
            );
          }
        }
      ]
    });

    await alert.present();
  }
}
