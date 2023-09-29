import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolFeatureComponent } from './school-feature.component';

describe('SchoolFeatureComponent', () => {
  let component: SchoolFeatureComponent;
  let fixture: ComponentFixture<SchoolFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchoolFeatureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
