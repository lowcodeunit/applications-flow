import { Injectable } from '@angular/core';
import { BaseModeledResponse, BaseResponse } from '@lcu/common';
import {
  ApplicationsFlowState,
  GitHubWorkflowRun,
  ProjectState,
} from '../state/applications-flow.state';
import { ApplicationsFlowService } from './applications-flow.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  public CreatingProject: boolean;

  public EditingProjectSettings: ProjectState;

  constructor(protected appsFlowSvc: ApplicationsFlowService) {}

  public DeployRun(state: ApplicationsFlowState, run: GitHubWorkflowRun): void {
    state.Loading = true;

    this.appsFlowSvc.DeployRun(run).subscribe((response: BaseResponse) => {
      if (response.Status.Code === 0) {
        this.ListProjects(state);
      } else {
        state.Loading = false;
      }
    });
  }

  public ListProjects(
    state: ApplicationsFlowState,
    withLoading: boolean = true
  ): void {
    if (withLoading) {
      state.Loading = true;
    }

    this.appsFlowSvc
      .ListProjects()
      .subscribe((response: BaseModeledResponse<ProjectState[]>) => {
        if (response.Status.Code === 0) {
          state.Projects = response.Model;
        } else if (response.Status.Code === 3) {
        }

        if (withLoading) {
          state.Loading = false;
        }

        this.CreatingProject = !state.Projects || state.Projects.length <= 0;
        console.log(state);
      });
  }

  public SetEditProjectSettings(
    state: ApplicationsFlowState,
    project: ProjectState
  ): void {
    if (project != null) {
      state.Loading = true;

      this.appsFlowSvc
        .IsolateHostDNSInstance()
        .subscribe((response: BaseModeledResponse<string>) => {
          this.EditingProjectSettings = project;

          this.CreatingProject = false;

          state.HostDNSInstance = response.Model;

          state.Loading = false;
        });
    } else {
      this.EditingProjectSettings = project;

      this.CreatingProject = false;
    }
  }

  public ToggleCreateProject(): void {
    this.CreatingProject = !this.CreatingProject;

    this.EditingProjectSettings = null;
  }
}
