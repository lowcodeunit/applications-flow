import { Component, OnInit } from '@angular/core';
import {
    ApplicationsFlowState,
    EaCService,
} from '@lowcodeunit/applications-flow-common';
@Component({
    selector: 'lcu-project-page',
    templateUrl: './project-page.component.html',
    styleUrls: ['./project-page.component.scss'],
})
export class ProjectPageComponent implements OnInit {
    public State: ApplicationsFlowState;

    public ProjectLookups: Array<string>;

    constructor(protected eacSvc: EaCService) {}

    public ngOnInit(): void {
        this.eacSvc.State.subscribe((state: ApplicationsFlowState) => {
            this.State = state;

            this.ProjectLookups = Object.keys(
                this.State?.EaC?.Projects || {}
            ).reverse();
        });
    }

    public RouteToPath(path: string): void {
        window.location.href = path;
    }
}
