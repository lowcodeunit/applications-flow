import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Status } from '@lcu/common';
import { EaCApplicationAsCode } from '@semanticjs/common';

export interface ApplicationDialogData {
  application: EaCApplicationAsCode;
 
}

@Component({
  selector: 'lcu-edit-application-dialog',
  templateUrl: './edit-application-dialog.component.html',
  styleUrls: ['./edit-application-dialog.component.scss']
})
export class EditApplicationDialogComponent implements OnInit {

  public ErrorMessage: string;

  constructor(public dialogRef: MatDialogRef<EditApplicationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ApplicationDialogData,
    protected snackBar: MatSnackBar) { }

  public ngOnInit(): void {
  }

  public CloseDialog(){
    this.dialogRef.close();
  }

  public SaveApplication(event: Status){
    console.log("event to save: ", event);
    if (event.Code === 0){
      this.snackBar.open("Application Succesfully Updated", "Dismiss",{
        duration: 5000
      });
      this.CloseDialog();
    }
    else{
      this.ErrorMessage = event.Message;
    }
  }

}
