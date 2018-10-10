import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvironmentMasterComponent } from './environment-master.component';

describe('EnvironmentMasterComponent', () => {
  let component: EnvironmentMasterComponent;
  let fixture: ComponentFixture<EnvironmentMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnvironmentMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvironmentMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
