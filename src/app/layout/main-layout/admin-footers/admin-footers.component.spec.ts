import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFootersComponent } from './admin-footers.component';

describe('AdminFootersComponent', () => {
  let component: AdminFootersComponent;
  let fixture: ComponentFixture<AdminFootersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminFootersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminFootersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
