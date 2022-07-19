import { Component, OnInit } from '@angular/core';
import { EaCService } from '../../services/eac.service';
import { ApplicationsFlowState } from '../../state/applications-flow.state';

@Component({
    selector: 'lcu-project-card',
    templateUrl: './project-card.component.html',
    styleUrls: ['./project-card.component.scss'],
})
export class ProjectCardComponent implements OnInit {
    public get ProjectLookups(): string[] {
        return Object.keys(this.State?.EaC?.Projects || {}).reverse();
    }

    public get State(): ApplicationsFlowState {
        return this.eacSvc?.State;
    }
    constructor(protected eacSvc: EaCService) {}

    public ngOnInit(): void {}

    public RouteToPath(path: string): void {
        window.location.href = path;
    }
}
