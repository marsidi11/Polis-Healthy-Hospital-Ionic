import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageDepartmentsPage } from './manage-departments.page';

describe('ManageDepartmentsPage', () => {
  let component: ManageDepartmentsPage;
  let fixture: ComponentFixture<ManageDepartmentsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageDepartmentsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
