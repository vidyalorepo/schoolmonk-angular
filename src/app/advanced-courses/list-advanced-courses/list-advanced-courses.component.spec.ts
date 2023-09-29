import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAdvancedCoursesComponent } from './list-advanced-courses.component';

describe('ListAdvancedCoursesComponent', () => {
  let component: ListAdvancedCoursesComponent;
  let fixture: ComponentFixture<ListAdvancedCoursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListAdvancedCoursesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAdvancedCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
