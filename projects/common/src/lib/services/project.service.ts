import { Injectable } from '@angular/core';
import { BaseModeledResponse, BaseResponse } from '@lcu/common';
import { Subject, Subscription } from 'rxjs';
import { ProjectItemModel } from '../models/project-item.model';
import { ApplicationsFlowState, GitHubWorkflowRun, ProjectState } from '../state/applications-flow.state';
import { ApplicationsFlowService } from './applications-flow.service';

@Injectable({
    providedIn: 'root',
  })


  export class ProjectService {

    public CreatingProject: boolean;

    public CurrentSelectedProject: Subject<ProjectState>;

    /**
     * Subject for editing project settings
     */
    public SetEditProjectSettings: Subject<ProjectItemModel>;

    constructor(protected appsFlowSvc: ApplicationsFlowService) {
        this.SetEditProjectSettings = new Subject<ProjectItemModel>();
        this.CurrentSelectedProject = new Subject<ProjectState>();
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

    public ListProjects(state: ApplicationsFlowState, withLoading: boolean = true): void {
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
  
          this.CreatingProject =
            !state.Projects || state.Projects.length <= 0;
  
          this.appsFlowSvc.UpdateState(state);
          console.log(state);
        });
    }
  }
