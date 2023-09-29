import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolSubscriptionComponent } from './school-subscription.component';

describe('SchoolSubscriptionComponent', () => {
  let component: SchoolSubscriptionComponent;
  let fixture: ComponentFixture<SchoolSubscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchoolSubscriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
