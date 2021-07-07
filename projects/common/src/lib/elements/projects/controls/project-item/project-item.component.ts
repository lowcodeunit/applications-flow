import { Subscription } from 'rxjs';
import { ProjectService } from './../../../../services/project.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProjectState } from './../../../../state/applications-flow.state';
import { ProjectItemModel } from './../../../../models/project-item.model';
import { ApplicationsFlowEventsService } from './../../../../services/applications-flow-events.service';

@Component({
  selector: 'lcu-project-items',
  templateUrl: './project-item.component.html',
  styleUrls: ['./project-item.component.scss'],
})
export class ProjectItemComponent implements OnInit {
  /**
   * Event to edit project settings
   */
  // @Output('edit-project-settings')
  // public EditProjectSettings: EventEmitter<ProjectItemModel>;

  /**
   * List of projects
   */
  @Input('projects')
  public Projects: Array<ProjectState>;

  public ProjectItems: Array<ProjectItemModel>;

  public PanelOpenState: boolean;

  constructor(protected appsFlowEventsSvc: ApplicationsFlowEventsService) {}

  public ngOnInit(): void {}

  /**
   *
   * @param project Current project object
   *
   * Event to edit project settings
   */
  public ProjectSettings(project: ProjectItemModel): void {
    this.appsFlowEventsSvc.SetEditProjectSettings(project);
  }

  public CurrentProject(project: ProjectState): void {
    // this.projectService.CurrentSelectedProject.next(project);
  }
}
