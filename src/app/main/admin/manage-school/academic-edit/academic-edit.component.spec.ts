import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademicEditComponent } from './academic-edit.component';

describe('AcademicEditComponent', () => {
  let component: AcademicEditComponent;
  let fixture: ComponentFixture<AcademicEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcademicEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcademicEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
