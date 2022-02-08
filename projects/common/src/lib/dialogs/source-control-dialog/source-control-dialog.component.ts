import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EaCEnvironmentAsCode } from '@semanticjs/common';

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

  constructor( public dialogRef: MatDialogRef<SourceControlDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SCDialogData) { }

  public ngOnInit(): void {
  }

  public CloseDialog(){
    this.dialogRef.close();
  }

}
