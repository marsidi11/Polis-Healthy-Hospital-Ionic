import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManagePatientsPage } from './manage-patients.page';

describe('ManagePatientsPage', () => {
  let component: ManagePatientsPage;
  let fixture: ComponentFixture<ManagePatientsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagePatientsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
