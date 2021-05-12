import {
  Component,
  OnInit,
  Injector,
  ViewChild,
  Inject,
  AfterViewInit,
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
  implements OnInit
{
  //  Fields

  //  Properties
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
  public ngOnInit() {
    super.ngOnInit();

    this.handleStateChange();
  }

  //  API Methods

  //  Helpers
  protected handleStateChange() {
    this.State.Loading = true;

    this.listProjects();
  }

  protected listProjects() {
    this.State.Loading = true;

    this.appsFlowSvc
      .ListProjects()
      .subscribe((response: BaseModeledResponse<ProjectState[]>) => {
        this.State.Projects = response.Model;

        this.State.Loading = false;

        console.log(this.State);
      });
  }
}
