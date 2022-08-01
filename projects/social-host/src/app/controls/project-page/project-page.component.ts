import { Component, OnInit } from '@angular/core';
import {
    ApplicationsFlowState,
    EaCService,
} from '@lowcodeunit/applications-flow-common';
import { EaCApplicationAsCode } from '@semanticjs/common';
@Component({
    selector: 'lcu-project-page',
    templateUrl: './project-page.component.html',
    styleUrls: ['./project-page.component.scss'],
})
export class ProjectPageComponent implements OnInit {
    public get ProjectLookups(): string[] {
        return Object.keys(this.State?.EaC?.Projects || {}).reverse();
    }

    // public get State(): ApplicationsFlowState {
    //     return this.eacSvc?.State;
    // }

    public State: ApplicationsFlowState;

    constructor(protected eacSvc: EaCService) {}

    public ngOnInit(): void {
        this.eacSvc.State.subscribe((state) => {
            this.State = state;
        });
    }

    public RouteToPath(path: string): void {
        window.location.href = path;
    }
}
