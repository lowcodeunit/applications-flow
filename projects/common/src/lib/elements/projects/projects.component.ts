import {
  Component,
  OnInit,
  Injector,
  
  OnDestroy,
} from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import {
  LCUElementContext,
  LcuElementComponent,
  BaseResponse,
} from '@lcu/common';
import { ApplicationsFlowState } from './../../state/applications-flow.state';
import { ApplicationsFlowService } from '../../services/applications-flow.service';
import {
  EaCEnvironmentAsCode,
  EaCProjectAsCode,
} from '@semanticjs/common';
import { EaCService } from '../../services/eac.service';

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
  public get ActiveEnvironment(): EaCEnvironmentAsCode {
    return this.State?.EaC?.Environments[this.ActiveEnvironmentLookup];
  }

  public get ActiveEnvironmentLookup(): string {
    //  TODO:  Eventually support multiple environments
    const envLookups = Object.keys(this.State?.EaC?.Environments || {});

    return envLookups[0];
  }

  public get CreatingProject(): boolean {
    return this.eacSvc.CreatingProject;
  }

  public get EditingProject(): EaCProjectAsCode {
    return this.State?.EaC?.Projects
      ? this.State?.EaC?.Projects[this.EditingProjectLookup]
      : null;
  }

  public get EditingProjectLookup(): string {
    return this.eacSvc.EditingProjectLookup;
  }

  public get ProjectLookups(): Array<string> {
    return Object.keys(this.State?.EaC?.Projects || {});
  }

  public get State(): ApplicationsFlowState {
    return this.eacSvc.State;
  }

  //  Constructors
  constructor(
    protected injector: Injector,
    protected appsFlowSvc: ApplicationsFlowService,
    protected eacSvc: EaCService
  ) {
    super(injector);
  }

  //  Life Cycle
  public ngOnDestroy(): void {}

  public ngOnInit(): void {
    super.ngOnInit();

    this.handleStateChange().then((eac) => {});

    // this.setupProjectMonitor();
  }

  //  API Methods
  public async ActiveEnterpriseChanged(event: MatSelectChange): Promise<void> {
    await this.eacSvc.SetActiveEnterprise(event.value);
  }

  public ConfigureDevOpsAction(devOpsActionLookup: string): void {
    this.State.Loading = true;

    this.appsFlowSvc
      .ConfigureDevOpsAction(devOpsActionLookup)
      .subscribe((response: BaseResponse) => {
        if (response.Status.Code === 0) {
          this.eacSvc.LoadEnterpriseAsCode();
        } else {
          this.State.Loading = false;
        }
      });
  }

  //  Helpers
  protected async handleStateChange(): Promise<void> {
    this.State.Loading = true;

    await this.eacSvc.HasValidConnection();

    await this.eacSvc.EnsureUserEnterprise();

    await this.eacSvc.ListEnterprises();

    if (this.State.Enterprises?.length > 0) {
      await this.eacSvc.GetActiveEnterprise();
    }
  }
}
