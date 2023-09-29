import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademicSaveComponent } from './academic-save.component';

describe('AcademicSaveComponent', () => {
  let component: AcademicSaveComponent;
  let fixture: ComponentFixture<AcademicSaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcademicSaveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcademicSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
