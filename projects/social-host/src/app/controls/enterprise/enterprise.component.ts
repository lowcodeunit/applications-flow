import { Component, OnInit } from '@angular/core';
import {
  ApplicationsFlowState,
  EaCService,
  SourceControlDialogComponent,
  BuildPipelineDialogComponent,
  ApplicationsFlowService,
} from '@lowcodeunit/applications-flow-common';
import {
  EaCDevOpsAction,
  EaCEnvironmentAsCode,
  EaCSourceControl,
} from '@semanticjs/common';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'lcu-enterprise',
  templateUrl: './enterprise.component.html',
  styleUrls: ['./enterprise.component.scss'],
})
export class EnterpriseComponent implements OnInit {
  public get ActiveEnvironment(): EaCEnvironmentAsCode {
    return this.State?.EaC?.Environments[this.ActiveEnvironmentLookup];
  }

  public get ActiveEnvironmentLookup(): string {
    //  TODO:  Eventually support multiple environments
    const envLookups = Object.keys(this.State?.EaC?.Environments || {});

    return envLookups[0];
  }

  public get DevOpsActions(): { [lookup: string]: EaCDevOpsAction } {
    return this.Environment?.DevOpsActions || {};
  }

  public get DevOpsActionLookups(): Array<string> {
    return Object.keys(this.DevOpsActions || {});
  }

  public get Enterprise(): any {
    return this.State?.EaC?.Enterprise;
  }

  public get Environment(): EaCEnvironmentAsCode {
    // console.log("Ent Environment var: ", this.State?.EaC?.Environments[this.State?.EaC?.Enterprise?.PrimaryEnvironment]);
    return this.State?.EaC?.Environments[
      this.State?.EaC?.Enterprise?.PrimaryEnvironment
    ];
  }

  public get SourceControlLookups(): Array<string> {
    return Object.keys(this.SourceControls || {});
  }

  public get SourceControls(): { [lookup: string]: EaCSourceControl } {
    return this.Environment?.Sources || {};
  }

  public get NumberOfSourceControls(): number {
    return this.SourceControlLookups?.length;
  }

  public get NumberOfPipelines(): number {
    return this.DevOpsActionLookups?.length;
  }

  public get NumberOfProjects(): number {
    return this.ProjectLookups?.length;
  }

  public get ProjectLookups(): string[] {
    return Object.keys(this.State?.EaC?.Projects || {});
  }

  public get State(): ApplicationsFlowState {
    return this.eacSvc.State;
  }

  public IsInfoCardEditable: boolean;

  public IsInfoCardShareable: boolean;

  constructor(
    protected appSvc: ApplicationsFlowService,
    protected dialog: MatDialog,
    protected eacSvc: EaCService,
    protected router: Router
  ) {
    this.IsInfoCardEditable = false;
    this.IsInfoCardShareable = false;
  }

  public ngOnInit(): void {
    this.handleStateChange().then((eac) => {});

    // console.log("FEED on init: ", this.Feed)
  }

  public HandleLeftClickEvent(event: any) {}
  public HandleRightClickEvent(event: any) {}

  public OpenBuildPipelineDialog(doaLookup: string) {
    const dialogRef = this.dialog.open(BuildPipelineDialogComponent, {
      width: '600px',
      data: {
        devopsActionLookup: doaLookup,
        environment: this.Environment,
        environmentLookup: this.ActiveEnvironmentLookup,
        // buildPipeline: doaLookup
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log('The dialog was closed');
      // console.log("result:", result)
    });
  }

  public OpenSourceControlDialog(scLookup: string): void {
    const dialogRef = this.dialog.open(SourceControlDialogComponent, {
      width: '550px',
      data: {
        environment: this.Environment,
        environmentLookup: this.ActiveEnvironmentLookup,
        scLookup: scLookup,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log('The dialog was closed');
      // console.log("result:", result)
    });
  }

  public RouteToPath(path: string): void {
    window.location.href = path;
  }

  public UpgradeClicked() {}

  //HELPERS
  protected async handleStateChange(): Promise<void> {}
}
