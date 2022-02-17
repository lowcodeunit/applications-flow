import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildPipelineDialogComponent } from './build-pipeline-dialog.component';

describe('BuildPipelineDialogComponent', () => {
  let component: BuildPipelineDialogComponent;
  let fixture: ComponentFixture<BuildPipelineDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuildPipelineDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildPipelineDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
