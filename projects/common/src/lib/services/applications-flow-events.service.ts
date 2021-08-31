import { EventEmitter, Injectable, Injector } from '@angular/core';
import { EaCApplicationAsCode, EaCProjectAsCode } from '../models/eac.models';
import { EnterpriseAsCode } from '../models/eac.models';
import { GitHubWorkflowRun, UnpackLowCodeUnitRequest } from '../state/applications-flow.state';

export class SaveApplicationAsCodeEventRequest {
  public Application?: EaCApplicationAsCode;

  public ApplicationLookup?: string;

  public ProjectLookup?: string;
}

export class SaveProjectAsCodeEventRequest {
  public Project?: EaCProjectAsCode;

  public ProjectLookup?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApplicationsFlowEventsService {
  //  Fields

  //  Properties
  public DeleteApplicationEvent: EventEmitter<string>;

  public DeleteProjectEvent: EventEmitter<string>;

  public EnsureUserEnterpriseEvent: EventEmitter<any>;

  // public ListProjectsEvent: EventEmitter<boolean>;

  public LoadEnterpriseAsCodeEvent: EventEmitter<any>;

  public SaveApplicationAsCodeEvent: EventEmitter<SaveApplicationAsCodeEventRequest>;

  public SaveEnterpriseAsCodeEvent: EventEmitter<EnterpriseAsCode>;

  public SaveProjectAsCodeEvent: EventEmitter<SaveProjectAsCodeEventRequest>;

  public SetCreatingProjectEvent: EventEmitter<boolean>;

  public SetEditProjectSettingsEvent: EventEmitter<string>;

  public UnpackLowCodeUnitEvent: EventEmitter<UnpackLowCodeUnitRequest>;

  // Constructors
  constructor() {
    this.DeleteApplicationEvent = new EventEmitter();

    this.DeleteProjectEvent = new EventEmitter();

    this.EnsureUserEnterpriseEvent = new EventEmitter();

    this.LoadEnterpriseAsCodeEvent = new EventEmitter();

    this.SaveApplicationAsCodeEvent = new EventEmitter();

    this.SaveEnterpriseAsCodeEvent = new EventEmitter();

    this.SaveProjectAsCodeEvent = new EventEmitter();

    this.SetCreatingProjectEvent = new EventEmitter();

    this.SetEditProjectSettingsEvent = new EventEmitter();

    this.UnpackLowCodeUnitEvent = new EventEmitter();
  }

  // API Methods
  public DeleteApplication(appLookup: string): void {
    this.DeleteApplicationEvent.emit(appLookup);
  }

  public DeleteProject(projectLookup: string): void {
    this.DeleteProjectEvent.emit(projectLookup);
  }

  public EnsureUserEnterprise(): void {
    this.EnsureUserEnterpriseEvent.emit();
  }

  // public ListProjects(withLoading: boolean): void {
  //   this.ListProjectsEvent.emit(withLoading);
  // }

  public LoadEnterpriseAsCode(): void {
    this.LoadEnterpriseAsCodeEvent.emit();
  }

  public SaveApplicationAsCode(req: SaveApplicationAsCodeEventRequest): void {
    this.SaveApplicationAsCodeEvent.emit(req);
  }

  public SaveEnterpriseAsCode(eac: EnterpriseAsCode): void {
    this.SaveEnterpriseAsCodeEvent.emit(eac);
  }

  public SaveProjectAsCode(req: SaveProjectAsCodeEventRequest): void {
    this.SaveProjectAsCodeEvent.emit(req);
  }

  public SetCreatingProject(creatingProject: boolean): void {
    this.SetCreatingProjectEvent.emit(creatingProject);
  }

  public SetEditProjectSettings(projectLookup: string): void {
    this.SetEditProjectSettingsEvent.emit(projectLookup);
  }

  public UnpackLowCodeUnit(req: UnpackLowCodeUnitRequest): void {
    this.UnpackLowCodeUnitEvent.emit(req);
  }

  //  Helpers
}
