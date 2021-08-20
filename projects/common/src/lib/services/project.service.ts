import { Injectable } from '@angular/core';
import { BaseModeledResponse, BaseResponse } from '@lcu/common';
import { debug } from 'console';
import {
  ApplicationsFlowState,
  EstablishProjectRequest,
  GitHubWorkflowRun,
  ProjectState,
} from '../state/applications-flow.state';
import { ApplicationsFlowService } from './applications-flow.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  public CreatingProject: boolean;

  public EditingProjectID: string;

  constructor(protected appsFlowSvc: ApplicationsFlowService) {}

  public EnsureUserEnterprise(
    state: ApplicationsFlowState
  ): void {
    state.Loading = true;

    this.appsFlowSvc
      .EnsureUserEnterprise()
      .subscribe((response: BaseResponse) => {
        if (response.Status.Code === 0) {
          this.ListProjects(state, true);
        } else {
          state.Loading = false;
        }

        console.log(response);
      });
  }

  // public CreateRepository(state: ApplicationsFlowState, org: string, repoName: string): void {
  //   state.GitHub.Loading = true;

  //   this.appsFlowSvc
  //     .CreateRepository(org, repoName)
  //     .subscribe((response: BaseResponse) => {
  //       if (response.Status.Code === 0) {
  //         this.listRepositories(repoName);

  //         state.GitHub.CreatingRepository = false;
  //       } else {
  //         //  TODO:  Need to surface an error to the user...

  //         state.GitHub.Loading = false;
  //       }
  //     });
  // }

  public DeleteProject(state: ApplicationsFlowState, projectId: string): void {
    state.Loading = true;

    this.appsFlowSvc
      .DeleteProject(projectId)
      .subscribe((response: BaseResponse) => {
        if (response.Status.Code === 0) {
          this.ListProjects(state);
        } else {
          state.Loading = false;
        }
      });
  }

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

  public HasValidConnection(state: ApplicationsFlowState): void {
    state.Loading = true;

    this.appsFlowSvc
      .HasValidConnection()
      .subscribe((response: BaseResponse) => {
        state.GitHub.HasConnection = response.Status.Code === 0;

        if (state.GitHub.HasConnection) {
          this.EnsureUserEnterprise(state);
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

  public SaveProject(
    state: ApplicationsFlowState,
    project: ProjectState
  ): void {
    state.Loading = true;

    this.appsFlowSvc
      .SaveProject(project, state.HostDNSInstance)
      .subscribe((response: BaseModeledResponse<string>) => {
        if (response.Status.Code === 0) {
          this.ListProjects(state, true);
        } else {
          state.Loading = false;
        }

        console.log(response);
      });
  }

  public SetCreatingProject(creatingProject: boolean): void {
    this.CreatingProject = creatingProject;

    this.EditingProjectID = null;
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
          this.EditingProjectID = project.ID;

          this.CreatingProject = false;

          state.HostDNSInstance = response.Model;

          state.Loading = false;

          console.log(state);
        });
    } else {
      this.EditingProjectID = project.ID;

      this.CreatingProject = false;
    }
  }

  public ToggleCreateProject(): void {
    this.SetCreatingProject(!this.CreatingProject);
  }
}
