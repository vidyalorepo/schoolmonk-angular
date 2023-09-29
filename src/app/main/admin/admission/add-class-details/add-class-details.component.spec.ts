import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddClassDetailsComponent } from './add-class-details.component';

describe('AddClassDetailsComponent', () => {
  let component: AddClassDetailsComponent;
  let fixture: ComponentFixture<AddClassDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddClassDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddClassDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
