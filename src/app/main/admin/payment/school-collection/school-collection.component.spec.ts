import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolCollectionComponent } from './school-collection.component';

describe('SchoolCollectionComponent', () => {
  let component: SchoolCollectionComponent;
  let fixture: ComponentFixture<SchoolCollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchoolCollectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
