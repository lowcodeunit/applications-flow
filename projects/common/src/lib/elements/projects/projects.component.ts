import {
  Component,
  OnInit,
  Injector,
  ViewChild,
  Inject,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { MatStepper } from '@angular/material/stepper';
import {
  LCUElementContext,
  LcuElementComponent,
  BaseResponse,
  BaseModeledResponse,
} from '@lcu/common';
import {
  ApplicationsFlowState,
  EstablishProjectRequest,
  GitHubBranch,
  GitHubLowCodeUnit,
  GitHubOrganization,
  GitHubRepository,
  GitHubWorkflowRun,
  ProjectHostingDetails,
  ProjectHostingOption,
  ProjectState,
} from './../../state/applications-flow.state';
import { ApplicationsFlowService } from '../../services/applications-flow.service';
import { ProjectService } from '../../services/project.service';
import { Subscription } from 'rxjs';
import { ProjectItemModel } from '../../models/project-item.model';

declare var window: Window;

export class ApplicationsFlowProjectsElementState {}

export class ApplicationsFlowProjectsContext extends LCUElementContext<ApplicationsFlowProjectsElementState> {}

export const SELECTOR_APPLICATIONS_FLOW_PROJECTS_ELEMENT =
  'applications-flow-projects-element';

@Component({
  selector: SELECTOR_APPLICATIONS_FLOW_PROJECTS_ELEMENT,
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ApplicationsFlowProjectsElementComponent
  extends LcuElementComponent<ApplicationsFlowProjectsContext>
  implements OnDestroy, OnInit
{
  //  Fields
  /**
   * Subscription for editing project settings
   */
  protected editProjectSettingsSubscription: Subscription;

  protected projMon: NodeJS.Timeout;

  //  Properties
  public get CreatingProject(): boolean {
    return this.projectService.CreatingProject;
  }

  public EditingProjectSettings: ProjectState;

  public State: ApplicationsFlowState;

  //  Constructors
  constructor(
    protected injector: Injector,
    protected appsFlowSvc: ApplicationsFlowService,
    protected projectService: ProjectService
  ) {
    super(injector);

    this.State = new ApplicationsFlowState();

    this.setServices();
  }

  //  Life Cycle
  public ngOnDestroy(): void {
    this.teardownProjectMonitor();
  }

  public ngOnInit(): void {
    super.ngOnInit();

    this.handleStateChange();

    this.setupProjectMonitor();
  }

  //  API Methods
  public ConfigureGitHubLCUDevOps(
    projectId: string,
    lcu: GitHubLowCodeUnit
  ): void {
    this.State.Loading = true;

    this.appsFlowSvc
      .ConfigureGitHubLCUDevOps(projectId, lcu)
      .subscribe((response: BaseResponse) => {
        if (response.Status.Code === 0) {
          this.projectService.ListProjects(this.State, true);
        } else {
          this.State.Loading = false;
        }
      });
  }

  // public DeployRun(run: GitHubWorkflowRun): void {

  //   this.State.Loading = true;

  //   this.appsFlowSvc.DeployRun(run).subscribe((response: BaseResponse) => {
  //     if (response.Status.Code === 0) {
  //       this.listProjects();
  //     } else {
  //       this.State.Loading = false;
  //     }
  //   });
  // }

  public HasDevOpsConfigured(val: {
    project: ProjectState;
    lcuID: string;
  }): boolean {
    const run = val.project.Runs.find((r) => r.LCUID === val.lcuID);

    return !!run;
  }

  // project: ProjectState, lcuId: string
  // public RetrieveLCU(val: {project: ProjectState, lcuID: string}): GitHubLowCodeUnit {
  //   return val.project.LCUs.find((lcu) => lcu.ID === val.lcuID);
  // }

  public SaveProject(project: ProjectState): void {
    this.State.Loading = true;

    this.appsFlowSvc
      .SaveProject(project, this.State.HostDNSInstance)
      .subscribe((response: BaseResponse) => {
        if (response.Status.Code === 0) {
          window.location.href = window.location.href;
        } else {
          this.State.Loading = false;
        }

        console.log(response);
      });
  }

  public SetEditProjectSettings(project: ProjectState): void {
    if (project != null) {
      this.State.Loading = true;

      this.appsFlowSvc
        .IsolateHostDNSInstance()
        .subscribe((response: BaseModeledResponse<string>) => {
          this.EditingProjectSettings = project;

          this.projectService.CreatingProject = false;

          this.State.HostDNSInstance = response.Model;

          this.State.Loading = false;
        });
    } else {
      this.EditingProjectSettings = project;

      this.projectService.CreatingProject = false;
    }
  }

  public ToggleCreateProject(): void {
    this.projectService.CreatingProject = !this.projectService.CreatingProject;

    this.EditingProjectSettings = null;
  }

  //  Helpers
  protected handleStateChange(): void {
    this.State.Loading = true;

    this.projectService.ListProjects(this.State);
  }

  // protected listProjects(withLoading: boolean = true): void {
  //   if (withLoading) {
  //     this.State.Loading = true;
  //   }

  //   this.appsFlowSvc
  //     .ListProjects()
  //     .subscribe((response: BaseModeledResponse<ProjectState[]>) => {
  //       if (response.Status.Code === 0) {
  //         this.State.Projects = response.Model;
  //       } else if (response.Status.Code === 3) {
  //       }

  //       if (withLoading) {
  //         this.State.Loading = false;
  //       }

  //       this.CreatingProject =
  //         !this.State.Projects || this.State.Projects.length <= 0;

  //       this.appsFlowSvc.UpdateState(this.State);
  //       console.log(this.State);
  //     });
  // }

  /**
   * Setup any service subscriptions
   */
  protected setServices(): void {
    // listen to edit project settings subject change
    this.editProjectSettingsSubscription =
      this.projectService.SetEditProjectSettings.subscribe(
        (project: ProjectItemModel) => {
          this.SetEditProjectSettings(project);
        }
      );
  }

  protected setupProjectMonitor(): void {
    this.projMon = setInterval(() => {
      this.projectService.ListProjects(this.State, false);
    }, 60000);
  }

  protected teardownProjectMonitor(): void {
    clearInterval(this.projMon);
  }
}
