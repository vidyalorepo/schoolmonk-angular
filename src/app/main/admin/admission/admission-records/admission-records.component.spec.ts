import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmissionRecordsComponent } from './admission-records.component';

describe('AdmissionRecordsComponent', () => {
  let component: AdmissionRecordsComponent;
  let fixture: ComponentFixture<AdmissionRecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdmissionRecordsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmissionRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
