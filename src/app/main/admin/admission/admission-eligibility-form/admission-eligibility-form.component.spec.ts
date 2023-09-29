import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmissionEligibilityFormComponent } from './admission-eligibility-form.component';

describe('AdmissionEligibilityFormComponent', () => {
  let component: AdmissionEligibilityFormComponent;
  let fixture: ComponentFixture<AdmissionEligibilityFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdmissionEligibilityFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmissionEligibilityFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
