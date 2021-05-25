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
  protected projMon: NodeJS.Timeout;

  //  Properties
  public CreatingProject: boolean;

  public EditingProjectSettings: ProjectState;

  public State: ApplicationsFlowState;

  //  Constructors
  constructor(
    protected injector: Injector,
    protected appsFlowSvc: ApplicationsFlowService
  ) {
    super(injector);

    this.State = new ApplicationsFlowState();
  }

  //  Life Cycle
  public ngOnDestroy() {
    this.teardownProjectMonitor();
  }

  public ngOnInit() {
    super.ngOnInit();

    this.handleStateChange();

    this.setupProjectMonitor();
  }

  //  API Methods
  public ConfigureGitHubLCUDevOps(projectId: string, lcu: GitHubLowCodeUnit) {
    this.State.Loading = true;

    this.appsFlowSvc
      .ConfigureGitHubLCUDevOps(projectId, lcu)
      .subscribe((response: BaseResponse) => {
        if (response.Status.Code === 0) {
          this.listProjects(true);
        } else {
          this.State.Loading = false;
        }
      });
  }

  public DeployRun(run: GitHubWorkflowRun) {
    this.State.Loading = true;

    this.appsFlowSvc.DeployRun(run).subscribe((response: BaseResponse) => {
      if (response.Status.Code === 0) {
        this.listProjects();
      } else {
        this.State.Loading = false;
      }
    });
  }

  public HasDevOpsConfigured(project: ProjectState, lcuId: string) {
    const run = project.Runs.find((r) => r.LCUID === lcuId);

    return !!run;
  }

  public RetrieveLCU(project: ProjectState, lcuId: string) {
    return project.LCUs.find((lcu) => lcu.ID === lcuId);
  }

  public SaveProject(project: ProjectState) {
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

  protected SetEditProjectSettings(project: ProjectState) {
    if (project != null) {
      this.State.Loading = true;

      this.appsFlowSvc
        .IsolateHostDNSInstance()
        .subscribe((response: BaseModeledResponse<string>) => {
          this.EditingProjectSettings = project;

          this.CreatingProject = false;

          this.State.HostDNSInstance = response.Model;

          this.State.Loading = false;
        });
    } else {
      this.EditingProjectSettings = project;

      this.CreatingProject = false;
    }
  }

  protected ToggleCreateProject() {
    this.CreatingProject = !this.CreatingProject;

    this.EditingProjectSettings = null;
  }

  //  Helpers
  protected handleStateChange() {
    this.State.Loading = true;

    this.listProjects();
  }

  protected listProjects(withLoading: boolean = true) {
    if (withLoading) {
      this.State.Loading = true;
    }

    this.appsFlowSvc
      .ListProjects()
      .subscribe((response: BaseModeledResponse<ProjectState[]>) => {
        if (response.Status.Code === 0) {
          this.State.Projects = response.Model;
        } else if (response.Status.Code === 3) {
        }

        if (withLoading) {
          this.State.Loading = false;
        }

        this.CreatingProject =
          !this.State.Projects || this.State.Projects.length <= 0;

        console.log(this.State);
      });
  }

  protected setupProjectMonitor() {
    this.projMon = setInterval(() => {
      this.listProjects(false);
    }, 15000);
  }

  protected teardownProjectMonitor() {
    clearInterval(this.projMon);
  }
}
