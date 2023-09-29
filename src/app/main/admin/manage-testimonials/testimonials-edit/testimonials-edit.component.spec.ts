import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestimonialsEditComponent } from './testimonials-edit.component';

describe('TestimonialsEditComponent', () => {
  let component: TestimonialsEditComponent;
  let fixture: ComponentFixture<TestimonialsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestimonialsEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestimonialsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
