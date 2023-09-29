import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaShionTechnologyComponent } from './fa-shion-technology.component';

describe('FaShionTechnologyComponent', () => {
  let component: FaShionTechnologyComponent;
  let fixture: ComponentFixture<FaShionTechnologyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FaShionTechnologyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FaShionTechnologyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
