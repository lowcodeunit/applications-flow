import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    ApplicationsFlowState,
    EaCService,
} from '@lowcodeunit/applications-flow-common';
import { Subscription } from 'rxjs';
@Component({
    selector: 'lcu-project-page',
    templateUrl: './project-page.component.html',
    styleUrls: ['./project-page.component.scss'],
})
export class ProjectPageComponent implements OnInit, OnDestroy {
    public State: ApplicationsFlowState;

    public StateSub: Subscription;

    public ProjectLookups: Array<string>;

    constructor(protected eacSvc: EaCService) {}

    public ngOnInit(): void {
        this.StateSub = this.eacSvc.State.subscribe(
            (state: ApplicationsFlowState) => {
                this.State = state;

                this.ProjectLookups = Object.keys(
                    this.State?.EaC?.Projects || {}
                ).reverse();
            }
        );
    }

    public ngOnDestroy() {
        this.StateSub.unsubscribe();
    }

    public RouteToPath(path: string): void {
        window.location.href = path;
    }
}
