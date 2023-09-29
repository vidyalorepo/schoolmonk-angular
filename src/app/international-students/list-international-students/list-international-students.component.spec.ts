import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListInternationalStudentsComponent } from './list-international-students.component';

describe('ListInternationalStudentsComponent', () => {
  let component: ListInternationalStudentsComponent;
  let fixture: ComponentFixture<ListInternationalStudentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListInternationalStudentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListInternationalStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
