import { Component, OnInit } from '@angular/core';
import { ApplicationsFlowState,  EaCService } from '@lowcodeunit/applications-flow-common';
import { EaCApplicationAsCode, EaCArtifact, EaCDevOpsAction, EaCEnvironmentAsCode, EaCSourceControl } from '@semanticjs/common';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DevopsSourceControlFormComponent } from 'projects/common/src/lib/controls/devops-source-control-form/devops-source-control-form.component';
import { SourceControlDialogComponent } from 'projects/common/src/lib/dialogs/source-control-dialog/source-control-dialog.component';
import { BuildPipelineDialogComponent } from 'projects/common/src/lib/dialogs/build-pipeline-dialog/build-pipeline-dialog.component';

@Component({
  selector: 'lcu-enterprise',
  templateUrl: './enterprise.component.html',
  styleUrls: ['./enterprise.component.scss']
})
export class EnterpriseComponent implements OnInit {

  public get DevOpsActions(): { [lookup: string]: EaCDevOpsAction } {
    console.log("DEV ACTIONS: ", this.Environment?.DevOpsActions)
    return this.Environment?.DevOpsActions || {};
  }

  public get DevOpsActionLookups(): Array<string> {
    return Object.keys(this.DevOpsActions || {});
  }

  public get Enterprise():any{
    return this.State?.EaC?.Enterprise;
  }

  public get Environment(): EaCEnvironmentAsCode {
    // console.log("Ent Environment var: ", this.State?.EaC?.Environments[this.State?.EaC?.Enterprise?.PrimaryEnvironment]);
    return this.State?.EaC?.Environments[this.State?.EaC?.Enterprise?.PrimaryEnvironment];
  }

  public get EditingSourceControlLookup(): string {
    console.log("editingSource lookup: ", this.SourceControlLookups[0]);
    return  this.SourceControlLookups[0];
  }

  
  public get SourceControlLookups(): Array<string> {
    return Object.keys(this.SourceControls || {});
  }

  public get SourceControls(): { [lookup: string]: EaCSourceControl } {
    return this.Environment.Sources || {};
  }

  public get NumberOfSourceControls(): number{
    return this.SourceControlLookups.length;
  }

  public get NumberOfPipelines(): number{
    return this.DevOpsActionLookups.length;
  }

  
  public get NumberOfProjects(): number{
    return this.ProjectLookups.length;
  }

  public get ProjectLookups(): string[]{
    return Object.keys(this.State?.EaC?.Projects || {});
  }

  public get State(): ApplicationsFlowState {
    return this.eacSvc.State;
  }


  constructor(protected eacSvc: EaCService,
    public dialog: MatDialog) {}

  public ngOnInit(): void {
    this.handleStateChange().then((eac) => {});
  }

  public OpenBuildPipelineDialog(doaLookup: string){
    console.log("LOOKUP = ", doaLookup )
    const dialogRef = this.dialog.open(BuildPipelineDialogComponent, {
      width: '600px',
      data: {
        devopsActionLookup: doaLookup, 
        environment: this.Environment 
      }
  
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
      console.log("result:", result)
    });
  }

  public OpenSourceControlDialog(scLookup: string){
    const dialogRef = this.dialog.open(SourceControlDialogComponent, {
      width: '600px',
      data: {environment: this.Environment, scLookup: scLookup},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
      console.log("result:", result)
    });
  }

  

  //HELPERS

  protected async handleStateChange(): Promise<void> {
    this.State.Loading = true;

    await this.eacSvc.EnsureUserEnterprise();

  }

}
