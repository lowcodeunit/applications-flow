import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KrakynToolComponent } from './krakyn-tool.component';

describe('KrakynToolComponent', () => {
  let component: KrakynToolComponent;
  let fixture: ComponentFixture<KrakynToolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KrakynToolComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KrakynToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
