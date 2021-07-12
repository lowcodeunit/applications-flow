import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProjectState } from './../../../../state/applications-flow.state';
import { ApplicationsFlowEventsService } from './../../../../services/applications-flow-events.service';

@Component({
  selector: 'lcu-project-items',
  templateUrl: './project-item.component.html',
  styleUrls: ['./project-item.component.scss'],
})
export class ProjectItemComponent implements OnInit {
  //  Fields

  //  Properties
  /**
   * List of projects
   */
  @Input('projects')
  public Projects: Array<ProjectState>;

  public PanelOpenState: boolean;

  //  Constructors
  constructor(protected appsFlowEventsSvc: ApplicationsFlowEventsService) {}

  //  Life Cycle
  public ngOnInit(): void {}

  //  API Methods
  /**
   *
   * @param project Current project object
   *
   * Event to edit project settings
   */
  public ProjectSettings(project: ProjectState): void {
    this.appsFlowEventsSvc.SetEditProjectSettings(project);
  }

  public CurrentProject(project: ProjectState): void {
    // this.projectService.CurrentSelectedProject.next(project);
  }
}
