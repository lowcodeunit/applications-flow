import { EventEmitter, Injectable, Injector } from '@angular/core';
import { ProjectState } from '../state/applications-flow.state';
import { GitHubWorkflowRun } from '../state/applications-flow.state';

@Injectable({
  providedIn: 'root',
})
export class ApplicationsFlowEventsService {
  //  Fields

  //  Properties
  public DeleteProjectEvent: EventEmitter<string>;

  public DeployRunEvent: EventEmitter<GitHubWorkflowRun>;

  public ListProjectsEvent: EventEmitter<boolean>;

  public SaveProjectEvent: EventEmitter<ProjectState>;

  public SetCreatingProjectEvent: EventEmitter<boolean>;

  public SetEditProjectSettingsEvent: EventEmitter<ProjectState>;

  // Constructors
  constructor() {
    this.DeleteProjectEvent = new EventEmitter();

    this.DeployRunEvent = new EventEmitter();

    this.ListProjectsEvent = new EventEmitter();

    this.SaveProjectEvent = new EventEmitter();

    this.SetCreatingProjectEvent = new EventEmitter();

    this.SetEditProjectSettingsEvent = new EventEmitter();
  }

  // API Methods
  public DeleteProject(projectId: string): void {
    this.DeleteProjectEvent.emit(projectId);
  }

  public DeployRun(run: GitHubWorkflowRun): void {
    this.DeployRunEvent.emit(run);
  }

  public ListProjects(withLoading: boolean): void {
    this.ListProjectsEvent.emit(withLoading);
  }

  public SaveProject(project: ProjectState): void {
    this.SaveProjectEvent.emit(project);
  }

  public SetCreatingProject(creatingProject: boolean): void {
    this.SetCreatingProjectEvent.emit(creatingProject);
  }

  public SetEditProjectSettings(project: ProjectState): void {
    this.SetEditProjectSettingsEvent.emit(project);
  }

  //  Helpers
}
