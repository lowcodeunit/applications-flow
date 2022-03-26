import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Status } from '@lcu/common';
import { EaCEnvironmentAsCode } from '@semanticjs/common';
import { BuildPipelineFormComponent } from '../../controls/build-pipeline-form/build-pipeline-form.component';
import { EaCService } from '../../services/eac.service';
import { ApplicationsFlowState } from '../../state/applications-flow.state';

export interface BPDialogData {
  devopsActionLookup: string;
  doaName: string;
  environment: EaCEnvironmentAsCode;
  environmentLookup: string;

  // buildPipeline: string;
}

@Component({
  selector: 'lcu-build-pipeline-dialog',
  templateUrl: './build-pipeline-dialog.component.html',
  styleUrls: ['./build-pipeline-dialog.component.scss'],
})
export class BuildPipelineDialogComponent implements OnInit {
  @ViewChild(BuildPipelineFormComponent)
  public BuildPipelineControl: BuildPipelineFormComponent;

  public get BuildPipelineFormGroup(): FormGroup {
    return this.BuildPipelineControl?.BuildPipelineFormGroup;
  }

  public get HasConnection(): boolean {
    return this.State.GitHub.HasConnection;
  }

  public get State(): ApplicationsFlowState {
    return this.eacSvc.State;
  }

  public ErrorMessage: string;

  constructor(
    public dialogRef: MatDialogRef<BuildPipelineDialogComponent>,
    protected eacSvc: EaCService,
    @Inject(MAT_DIALOG_DATA) public data: BPDialogData,
    protected snackBar: MatSnackBar
  ) {}

  public ngOnInit(): void {}

  public CloseDialog() {
    this.dialogRef.close();
  }

  public DeleteDevOpsAction(): void {
    this.eacSvc
      .DeleteDevOpsAction(this.data.devopsActionLookup, this.data.doaName)
      .then((status) => {
        this.CloseDialog();
      });
  }

  public HandleResponseEvent(event: Status) {
    console.log('Response Event: ', event);
    if (event.Code === 0) {
      this.snackBar.open('Build Pipeline Created Succesfully', 'Dismiss', {
        duration: 5000,
      });
      this.CloseDialog();
    } else {
      this.ErrorMessage = event.Message;
    }
  }

  public SaveBuildPipeline() {
    this.BuildPipelineControl.SaveEnvironment();
  }
}
