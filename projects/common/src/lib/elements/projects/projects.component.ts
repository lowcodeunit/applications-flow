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
import {
  ApplicationsFlowEventsService,
  SaveApplicationAsCodeEventRequest,
  SaveDFSModifierEventRequest,
  SaveEnvironmentAsCodeEventRequest,
} from './../../services/applications-flow-events.service';
import {
  EaCApplicationAsCode,
  EaCEnvironmentAsCode,
  EaCProjectAsCode,
  EnterpriseAsCode,
} from '../../models/eac.models';

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
    return this.projectService.CreatingProject;
  }

  public get EditingProject(): EaCProjectAsCode {
    return this.State?.EaC?.Projects
      ? this.State?.EaC?.Projects[this.EditingProjectLookup]
      : null;
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
    req: SaveApplicationAsCodeEventRequest
  ): Promise<void> {
    const saveEaC: EnterpriseAsCode = {
      EnterpriseLookup: this.State.EaC.EnterpriseLookup,
      Applications: {},
      Projects: {},
    };

    const existingProj = {
      ...this.State.EaC.Projects[req.ProjectLookup],
    };

    if (existingProj.ApplicationLookups?.indexOf(req.ApplicationLookup) < 0) {
      if (!existingProj.ApplicationLookups) {
        existingProj.ApplicationLookups = [];
      }

      existingProj.ApplicationLookups.push(req.ApplicationLookup);

      saveEaC.Projects[req.ProjectLookup] = existingProj;
    }

    if (req.Application) {
      saveEaC.Applications[req.ApplicationLookup] = req.Application;
    }

    await this.projectService.SaveEnterpriseAsCode(this.State, saveEaC);
  }

  protected async handleSaveDFSModifier(
    req: SaveDFSModifierEventRequest
  ): Promise<void> {
    const saveEaC: EnterpriseAsCode = {
      EnterpriseLookup: this.State.EaC.EnterpriseLookup,
      Modifiers: {},
      Projects: {},
    };

    if (req.Modifier) {
      saveEaC.Modifiers[req.ModifierLookup] = req.Modifier;
    }

    if (req.ProjectLookup) {
      saveEaC.Projects[req.ProjectLookup] = {
        ModifierLookups: [req.ModifierLookup],
      };
    }

    await this.projectService.SaveEnterpriseAsCode(this.State, saveEaC);
  }

  protected async handleSaveEnvironment(
    req: SaveEnvironmentAsCodeEventRequest
  ): Promise<void> {
    const saveEaC: EnterpriseAsCode = {
      EnterpriseLookup: this.State.EaC.EnterpriseLookup,
      DataTokens: {},
      Environments: {},
    };

    if (req.Environment) {
      saveEaC.Environments[req.EnvironmentLookup] = req.Environment;
    }

    if (req.EnterpriseDataTokens) {
      saveEaC.DataTokens = req.EnterpriseDataTokens;
    }

    await this.projectService.SaveEnterpriseAsCode(this.State, saveEaC);
  }

  protected async handleSaveProject(
    projectLookup: string,
    project: EaCProjectAsCode
  ): Promise<void> {
    const saveEaC: EnterpriseAsCode = {
      EnterpriseLookup: this.State.EaC.EnterpriseLookup,
      Projects: {},
    };

    saveEaC.Projects[projectLookup] = project;

    await this.projectService.SaveEnterpriseAsCode(this.State, saveEaC);

    this.appsFlowEventsSvc.SetEditProjectSettings(projectLookup);
  }

  protected setServices(): void {
    this.appsFlowEventsSvc.DeleteApplicationEvent.subscribe(
      async (appLookup) => {
        await this.projectService.DeleteApplication(this.State, appLookup);
      }
    );

    this.appsFlowEventsSvc.DeleteDevOpsActionEvent.subscribe(
      async (doaLookup) => {
        await this.projectService.DeleteDevOpsAction(this.State, doaLookup);
      }
    );

    this.appsFlowEventsSvc.DeleteProjectEvent.subscribe(
      async (projectLookup) => {
        await this.projectService.DeleteProject(this.State, projectLookup);
      }
    );

    this.appsFlowEventsSvc.DeleteSourceControlEvent.subscribe(
      async (scLookup) => {
        await this.projectService.DeleteSourceControl(this.State, scLookup);
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
      await this.handleSaveApplication(req);
    });

    this.appsFlowEventsSvc.SaveDFSModifierEvent.subscribe(async (req) => {
      await this.handleSaveDFSModifier(req);
    });

    this.appsFlowEventsSvc.SaveEnvironmentAsCodeEvent.subscribe(async (req) => {
      await this.handleSaveEnvironment(req);
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
            req.ApplicationName
          }' with version '${req.Version}'?`
        )
      ) {
        await this.projectService.UnpackLowCodeUnit(this.State, req);
      }
    });
  }
}
