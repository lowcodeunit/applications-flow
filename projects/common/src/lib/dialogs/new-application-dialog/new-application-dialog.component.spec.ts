import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewApplicationDialogComponent } from './new-application-dialog.component';

describe('NewApplicationDialogComponent', () => {
  let component: NewApplicationDialogComponent;
  let fixture: ComponentFixture<NewApplicationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewApplicationDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewApplicationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
