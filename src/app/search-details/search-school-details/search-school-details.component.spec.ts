import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchSchoolDetailsComponent } from './search-school-details.component';

describe('SearchSchoolDetailsComponent', () => {
  let component: SearchSchoolDetailsComponent;
  let fixture: ComponentFixture<SearchSchoolDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchSchoolDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchSchoolDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
