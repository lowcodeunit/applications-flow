import { Subscription } from 'rxjs';
import { ProjectService } from './../../../../services/project.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProjectState } from './../../../../state/applications-flow.state';
import { ProjectItemModel } from './../../../../models/project-item.model';


@Component({
  selector: 'lcu-project-items',
  templateUrl: './project-item.component.html',
  styleUrls: ['./project-item.component.scss']
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
  private _projects: Array<ProjectState>;
  @Input('projects')
  set Projects(val: Array<ProjectState>) {

    if (!val) { return; }

    this._projects = val;

    // set the initial project, passes data to the build componoent
    this.CurrentProject(val[0]);
  }

  get Projects(): Array<ProjectState> {
    return this._projects;
  }

  public ProjectItems: Array<ProjectItemModel>;

  public PanelOpenState: boolean;

  constructor(
    protected projectService: ProjectService) {
    }

  public ngOnInit(): void {

  }

  /**
   * 
   * @param project Current project object
   * 
   * Event to edit project settings
   */
  public ProjectSettings(project: ProjectItemModel): void {
    this.projectService.SetEditProjectSettings.next(project);
  }

  public CurrentProject(project: ProjectState): void {

    this.projectService.CurrentSelectedProject.next(project);
  }
}
