import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
    ApplicationsFlowService,
    ApplicationsFlowState,
    EaCService,
} from '@lowcodeunit/applications-flow-common';
import {
    EaCDevOpsAction,
    EaCDFSModifier,
    EaCEnvironmentAsCode,
    EaCSourceControl,
} from '@semanticjs/common';
import { SocialUIService } from 'projects/common/src/lib/services/social-ui.service';

@Component({
    selector: 'lcu-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
    public get Enterprise(): any {
        return this.State?.EaC?.Enterprise;
    }

    public get Environment(): EaCEnvironmentAsCode {
        return this.State?.EaC?.Environments[
            this.State?.EaC?.Enterprise?.PrimaryEnvironment
        ];
    }

    public get DevOpsActions(): { [lookup: string]: EaCDevOpsAction } {
        return this.Environment?.DevOpsActions || {};
    }

    public get DevOpsActionLookups(): Array<string> {
        return Object.keys(this.DevOpsActions || {});
    }

    public get State(): ApplicationsFlowState {
        return this.eacSvc?.State;
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
    public get SourceControlLookups(): Array<string> {
        return Object.keys(this.SourceControls || {});
    }

    public get SourceControls(): { [lookup: string]: EaCSourceControl } {
        return this.Environment?.Sources || {};
    }

    public get ProjectLookups(): string[] {
        return Object.keys(this.State?.EaC?.Projects || {}).reverse();
    }

    public get NumberOfProjects(): number {
        return this.ProjectLookups?.length;
    }

    public get Loading(): boolean {
        return (
            this.State?.LoadingActiveEnterprise ||
            this.State?.LoadingEnterprises ||
            this.State?.Loading
        );
    }

    // public EntPath: string;

    public Slices: { [key: string]: number };

    public SlicesCount: number;

    constructor(
        protected appSvc: ApplicationsFlowService,
        protected eacSvc: EaCService,
        protected socialSvc: SocialUIService
    ) {
        // this.EntPath = 'enterprise-0';
        // this.socialSvc.AssignEnterprisePath(this.EntPath);

        this.SlicesCount = 5;

        this.Slices = {
            Modifiers: this.SlicesCount,
            Projects: this.SlicesCount,
            Pipelines: this.SlicesCount,
            Sources: this.SlicesCount,
        };
    }

    public ngOnInit(): void {}
    public ngAfterViewInit() {}

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
}
