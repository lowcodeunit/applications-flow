import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GitHubWorkflowRun, ProjectState } from '../../../../state/applications-flow.state';
import { ApplicationsFlowEventsService } from '../../../../services/applications-flow-events.service';

@Component({
  selector: 'lcu-project-items',
  templateUrl: './project-items.component.html',
  styleUrls: ['./project-items.component.scss'],
})
export class ProjectItemsComponent implements OnInit {
  //  Fields

  //  Properties
  /**
   * List of projects
   */
  @Input('projects')
  public Projects: Array<ProjectState>;

  public PanelOpenState: boolean;

  @Input('selected-project-id')
  public SelectedProjectID: string;

  //  Constructors
  constructor(protected appsFlowEventsSvc: ApplicationsFlowEventsService) {}

  //  Life Cycle
  public ngOnInit(): void {}

  //  API Methods
  public DeleteProject(project: ProjectState): void {
    if (confirm(`Are you sure you want to delete project '${project.Name}'?`)) {
      this.appsFlowEventsSvc.DeleteProject(project.ID);
    }
  }

  public DeployRun(lastrun: GitHubWorkflowRun): void {
    this.appsFlowEventsSvc.DeployRun(lastrun);
  }

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
