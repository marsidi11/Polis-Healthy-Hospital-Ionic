import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageAdmissionsPage } from './manage-admissions.page';

describe('ManageAdmissionsPage', () => {
  let component: ManageAdmissionsPage;
  let fixture: ComponentFixture<ManageAdmissionsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageAdmissionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
