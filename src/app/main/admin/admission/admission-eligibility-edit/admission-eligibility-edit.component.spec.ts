import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmissionEligibilityEditComponent } from './admission-eligibility-edit.component';

describe('AdmissionEligibilityEditComponent', () => {
  let component: AdmissionEligibilityEditComponent;
  let fixture: ComponentFixture<AdmissionEligibilityEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdmissionEligibilityEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmissionEligibilityEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
