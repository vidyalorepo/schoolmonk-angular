import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmissionListCompComponent } from './admission-list-comp.component';

describe('AdmissionListCompComponent', () => {
  let component: AdmissionListCompComponent;
  let fixture: ComponentFixture<AdmissionListCompComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdmissionListCompComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmissionListCompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
