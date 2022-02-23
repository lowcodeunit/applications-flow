import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EaCApplicationAsCode, EaCEnvironmentAsCode, EnterpriseAsCode } from '@semanticjs/common';
import { EaCService } from '../../services/eac.service';
import { ApplicationsFlowState } from '../../state/applications-flow.state';

export interface ApplicationDialogData {
  application: EaCApplicationAsCode;
  applicationLookup: string;
  environment: EaCEnvironmentAsCode;
  projectLookup: string;


 
}

@Component({
  selector: 'lcu-new-application-dialog',
  templateUrl: './new-application-dialog.component.html',
  styleUrls: ['./new-application-dialog.component.scss']
})

export class NewApplicationDialogComponent implements OnInit {

  public get SourceControlLookups(): Array<string> {
    return Object.keys(this.data.environment.Sources || {});
  }

  public get State(): ApplicationsFlowState{
    return this.eacSvc.State;
  }

  public HasSaveButton: boolean;

  constructor(
    protected eacSvc: EaCService, 
    public dialogRef: MatDialogRef<NewApplicationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ApplicationDialogData) { 
    this.HasSaveButton = false
  }

  ngOnInit(): void {
  }

}
