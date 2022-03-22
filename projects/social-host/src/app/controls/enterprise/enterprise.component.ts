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
  EaCDFSModifier,
  EaCEnvironmentAsCode,
  EaCSourceControl,
} from '@semanticjs/common';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ThisReceiver } from '@angular/compiler';
import { DFSModifiersDialogComponent } from 'projects/common/src/lib/dialogs/dfs-modifiers-dialog/dfs-modifiers-dialog.component';

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

  public get Modifiers(): { [lookup: string]: EaCDFSModifier } {
    return this.State?.EaC?.Modifiers || {};
  }

  public get ModifierLookups(): Array<string> {
    return Object.keys(this.Modifiers || {});
  }

  public get NumberOfSourceControls(): number {
    return this.SourceControlLookups?.length;
  }

  public get NumberOfModifiers(): number {
    return this.ModifierLookups?.length;
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

  public get SourceControlLookups(): Array<string> {
    return Object.keys(this.SourceControls || {});
  }

  public get SourceControls(): { [lookup: string]: EaCSourceControl } {
    return this.Environment?.Sources || {};
  }

  public get State(): ApplicationsFlowState {
    return this.eacSvc.State;
  }

  public Slices: { [key: string]: number };

  public SlicesCount: number;

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

    this.SlicesCount = 5;

    this.Slices = {
      Modifiers: this.SlicesCount,
      Projects: this.SlicesCount,
      Pipelines: this.SlicesCount,
      Sources: this.SlicesCount,
    };
  }

  public ngOnInit(): void {
    this.handleStateChange().then((eac) => {});

    // console.log("FEED on init: ", this.Feed)
  }

  public DeleteDevOpsAction(doaLookup: string, doaName: string): void {
    if (
      confirm(`Are you sure you want to delete build pipeline '${doaName}'?`)
    ) {
      this.eacSvc.DeleteDevOpsAction(doaLookup);
    }
  }

  public DeleteModifier(mdfrLookup: string, mdfrName: string): void {
    if (
      confirm(`Are you sure you want to delete request modifier '${mdfrName}'?`)
    ) {
      this.eacSvc.DeleteDevOpsAction(mdfrLookup);
    }
  }

  public DeleteProject(projectLookup: string, projectName: string): void {
    if (confirm(`Are you sure you want to delete project '${projectName}'?`)) {
      this.eacSvc.DeleteProject(projectLookup);
    }
  }

  public DeleteSourceControl(scLookup: string): void {
    if (
      confirm(`Are you sure you want to delete source control '${scLookup}'?`)
    ) {
      this.eacSvc.DeleteSourceControl(scLookup);
    }
  }

  public HandleLeftClickEvent(event: any) {}
  public HandleRightClickEvent(event: any) {}

  public OpenModifierDialog(mdfrLookup: string) {
    console.log("Modifier lookup: ", mdfrLookup);
    // throw new Error('Not implemented: OpenModifierDialog');
    const dialogRef = this.dialog.open(DFSModifiersDialogComponent, {
      width: '600px',
      data: {
        modifierLookup: mdfrLookup,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log('The dialog was closed');
      // console.log("result:", result)
    });
  }

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
      width: '385px',
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

  public ToggleSlices(type: string) {
    let count = this.Slices[type];

    let length =
      type === 'Modifiers'
        ? this.NumberOfModifiers
        : type === 'Projects'
        ? this.NumberOfProjects
        : type === 'Pipelines'
        ? this.NumberOfPipelines
        : type === 'Sources'
        ? this.NumberOfSourceControls
        : this.SlicesCount;

    if (count === length) {
      this.Slices[type] = this.SlicesCount;
    } else {
      this.Slices[type] = length;
    }
  }

  public UpgradeClicked() {}

  //HELPERS
  protected async handleStateChange(): Promise<void> {}
}
