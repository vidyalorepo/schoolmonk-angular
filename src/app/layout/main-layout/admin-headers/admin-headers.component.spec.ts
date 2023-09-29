import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminHeadersComponent } from './admin-headers.component';

describe('AdminHeadersComponent', () => {
  let component: AdminHeadersComponent;
  let fixture: ComponentFixture<AdminHeadersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminHeadersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminHeadersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
