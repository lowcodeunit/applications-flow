import { Component, Input, OnInit } from '@angular/core';
import { EaCProjectAsCode } from '@semanticjs/common';
import { EaCService } from '../../services/eac.service';

@Component({
    selector: 'lcu-project-card',
    templateUrl: './project-card.component.html',
    styleUrls: ['./project-card.component.scss'],
})
export class ProjectCardComponent implements OnInit {
    @Input('loading')
    public Loading: boolean;

    @Input('project-lookups')
    public ProjectLookups: Array<string>;

    @Input('projects')
    public Projects: Array<EaCProjectAsCode>;

    // public get ProjectLookups(): string[] {
    //     return Object.keys(this.Projects || {}).reverse();
    // }

    // public get State(): ApplicationsFlowState {
    //     return this.eacSvc?.State;
    // }
    constructor(protected eacSvc: EaCService) {}

    public ngOnInit(): void {}

    public RouteToPath(path: string): void {
        window.location.href = path;
    }
}
