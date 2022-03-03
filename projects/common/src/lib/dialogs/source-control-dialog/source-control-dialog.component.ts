import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Status } from '@lcu/common';
import { EaCEnvironmentAsCode } from '@semanticjs/common';
import { EaCService } from '../../services/eac.service';
import { ApplicationsFlowState } from '../../state/applications-flow.state';

export interface SCDialogData {
  environment: EaCEnvironmentAsCode;
  environmentLookup: string;
  scLookup: string;
}

@Component({
  selector: 'lcu-source-control-dialog',
  templateUrl: './source-control-dialog.component.html',
  styleUrls: ['./source-control-dialog.component.scss']
})
export class SourceControlDialogComponent implements OnInit {

  public get HasConnection(): boolean{
    return this.eacSvc.State.GitHub.HasConnection;
  }


  public ErrorMessage: string;

  constructor( public dialogRef: MatDialogRef<SourceControlDialogComponent>,
    protected eacSvc: EaCService,
    @Inject(MAT_DIALOG_DATA) public data: SCDialogData,
    protected snackBar: MatSnackBar) { }

  public ngOnInit(): void {
    
  }


  public CloseDialog(){
    this.dialogRef.close();
  }

  public HandleSaveStatusEvent(event: Status){
    console.log("event to save: ", event);
    if (event.Code === 0){
      this.snackBar.open("Source Control Succesfully Saved", "Dismiss",{
        duration: 5000
      });
      this.CloseDialog();
    }
    else{
      this.ErrorMessage = event.Message;
    }
  }

}
