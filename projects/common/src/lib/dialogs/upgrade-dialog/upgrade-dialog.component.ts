import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'lcu-upgrade-dialog',
  templateUrl: './upgrade-dialog.component.html',
  styleUrls: ['./upgrade-dialog.component.scss']
})
export class UpgradeDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<UpgradeDialogComponent>,
    ) { }

  public ngOnInit(): void {
  }

  public CloseDialog(){
    this.dialogRef.close();
  }

}
