import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NpmPackageSelectComponent } from './npm-package-select.component';

describe('NpmPackageSelectComponent', () => {
  let component: NpmPackageSelectComponent;
  let fixture: ComponentFixture<NpmPackageSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NpmPackageSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NpmPackageSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
