import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
    ApplicationsFlowState,
    BuildPipelineDialogComponent,
    EaCService,
    SourceControlDialogComponent,
} from '@lowcodeunit/applications-flow-common';
import {
    EaCDevOpsAction,
    EaCEnvironmentAsCode,
    EaCSourceControl,
} from '@semanticjs/common';

@Component({
    selector: 'lcu-dev-ops',
    templateUrl: './dev-ops.component.html',
    styleUrls: ['./dev-ops.component.scss'],
})
export class DevOpsComponent implements OnInit {
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

    public get Environment(): EaCEnvironmentAsCode {
        return this.State?.EaC?.Environments[
            this.State?.EaC?.Enterprise?.PrimaryEnvironment
        ];
    }

    public get SourceControlLookups(): Array<string> {
        return Object.keys(this.SourceControls || {});
    }

    public get SourceControls(): { [lookup: string]: EaCSourceControl } {
        console.log('env HERE: ', this.Environment);
        return this.Environment?.Sources || {};
    }

    public get State(): ApplicationsFlowState {
        console.log('State: ', this.eacSvc?.State);
        return this.eacSvc?.State;
    }

    constructor(protected eacSvc: EaCService, protected dialog: MatDialog) {}

    public ngOnInit(): void {}

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
}
