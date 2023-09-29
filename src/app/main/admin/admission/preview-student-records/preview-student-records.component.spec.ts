import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewStudentRecordsComponent } from './preview-student-records.component';

describe('PreviewStudentRecordsComponent', () => {
  let component: PreviewStudentRecordsComponent;
  let fixture: ComponentFixture<PreviewStudentRecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewStudentRecordsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewStudentRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
