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
import { ApplicationsFlowState } from './../../state/applications-flow.state';
import { ApplicationsFlowService } from '../../services/applications-flow.service';
import { ProjectService } from '../../services/project.service';
import { Subscription } from 'rxjs';
import { ApplicationsFlowEventsService } from './../../services/applications-flow-events.service';
import {
  EaCApplicationAsCode,
  EaCProjectAsCode,
} from '../../models/eac.models';
import { EnterpriseAsCode } from '../../models/eac.models';

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
  public get CreatingProject(): boolean {
    return this.projectService.CreatingProject;
  }

  public get EditingProject(): EaCProjectAsCode {
    return this.State?.EaC?.Projects[this.EditingProjectLookup];
  }

  public get EditingProjectLookup(): string {
    return this.projectService.EditingProjectLookup;
  }

  public get ProjectLookups(): Array<string> {
    return Object.keys(this.State?.EaC?.Projects || {});
  }

  public State: ApplicationsFlowState;

  //  Constructors
  constructor(
    protected injector: Injector,
    protected appsFlowSvc: ApplicationsFlowService,
    protected projectService: ProjectService,
    protected appsFlowEventsSvc: ApplicationsFlowEventsService
  ) {
    super(injector);

    this.State = new ApplicationsFlowState();

    this.setServices();
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
    await this.projectService.SetActiveEnterprise(this.State, event.value);
  }

  public ConfigureDevOpsAction(devOpsActionLookup: string): void {
    this.State.Loading = true;

    this.appsFlowSvc
      .ConfigureDevOpsAction(devOpsActionLookup)
      .subscribe((response: BaseResponse) => {
        if (response.Status.Code === 0) {
          this.projectService.LoadEnterpriseAsCode(this.State);
        } else {
          this.State.Loading = false;
        }
      });
  }

  //  Helpers
  protected async handleStateChange(): Promise<void> {
    this.State.Loading = true;

    await this.projectService.HasValidConnection(this.State);

    await this.projectService.ListEnterprises(this.State);

    if (this.State.Enterprises?.length > 0) {
      await this.projectService.GetActiveEnterprise(this.State);
    }
  }

  protected async handleSaveApplication(
    projectLookup: string,
    appLookup: string,
    application: EaCApplicationAsCode
  ): Promise<void> {
    const existingProj = this.State.EaC.Projects[projectLookup];

    if (!existingProj.ApplicationLookups) {
      existingProj.ApplicationLookups = [];
    }

    existingProj.ApplicationLookups.push(appLookup);

    if (!this.State.EaC.Applications) {
      this.State.EaC.Applications = {};
    }

    this.State.EaC.Applications[appLookup] = application;

    await this.projectService.SaveEnterpriseAsCode(this.State, this.State.EaC);

    await this.projectService.UnpackLowCodeUnit(this.State, {
      ApplicationLookup: appLookup,
      Version: application.Processor?.LowCodeUnit?.Version,
    });
  }

  protected async handleSaveProject(
    projectLookup: string,
    project: EaCProjectAsCode
  ): Promise<void> {
    this.State.EaC.Hosts = [...(this.State.EaC.Hosts || []), ...project.Hosts];

    if (!this.State.EaC.Projects) {
      this.State.EaC.Projects = {};
    }

    this.State.EaC.Projects[projectLookup] = project;

    await this.projectService.SaveEnterpriseAsCode(this.State, this.State.EaC);

    this.appsFlowEventsSvc.SetEditProjectSettings(projectLookup);
  }

  protected setServices(): void {
    this.appsFlowEventsSvc.DeleteApplicationEvent.subscribe(
      async (appLookup) => {
        await this.projectService.DeleteApplication(this.State, appLookup);
      }
    );

    this.appsFlowEventsSvc.DeleteProjectEvent.subscribe(
      async (projectLookup) => {
        await this.projectService.DeleteProject(this.State, projectLookup);
      }
    );

    this.appsFlowEventsSvc.EnsureUserEnterpriseEvent.subscribe(async () => {
      await this.projectService.EnsureUserEnterprise(this.State);
    });

    // this.appsFlowEventsSvc.ListProjectsEvent.subscribe((withLoading) => {
    //   this.projectService.ListProjects(this.State, withLoading);
    // });

    this.appsFlowEventsSvc.LoadEnterpriseAsCodeEvent.subscribe(async () => {
      await this.projectService.LoadEnterpriseAsCode(this.State);
    });

    this.appsFlowEventsSvc.SaveEnterpriseAsCodeEvent.subscribe(async (eac) => {
      await this.projectService.SaveEnterpriseAsCode(this.State, eac);
    });

    this.appsFlowEventsSvc.SaveApplicationAsCodeEvent.subscribe(async (req) => {
      await this.handleSaveApplication(
        req.ProjectLookup,
        req.ApplicationLookup,
        req.Application
      );
    });

    this.appsFlowEventsSvc.SaveProjectAsCodeEvent.subscribe(async (req) => {
      await this.handleSaveProject(req.ProjectLookup, req.Project);
    });

    this.appsFlowEventsSvc.SetCreatingProjectEvent.subscribe(
      (creatingProject) => {
        this.projectService.SetCreatingProject(creatingProject);
      }
    );

    this.appsFlowEventsSvc.SetEditProjectSettingsEvent.subscribe(
      async (projectLookup) => {
        await this.projectService.SetEditProjectSettings(
          this.State,
          projectLookup
        );
      }
    );

    this.appsFlowEventsSvc.UnpackLowCodeUnitEvent.subscribe(async (req) => {
      if (
        confirm(
          `Are you sure you want to unpack application '${
            req.ApplicationLookup
          }' with version '${req.Version || 'latest'}'?`
        )
      ) {
        await this.projectService.UnpackLowCodeUnit(this.State, req);
      }
    });
  }
}
