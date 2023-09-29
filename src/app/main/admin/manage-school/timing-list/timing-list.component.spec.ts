import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimingListComponent } from './timing-list.component';

describe('TimingListComponent', () => {
  let component: TimingListComponent;
  let fixture: ComponentFixture<TimingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimingListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
