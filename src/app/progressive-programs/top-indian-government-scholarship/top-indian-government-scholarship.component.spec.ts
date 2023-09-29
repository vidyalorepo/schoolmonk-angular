import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopIndianGovernmentScholarshipComponent } from './top-indian-government-scholarship.component';

describe('TopIndianGovernmentScholarshipComponent', () => {
  let component: TopIndianGovernmentScholarshipComponent;
  let fixture: ComponentFixture<TopIndianGovernmentScholarshipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopIndianGovernmentScholarshipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopIndianGovernmentScholarshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
