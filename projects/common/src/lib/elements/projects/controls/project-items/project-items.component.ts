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
  public ngOnInit(): void {
  }

  //  API Methods
  public DeleteProject(projectLookup: string, projectName: string): void {
    if (confirm(`Are you sure you want to delete project '${projectName}'?`)) {
      this.eacSvc.DeleteProject(projectLookup);
    }
  }

  public GetPrimaryHost(project: EaCProjectAsCode): string {
    return project.Hosts[project.Hosts.length - 1];
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
