import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyAbroadAfterTenThComponent } from './study-abroad-after-ten-th.component';

describe('StudyAbroadAfterTenThComponent', () => {
  let component: StudyAbroadAfterTenThComponent;
  let fixture: ComponentFixture<StudyAbroadAfterTenThComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudyAbroadAfterTenThComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudyAbroadAfterTenThComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
