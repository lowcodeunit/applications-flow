import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZipFileUploadComponent } from './zip-file-upload.component';

describe('ZipFileUploadComponent', () => {
  let component: ZipFileUploadComponent;
  let fixture: ComponentFixture<ZipFileUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZipFileUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZipFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
