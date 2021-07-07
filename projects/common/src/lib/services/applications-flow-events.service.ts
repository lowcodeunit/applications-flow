import { EventEmitter, Injectable, Injector } from '@angular/core';
import { ProjectState } from '../state/applications-flow.state';
import { GitHubWorkflowRun } from '../state/applications-flow.state';

@Injectable({
  providedIn: 'root',
})
export class ApplicationsFlowEventsService {
  //  Fields

  //  Properties
  public DeployRunEvent: EventEmitter<GitHubWorkflowRun>;

  public SetEditProjectSettingsEvent: EventEmitter<ProjectState>;

  // Constructors
  constructor() {
    this.DeployRunEvent = new EventEmitter();

    this.SetEditProjectSettingsEvent = new EventEmitter();
  }

  // API Methods
  public DeployRun(run: GitHubWorkflowRun): void {
    this.DeployRunEvent.emit(run);
  }

  public SetEditProjectSettings(projectItem: ProjectState): void {
    this.SetEditProjectSettingsEvent.emit(projectItem);
  }

  //  Helpers
}
