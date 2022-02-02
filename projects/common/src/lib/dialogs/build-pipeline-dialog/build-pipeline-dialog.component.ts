import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EaCEnvironmentAsCode } from '@semanticjs/common';

export interface BPDialogData {
  devopsActionLookup: string;
  environment: EaCEnvironmentAsCode;
  buildPipeline: string;
  // mainBranch: string;
  // organization: string;
  // repository: string;
}

@Component({
  selector: 'lcu-build-pipeline-dialog',
  templateUrl: './build-pipeline-dialog.component.html',
  styleUrls: ['./build-pipeline-dialog.component.scss']
})
export class BuildPipelineDialogComponent implements OnInit {



constructor( public dialogRef: MatDialogRef<BuildPipelineDialogComponent>,
  @Inject(MAT_DIALOG_DATA) public data: BPDialogData) { }

  ngOnInit(): void {
  }

}
