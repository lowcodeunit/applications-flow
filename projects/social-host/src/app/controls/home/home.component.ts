import {
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
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
import { Subscription } from 'rxjs';

@Component({
    selector: 'lcu-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
    private get Environment(): EaCEnvironmentAsCode {
        return this.State?.EaC?.Environments[
            this.State?.EaC?.Enterprise?.PrimaryEnvironment
        ];
    }

    private get DevOpsActions(): { [lookup: string]: EaCDevOpsAction } {
        return this.Environment?.DevOpsActions || {};
    }

    private get DevOpsActionLookups(): Array<string> {
        return Object.keys(this.DevOpsActions || {});
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
    private get SourceControlLookups(): Array<string> {
        return Object.keys(this.SourceControls || {});
    }

    private get SourceControls(): { [lookup: string]: EaCSourceControl } {
        return this.Environment?.Sources || {};
    }

    private get NumberOfProjects(): number {
        return this.ProjectLookups?.length;
    }

    public ActiveEnvironmentLookup: string;

    public Loading: boolean;

    public ProjectLookups: Array<string>;

    public Slices: { [key: string]: number };

    public SlicesCount: number;

    public State: ApplicationsFlowState;

    public StateSub: Subscription;

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

    public ngOnInit(): void {
        this.StateSub = this.eacSvc.State.subscribe(
            (state: ApplicationsFlowState) => {
                this.State = state;
                console.log('State home:', this.State);

                this.Loading =
                    this.State?.LoadingActiveEnterprise ||
                    this.State?.LoadingEnterprises ||
                    this.State?.Loading;

                console.log('loading = ', this.Loading);

                this.ProjectLookups = Object.keys(
                    this.State?.EaC?.Projects || {}
                ).reverse();

                //  TODO:  Eventually support multiple environments
                const envLookups = Object.keys(
                    this.State?.EaC?.Environments || {}
                );

                this.ActiveEnvironmentLookup = envLookups[0];
            }
        );
    }

    public ngOnDestroy() {
        this.StateSub.unsubscribe();
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
}
