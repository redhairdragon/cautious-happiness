import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineBoxComponent } from './timeline-box.component';

describe('TimelineBoxComponent', () => {
  let component: TimelineBoxComponent;
  let fixture: ComponentFixture<TimelineBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimelineBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelineBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
