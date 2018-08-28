import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadLogsComponent } from './read-logs.component';

describe('ReadLogsComponent', () => {
  let component: ReadLogsComponent;
  let fixture: ComponentFixture<ReadLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadLogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
