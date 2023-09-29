import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplySchoolComponent } from './apply-school.component';

describe('ApplySchoolComponent', () => {
  let component: ApplySchoolComponent;
  let fixture: ComponentFixture<ApplySchoolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplySchoolComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplySchoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
