import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MBBSAbroadComponent } from './mbbs-abroad.component';

describe('MBBSAbroadComponent', () => {
  let component: MBBSAbroadComponent;
  let fixture: ComponentFixture<MBBSAbroadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MBBSAbroadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MBBSAbroadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
