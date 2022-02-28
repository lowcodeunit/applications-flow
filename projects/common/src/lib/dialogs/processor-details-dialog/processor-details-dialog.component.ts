import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Guid } from '@lcu/common';
import { EaCApplicationAsCode, EaCEnvironmentAsCode, EaCSourceControl } from '@semanticjs/common';
import { ProcessorDetailsFormComponent } from '../../controls/processor-details-form/processor-details-form.component';
import { EaCService, SaveApplicationAsCodeEventRequest } from '../../services/eac.service';
import { ApplicationsFlowState } from '../../state/applications-flow.state';


export interface ProcessorDetailsDialogData {
  applicationLookup: string;
  environmentLookup: string;
  projectLookup: string;
}

@Component({
  selector: 'lcu-processor-details-dialog',
  templateUrl: './processor-details-dialog.component.html',
  styleUrls: ['./processor-details-dialog.component.scss']
})

export class ProcessorDetailsDialogComponent implements OnInit {

  @ViewChild(ProcessorDetailsFormComponent)
  public ProcessorDetailsFormControls: ProcessorDetailsFormComponent;

  public get Application(): EaCApplicationAsCode {
    return this.State?.EaC?.Applications[this.data.applicationLookup] || {};
  }

  public get Environment(): EaCEnvironmentAsCode {
    return this.State?.EaC?.Environments[this.data.environmentLookup];
  }

  public get SourceControls(): { [lookup: string]: EaCSourceControl } {
    return this.Environment?.Sources || {};
  }

  public get SourceControlLookups(): Array<string> {
    return Object.keys(this.Environment?.Sources || {});
  }

  public get State(): ApplicationsFlowState {
    return this.eacSvc.State;
  }

  constructor(protected eacSvc: EaCService, 
    public dialogRef: MatDialogRef<ProcessorDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProcessorDetailsDialogData) { }

  public ngOnInit(): void {
  }

  public CloseDialog(){
    this.dialogRef.close();
  }

  public HandleSaveFormEvent(event: any){
    console.log("event: ", event);
  }

  

}
