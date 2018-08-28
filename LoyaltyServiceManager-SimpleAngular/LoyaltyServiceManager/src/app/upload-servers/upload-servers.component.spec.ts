import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadServersComponent } from './upload-servers.component';

describe('UploadServersComponent', () => {
  let component: UploadServersComponent;
  let fixture: ComponentFixture<UploadServersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadServersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadServersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
