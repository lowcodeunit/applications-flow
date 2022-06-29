import { Component, OnInit } from '@angular/core';
import {
    ApplicationsFlowService,
    ApplicationsFlowState,
    EaCService,
} from '@lowcodeunit/applications-flow-common';

@Component({
    selector: 'lcu-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
    public get Enterprise(): any {
        return this.State?.EaC?.Enterprise;
    }

    public get State(): ApplicationsFlowState {
        return this.eacSvc?.State;
    }

    constructor(
        protected appSvc: ApplicationsFlowService,
        protected eacSvc: EaCService
    ) {}

    ngOnInit(): void {}
}
