import { Component, OnInit } from '@angular/core';
import {
    ApplicationsFlowState,
    EaCService,
    SourceControlDialogComponent,
    BuildPipelineDialogComponent,
    ApplicationsFlowService,
    DFSModifiersDialogComponent,
} from '@lowcodeunit/applications-flow-common';
import {
    EaCDevOpsAction,
    EaCDFSModifier,
    EaCEnvironmentAsCode,
    EaCSourceControl,
} from '@semanticjs/common';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
    selector: 'lcu-enterprise-1',
    templateUrl: './enterprise-1.component.html',
    styleUrls: ['./enterprise-1.component.scss'],
})
export class Enterprise1Component implements OnInit {
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
        return this.State?.EaC?.Environments[
            this.State?.EaC?.Enterprise?.PrimaryEnvironment
        ];
    }

    // public get Feed(): Array<FeedItem> {
    //     console.log("Feed: ", this.State?.Feed)
    //     return this.State?.Feed;
    // }

    public get FilterTypes(): Array<string> {
        return Object.values(this.State?.FeedFilters || {});
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
        return Object.keys(this.State?.EaC?.Projects || {}).reverse();
    }

    public get SourceControlLookups(): Array<string> {
        return Object.keys(this.SourceControls || {});
    }

    public get SourceControls(): { [lookup: string]: EaCSourceControl } {
        return this.Environment?.Sources || {};
    }

    public get State(): ApplicationsFlowState {
        return this.eacSvc?.State;
    }

    public EntPath: string;

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
        this.EntPath = 'enterprise-1';
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

    public ngOnInit(): void {}

    public HandleLeftClickEvent(event: any) {}
    public HandleRightClickEvent(event: any) {}

    public OpenModifierDialog(mdfrLookup: string, mdfrName: string) {
        console.log('Modifier lookup: ', mdfrLookup);
        // throw new Error('Not implemented: OpenModifierDialog');
        const dialogRef = this.dialog.open(DFSModifiersDialogComponent, {
            width: '600px',
            data: {
                modifierLookup: mdfrLookup,
                modifierName: mdfrName,
                modifiers: this.Modifiers,
                level: 'enterprise',
            },
        });

        dialogRef.afterClosed().subscribe((result: any) => {
            // console.log('The dialog was closed');
            // console.log("result:", result)
        });
    }

    public OpenBuildPipelineDialog(doaLookup: string, doaName: string = '') {
        const dialogRef = this.dialog.open(BuildPipelineDialogComponent, {
            width: '600px',
            data: {
                devopsActionLookup: doaLookup,
                doaName: doaName,
                environment: this.Environment,
                environmentLookup: this.ActiveEnvironmentLookup,
                // buildPipeline: doaLookup
            },
        });

        dialogRef.afterClosed().subscribe((result: any) => {
            // console.log('The dialog was closed');
            // console.log("result:", result)
        });
    }

    public OpenSourceControlDialog(scLookup: string, scName: string): void {
        const dialogRef = this.dialog.open(SourceControlDialogComponent, {
            width: '385px',
            data: {
                environment: this.Environment,
                environmentLookup: this.ActiveEnvironmentLookup,
                scLookup: scLookup,
                scName: scName,
            },
        });

        dialogRef.afterClosed().subscribe((result: any) => {
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
    // protected async handleStateChange(): Promise<void> {}
}
