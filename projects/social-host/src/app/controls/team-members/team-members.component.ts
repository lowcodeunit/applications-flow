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
    public get State(): ApplicationsFlowState {
        return this.eacSvc?.State;
    }

    constructor(protected eacSvc: EaCService) {}

    ngOnInit(): void {}
}
