import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageStudentBulkComponent } from './manage-student-bulk.component';

describe('ManageStudentBulkComponent', () => {
  let component: ManageStudentBulkComponent;
  let fixture: ComponentFixture<ManageStudentBulkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageStudentBulkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageStudentBulkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
