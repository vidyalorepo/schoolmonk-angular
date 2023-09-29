import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOnlineEducationComponent } from './list-online-education.component';

describe('ListOnlineEducationComponent', () => {
  let component: ListOnlineEducationComponent;
  let fixture: ComponentFixture<ListOnlineEducationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListOnlineEducationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOnlineEducationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
