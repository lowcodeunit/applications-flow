
import { Injectable } from '@angular/core';
import {
  ApplicationsFlowEventsService,
  SaveApplicationAsCodeEventRequest,
  SaveDFSModifierEventRequest,
  SaveEnvironmentAsCodeEventRequest,
  SaveProjectAsCodeEventRequest,
} from './applications-flow-events.service';
import { ProjectService } from './project.service';
import {
  ApplicationsFlowState,
  UnpackLowCodeUnitRequest,
} from '../state/applications-flow.state';
import {
  EaCHost,
  EaCProjectAsCode,
  EnterpriseAsCode,
} from '@semanticjs/common';

@Injectable({
  providedIn: 'root',
})
export class EaCService {
  //  Properties
  public State: ApplicationsFlowState;

  //  Constructors
  constructor(
    protected appsFlowEventsSvc: ApplicationsFlowEventsService,
    protected projectService: ProjectService
  ) {
    this.State = new ApplicationsFlowState();

    this.setServices();
  }

  //  API Methods
  public async DeleteApplication(
    appLookup: string,
    appName: string
  ): Promise<void> {
    if (confirm(`Are you sure you want to delete application '${appName}'?`)) {
      await this.projectService.DeleteApplication(this.State, appLookup);
    }
  }

  public async DeleteDevOpsAction(doaLookup: string): Promise<void> {
    if (confirm(`Are you sure you want to delete DevOps action '${doaLookup}'?`)) {

      await this.projectService.DeleteDevOpsAction(this.State, doaLookup);
    }
  }

  public async DeleteProject(projectLookup: string): Promise<void> {
    if (confirm(`Are you sure you want to delete Project '${projectLookup}'?`)) {

      await this.projectService.DeleteProject(this.State, projectLookup);
    }
  }

  public async DeleteSourceControl(scLookup: string): Promise<void> {
    if (confirm(`Are you sure you want to delete Source Control '${scLookup}'?`)) {

      await this.projectService.DeleteSourceControl(this.State, scLookup);
    }
  }

  // this.appsFlowEventsSvc.EnsureUserEnterpriseEvent.subscribe(async () => {
  //   await this.projectService.EnsureUserEnterprise(this.State);
  // });
  

  public async EnsureUserEnterprise(
    appLookup: string,
    appName: string
  ): Promise<void> {
    await this.projectService.EnsureUserEnterprise(this.State);
  }

  public async LoadEnterpriseAsCode(): Promise<void>{
    await this.projectService.LoadEnterpriseAsCode(this.State);
  }

  public async SaveApplicationAsCode(
    req: SaveApplicationAsCodeEventRequest
  ): Promise<void> {
    await this.handleSaveApplication(req);
  }

  public async SaveDFSModifierEvent(req: SaveDFSModifierEventRequest): Promise<void> {
    await this.handleSaveDFSModifier(req);
  }

  public async SaveEnterpriseAsCode(eac: EnterpriseAsCode): Promise<void>  {
    await this.projectService.SaveEnterpriseAsCode(this.State, eac);
  }

  public async SaveEnvironmentAsCode(req: SaveEnvironmentAsCodeEventRequest): Promise<void>{
    await this.handleSaveEnvironment(req);
  }

  public async  SaveProjectAsCode(req: SaveProjectAsCodeEventRequest): Promise<void>{
    await this.handleSaveProject(req.ProjectLookup, req.Project);
  }

  public async SetCreatingProject(creatingProject: boolean): Promise<void>{
      this.projectService.SetCreatingProject(creatingProject);
  }

  public async SetEditProjectSettings(projectLookup: string): Promise<void>{
      await this.projectService.SetEditProjectSettings(
        this.State,
        projectLookup
      );
  }

  public async UnpackLowCodeUnit(req: UnpackLowCodeUnitRequest): Promise<void> {
    if (
      confirm(
        `Are you sure you want to unpack application '${req.ApplicationName}' with version '${req.Version}'?`
      )
    ) {
      await this.projectService.UnpackLowCodeUnit(this.State, req);
    }
  }

  protected setServices(): void {
    
    // this.appsFlowEventsSvc.ListProjectsEvent.subscribe((withLoading) => {
    //   this.projectService.ListProjects(this.State, withLoading);
    // });
  }

  //  Helpers
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
    const projHosts: { [lookup: string]: EaCHost } = {};

    project?.Hosts?.forEach((host) => {
      projHosts[host] = this.State.EaC.Hosts[host];
    });

    const saveEaC: EnterpriseAsCode = {
      EnterpriseLookup: this.State.EaC.EnterpriseLookup,
      Enterprise: {
        ...this.State.EaC.Enterprise,
        PrimaryHost: project.Hosts[0],
      },
      Hosts: projHosts,
      // Providers: this.State.EaC.Providers,  //  TODO:  Remove after all providers ADB2C's have been upgraded
      Projects: {},
    };

    saveEaC.Projects[projectLookup] = project;

    await this.projectService.SaveEnterpriseAsCode(this.State, saveEaC);

    this.appsFlowEventsSvc.SetEditProjectSettings(projectLookup);
  }
}
