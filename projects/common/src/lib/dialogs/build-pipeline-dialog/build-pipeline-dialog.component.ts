import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Status } from '@lcu/common';
import { EaCEnvironmentAsCode } from '@semanticjs/common';


export interface BPDialogData {
  devopsActionLookup: string;
  environment: EaCEnvironmentAsCode;
  environmentLookup: string;
  // buildPipeline: string;
}

@Component({
  selector: 'lcu-build-pipeline-dialog',
  templateUrl: './build-pipeline-dialog.component.html',
  styleUrls: ['./build-pipeline-dialog.component.scss']
})

export class BuildPipelineDialogComponent implements OnInit {

  public ErrorMessage: string;

constructor( public dialogRef: MatDialogRef<BuildPipelineDialogComponent>,
  @Inject(MAT_DIALOG_DATA) public data: BPDialogData,
  protected snackBar: MatSnackBar) { }

  public ngOnInit(): void {
  }

  public CloseDialog(){
    this.dialogRef.close();
  }

  public HandleResponseEvent(event: Status){
    console.log("Response Event: ", event);
    if (event.Code === 0){
      this.snackBar.open("Build Pipeline Created Succesfully", "Dismiss",{
        duration: 5000
      });
      this.CloseDialog();
    }
    else{
      this.ErrorMessage = event.Message;
    }
  }

 
}
