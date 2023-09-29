import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestimonialsAddComponent } from './testimonials-add.component';

describe('TestimonialsAddComponent', () => {
  let component: TestimonialsAddComponent;
  let fixture: ComponentFixture<TestimonialsAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestimonialsAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestimonialsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
