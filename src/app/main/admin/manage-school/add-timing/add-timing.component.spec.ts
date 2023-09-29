import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTimingComponent } from './add-timing.component';

describe('AddTimingComponent', () => {
  let component: AddTimingComponent;
  let fixture: ComponentFixture<AddTimingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTimingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTimingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
