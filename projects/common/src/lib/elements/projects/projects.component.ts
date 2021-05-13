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
  protected DeployRun(run: GitHubWorkflowRun) {
    this.State.Loading = true;

    this.appsFlowSvc.DeployRun(run).subscribe((response: BaseResponse) => {
      if (response.Status.Code === 0) {
        this.listProjects();
      } else {
        this.State.Loading = false;
      }
    });
  }

  protected ToggleCreateProject() {
    this.CreatingProject = !this.CreatingProject;
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
        this.State.Projects = response.Model;

        if (withLoading) {
          this.State.Loading = false;
        }

        this.CreatingProject = !this.State.Projects || this.State.Projects.length <= 0;

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
