import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
    ApplicationsFlowState,
    EaCService,
} from '@lowcodeunit/applications-flow-common';
import { Subscription } from 'rxjs';
@Component({
    selector: 'lcu-team-members',
    templateUrl: './team-members.component.html',
    styleUrls: ['./team-members.component.scss'],
})
export class TeamMembersComponent implements OnInit, OnDestroy {
    public SkeletonEffect: string;

    public State: ApplicationsFlowState;

    public StateSub: Subscription;

    public ActiveRouteSub: Subscription;

    public ProjectLookup: string;

    public ProjectLookups: Array<string>;

    public Loading: boolean;

    constructor(
        protected eacSvc: EaCService,
        private activatedRoute: ActivatedRoute
    ) {
        this.SkeletonEffect = 'wave';
        this.ActiveRouteSub = this.activatedRoute.params.subscribe(
            (params: any) => {
                if (params) {
                    this.ProjectLookup = params['projectLookup'];
                } else {
                    this.ProjectLookup = null;
                }
            }
        );
    }

    ngOnInit(): void {
        this.StateSub = this.eacSvc.State.subscribe(
            (state: ApplicationsFlowState) => {
                this.State = state;

                if (this.State?.EaC?.Projects) {
                    this.ProjectLookups = Object.keys(
                        this.State?.EaC?.Projects || {}
                    ).reverse();
                }

                this.Loading =
                    this.State?.LoadingActiveEnterprise ||
                    this.State?.LoadingEnterprises ||
                    this.State?.Loading;
            }
        );
    }

    ngOnDestroy(): void {
        this.ActiveRouteSub.unsubscribe();
        this.StateSub.unsubscribe();
    }
}
