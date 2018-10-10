import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerTypeMasterComponent } from './server-type-master.component';

describe('ServerTypeMasterComponent', () => {
  let component: ServerTypeMasterComponent;
  let fixture: ComponentFixture<ServerTypeMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServerTypeMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServerTypeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
