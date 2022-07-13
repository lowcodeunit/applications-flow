import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
    ApplicationsFlowService,
    ApplicationsFlowState,
    EaCService,
} from '@lowcodeunit/applications-flow-common';
import { SocialUIService } from 'projects/common/src/lib/services/social-ui.service';

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

    public get NumberOfProjects(): number {
        return this.ProjectLookups?.length;
    }

    public EntPath: string;

    public Slices: { [key: string]: number };

    public SlicesCount: number;

    constructor(
        protected appSvc: ApplicationsFlowService,
        protected eacSvc: EaCService,
        protected socialSvc: SocialUIService
    ) {
        this.EntPath = 'enterprise-0';
        this.socialSvc.AssignEnterprisePath(this.EntPath);

        this.SlicesCount = 5;

        this.Slices = {
            Projects: this.SlicesCount,
        };
    }

    public ngOnInit(): void {}
    public ngAfterViewInit() {}

    public ToggleSlices(type: string) {
        let count = this.Slices[type];

        let length =
            type === 'Projects' ? this.NumberOfProjects : this.SlicesCount;

        if (count === length) {
            this.Slices[type] = this.SlicesCount;
        } else {
            this.Slices[type] = length;
        }
    }
}
