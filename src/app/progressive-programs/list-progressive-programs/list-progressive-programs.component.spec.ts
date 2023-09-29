import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListProgressiveProgramsComponent } from './list-progressive-programs.component';

describe('ListProgressiveProgramsComponent', () => {
  let component: ListProgressiveProgramsComponent;
  let fixture: ComponentFixture<ListProgressiveProgramsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListProgressiveProgramsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListProgressiveProgramsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
