import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamTipsVidyaloComponent } from './exam-tips-vidyalo.component';

describe('ExamTipsVidyaloComponent', () => {
  let component: ExamTipsVidyaloComponent;
  let fixture: ComponentFixture<ExamTipsVidyaloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExamTipsVidyaloComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamTipsVidyaloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
