import {
    ApplicationsFlowState,
    EaCService,
} from '@lowcodeunit/applications-flow-common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { EaCProjectAsCode } from '@semanticjs/common';

@Component({
    selector: 'lcu-custom-domain-page',
    templateUrl: './custom-domain-page.component.html',
    styleUrls: ['./custom-domain-page.component.scss'],
})
export class CustomDomainPageComponent implements OnInit {
    public DomainData: any;

    public SkeletonEffect: string;

    public State: ApplicationsFlowState;

    protected StateSub: Subscription;

    public Project: EaCProjectAsCode;

    public ProjectLookup: string;

    public Loading: boolean;

    constructor(
        private activatedRoute: ActivatedRoute,
        protected eacSvc: EaCService
    ) {
        this.SkeletonEffect = 'wave';

        this.activatedRoute.params.subscribe((params: any) => {
            // console.log('params: ', params);
            if (params) {
                this.ProjectLookup = params['projectLookup'];
            } else {
                this.ProjectLookup = null;
            }
            // console.log('pjl:', this.ProjectLookup);
        });
    }

    public ngOnInit(): void {
        this.StateSub = this.eacSvc.State.subscribe((state) => {
            this.State = state;

            if (this.State?.EaC?.Projects) {
                this.Project =
                    this.State?.EaC?.Projects[this.ProjectLookup] || {};
            }

            if (this.Project?.PrimaryHost && this.State?.EaC?.Hosts) {
                this.DomainData = {
                    Hosts: this.State?.EaC?.Hosts,
                    PrimaryHost: this.Project?.PrimaryHost,
                    Project: this.Project,
                    ProjectLookup: this.ProjectLookup,
                };

                // console.log("domain data: ", this.DomainData)
            }

            this.Loading =
                this.State?.LoadingActiveEnterprise ||
                this.State?.LoadingEnterprises ||
                this.State?.Loading;
        });
    }
}
