import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScholarshipsProgramsInForeignAndIndiaComponent } from './scholarships-programs-in-foreign-and-india.component';

describe('ScholarshipsProgramsInForeignAndIndiaComponent', () => {
  let component: ScholarshipsProgramsInForeignAndIndiaComponent;
  let fixture: ComponentFixture<ScholarshipsProgramsInForeignAndIndiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScholarshipsProgramsInForeignAndIndiaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScholarshipsProgramsInForeignAndIndiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
