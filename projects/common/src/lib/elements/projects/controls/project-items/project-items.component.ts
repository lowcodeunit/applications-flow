import { Component, Input, OnInit } from '@angular/core';
import { EaCService } from '../../../../services/eac.service';
import { EaCProjectAsCode } from '@semanticjs/common';

@Component({
    selector: 'lcu-project-items',
    templateUrl: './project-items.component.html',
    styleUrls: ['./project-items.component.scss'],
})
export class ProjectItemsComponent implements OnInit {
    //  Fields

    //  Properties
    public get ProjectLookups(): Array<string> {
        return Object.keys(this.Projects || {});
    }

    /**
     * List of projects
     */
    @Input('projects')
    public Projects: { [lookup: string]: EaCProjectAsCode };

    public PanelOpenState: boolean;

    @Input('selected-project-lookup')
    public SelectedProjectLookup: string;

    //  Constructors
    constructor(protected eacSvc: EaCService) {}

    //  Life Cycle
    public ngOnInit(): void {}

    //  API Methods
    public DeleteProject(projectLookup: string, projectName: string): void {
        this.eacSvc.DeleteProject(projectLookup, projectName).then();
    }

    public GetPrimaryHost(project: EaCProjectAsCode): string {
        return project.PrimaryHost;
    }

    /**
     *
     * @param project Current project object
     *
     * Event to edit project settings
     */
    public ProjectSettings(projectLookup: string): void {
        this.eacSvc.SetEditProjectSettings(projectLookup);
    }

    //HELPERS
}
