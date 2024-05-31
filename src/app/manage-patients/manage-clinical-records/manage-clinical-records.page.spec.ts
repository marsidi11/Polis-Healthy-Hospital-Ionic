import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageClinicalRecordsPage } from './manage-clinical-records.page';

describe('ManageClinicalRecordsPage', () => {
  let component: ManageClinicalRecordsPage;
  let fixture: ComponentFixture<ManageClinicalRecordsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageClinicalRecordsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
