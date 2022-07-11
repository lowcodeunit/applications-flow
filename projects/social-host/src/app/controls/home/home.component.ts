import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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

    public get ProjectLookups(): string[] {
        return Object.keys(this.State?.EaC?.Projects || {}).reverse();
    }

    public EntPath: string;

    public Slices: { [key: string]: number };

    public SlicesCount: number;

    constructor(
        protected appSvc: ApplicationsFlowService,
        protected eacSvc: EaCService
    ) {
        this.EntPath = 'home';
        this.SlicesCount = 5;

        this.Slices = {
            Projects: this.SlicesCount,
        };
    }

    public ngOnInit(): void {}
    public ngAfterViewInit() {}
}
