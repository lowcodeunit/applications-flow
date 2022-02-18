import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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

  constructor(public dialogRef: MatDialogRef<EditApplicationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ApplicationDialogData) { }

  public ngOnInit(): void {
  }

  public CloseDialog(){
    this.dialogRef.close();
  }

  public SaveApplication(appEvent: any){
    console.log("event to save: ", appEvent);
    this.dialogRef.close({event: appEvent});
  }

}
