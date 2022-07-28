import { Component, OnInit } from '@angular/core';
import {
    ApplicationsFlowState,
    EaCService,
} from '@lowcodeunit/applications-flow-common';
@Component({
    selector: 'lcu-team-members',
    templateUrl: './team-members.component.html',
    styleUrls: ['./team-members.component.scss'],
})
export class TeamMembersComponent implements OnInit {
    public SkeletonEffect: string;

    public State: ApplicationsFlowState;

    public ProjectLookups: Array<string>;

    constructor(protected eacSvc: EaCService) {
        this.SkeletonEffect = 'wave';
    }

    ngOnInit(): void {
        this.eacSvc.State.subscribe((state) => {
            this.State = state;

            if (this.State?.EaC?.Projects) {
                this.ProjectLookups = Object.keys(
                    this.State?.EaC?.Projects || {}
                ).reverse();
            }
        });
    }
}
