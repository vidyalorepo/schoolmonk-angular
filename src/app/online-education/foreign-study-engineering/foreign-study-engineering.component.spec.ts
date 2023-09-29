import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForeignStudyEngineeringComponent } from './foreign-study-engineering.component';

describe('ForeignStudyEngineeringComponent', () => {
  let component: ForeignStudyEngineeringComponent;
  let fixture: ComponentFixture<ForeignStudyEngineeringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForeignStudyEngineeringComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForeignStudyEngineeringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
