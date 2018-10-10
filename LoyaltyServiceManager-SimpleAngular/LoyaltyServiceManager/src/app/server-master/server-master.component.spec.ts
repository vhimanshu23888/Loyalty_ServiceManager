import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerMasterComponent } from './server-master.component';

describe('ServerMasterComponent', () => {
  let component: ServerMasterComponent;
  let fixture: ComponentFixture<ServerMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServerMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServerMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
