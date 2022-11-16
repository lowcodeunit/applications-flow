import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { SocialUIService } from 'projects/common/src/lib/services/social-ui.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'lcu-enterprise',
    templateUrl: './enterprise.component.html',
    styleUrls: ['./enterprise.component.scss'],
})
export class Enterprise4Component implements OnInit, OnDestroy {
    private get ActiveEnvironmentLookup(): string {
        //  TODO:  Eventually support multiple environments
        const envLookups = Object.keys(this.State?.EaC?.Environments || {});

        return envLookups[0];
    }

    private get DevOpsActions(): { [lookup: string]: EaCDevOpsAction } {
        return this.Environment?.DevOpsActions || {};
    }

    private get DevOpsActionLookups(): Array<string> {
        return Object.keys(this.DevOpsActions || {});
    }

    private get Environment(): EaCEnvironmentAsCode {
        return this.State?.EaC?.Environments[
            this.State?.EaC?.Enterprise?.PrimaryEnvironment
        ];
    }

    private get Modifiers(): { [lookup: string]: EaCDFSModifier } {
        return this.State?.EaC?.Modifiers || {};
    }

    private get ModifierLookups(): Array<string> {
        return Object.keys(this.Modifiers || {});
    }

    private get NumberOfSourceControls(): number {
        return this.SourceControlLookups?.length;
    }

    private get NumberOfModifiers(): number {
        return this.ModifierLookups?.length;
    }

    private get NumberOfPipelines(): number {
        return this.DevOpsActionLookups?.length;
    }

    private get NumberOfProjects(): number {
        return this.ProjectLookups?.length;
    }

    private get SourceControlLookups(): Array<string> {
        return Object.keys(this.SourceControls || {});
    }

    private get SourceControls(): { [lookup: string]: EaCSourceControl } {
        return this.Environment?.Sources || {};
    }

    public ActiveEnvironment: EaCEnvironmentAsCode;

    public FilterTypes: Array<string>;

    public Loading: boolean;

    public ProjectLookups: Array<string>;

    public Slices: { [key: string]: number };

    public SlicesCount: number;

    public State: ApplicationsFlowState;

    public StateSub: Subscription;

    public counter: number;

    public IsInfoCardEditable: boolean;

    public IsInfoCardShareable: boolean;

    constructor(
        protected appSvc: ApplicationsFlowService,
        protected dialog: MatDialog,
        protected eacSvc: EaCService,
        protected router: Router,
        protected socialSvc: SocialUIService
    ) {
        this.counter = 0;

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
        this.StateSub = this.eacSvc.State.subscribe(
            (state: ApplicationsFlowState) => {
                this.State = state;
                console.log('State: ', this.State);

                this.Loading =
                    this.State?.LoadingActiveEnterprise ||
                    this.State?.LoadingEnterprises ||
                    this.State?.Loading;

                this.ProjectLookups = Object.keys(
                    this.State?.EaC?.Projects || {}
                ).reverse();

                this.ActiveEnvironment =
                    this.State?.EaC?.Environments[this.ActiveEnvironmentLookup];
                this.FilterTypes = Object.values(this.State?.FeedFilters || {});
            }
        );
    }

    public ngOnDestroy() {
        this.StateSub.unsubscribe();
    }

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
