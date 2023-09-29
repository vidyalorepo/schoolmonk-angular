import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInfrastructureComponent } from './add-infrastructure.component';

describe('AddInfrastructureComponent', () => {
  let component: AddInfrastructureComponent;
  let fixture: ComponentFixture<AddInfrastructureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddInfrastructureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInfrastructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
