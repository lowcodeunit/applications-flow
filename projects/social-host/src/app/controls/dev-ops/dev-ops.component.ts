import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { Subscription } from 'rxjs';

@Component({
    selector: 'lcu-dev-ops',
    templateUrl: './dev-ops.component.html',
    styleUrls: ['./dev-ops.component.scss'],
})
export class DevOpsComponent implements OnInit, OnDestroy {
    private get ActiveEnvironmentLookup(): string {
        //  TODO:  Eventually support multiple environments
        const envLookups = Object.keys(this.State?.EaC?.Environments || {});
        // console.log('ActiveEnvironmentLookup: ', envLookups[0]);

        // console.log("env: ", envLookups[0]);

        return envLookups[0];
    }

    private get DevOpsActions(): { [lookup: string]: EaCDevOpsAction } {
        return this.Environment?.DevOpsActions || {};
    }

    private get Environment(): EaCEnvironmentAsCode {
        return this.State?.EaC?.Environments[
            this.State?.EaC?.Enterprise?.PrimaryEnvironment
        ];
    }

    private get SourceControls(): { [lookup: string]: EaCSourceControl } {
        return this.Environment?.Sources || {};
    }

    public DevOpsActionLookups: Array<string>;

    public ProjectLookups: Array<string>;

    public SourceControlLookups: Array<string>;

    public State: ApplicationsFlowState;

    public StateSub: Subscription;

    public SkeletonEffect: string;

    constructor(protected eacSvc: EaCService, protected dialog: MatDialog) {
        this.SkeletonEffect = 'wave';
    }

    public ngOnInit(): void {
        this.StateSub = this.eacSvc.State.subscribe(
            (state: ApplicationsFlowState) => {
                this.State = state;

                this.DevOpsActionLookups = Object.keys(
                    this.DevOpsActions || {}
                );

                this.SourceControlLookups = Object.keys(
                    this.SourceControls || {}
                );

                this.ProjectLookups = Object.keys(
                    this.State?.EaC?.Projects || {}
                );
            }
        );
    }

    public ngOnDestroy() {
        this.StateSub.unsubscribe();
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
        // console.log('active ent: ', this.ActiveEnvironmentLookup);
        const dialogRef = this.dialog.open(SourceControlDialogComponent, {
            width: '600px',
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
