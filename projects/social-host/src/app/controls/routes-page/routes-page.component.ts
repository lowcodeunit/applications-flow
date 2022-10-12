import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EaCProjectAsCode } from '@semanticjs/common';
import {
    ApplicationsFlowState,
    EaCService,
} from '@lowcodeunit/applications-flow-common';
import { Subscription } from 'rxjs';

@Component({
    selector: 'lcu-routes-page',
    templateUrl: './routes-page.component.html',
    styleUrls: ['./routes-page.component.scss'],
})
export class RoutesPageComponent implements OnInit {
    public ActiveEnvironmentLookup: string;

    public Project: EaCProjectAsCode;

    public ProjectLookup: string;

    public State: ApplicationsFlowState;

    public StateSub: Subscription;

    constructor(
        protected eacSvc: EaCService,
        private activatedRoute: ActivatedRoute
    ) {
        this.activatedRoute.params.subscribe((params: any) => {
            this.ProjectLookup = params['projectLookup'];
        });
    }

    ngOnInit(): void {
        this.StateSub = this.eacSvc.State.subscribe((state) => {
            this.State = state;

            this.ActiveEnvironmentLookup = Object.keys(
                this.State?.EaC?.Environments || {}
            )[0];

            this.Project = this.State?.EaC?.Projects[this.ProjectLookup] || {};
        });
    }
    ngOnDestroy() {
        this.StateSub.unsubscribe();
    }
}
