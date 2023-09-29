import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentCollectionComponent } from './student-collection.component';

describe('StudentCollectionComponent', () => {
  let component: StudentCollectionComponent;
  let fixture: ComponentFixture<StudentCollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentCollectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
