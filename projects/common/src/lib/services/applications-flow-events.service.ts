import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Injector } from '@angular/core';
import { LCUServiceSettings, StateContext } from '@lcu/common';
import { Observable, Subject } from 'rxjs';
import {
  ApplicationsFlowState,
  EstablishProjectRequest,
  GitHubLowCodeUnit,
  ProjectState,
} from '../state/applications-flow.state';
import { GitHubWorkflowRun } from '../state/applications-flow.state';

@Injectable({
  providedIn: 'root',
})
export class ApplicationsFlowEventsService {
  //  Fields

  //  Properties
  public DeployRunEvent: EventEmitter<GitHubWorkflowRun>;

  // Constructors
  constructor() {
    this.DeployRunEvent = new EventEmitter();
  }

  // API Methods
  public DeployRun(run: GitHubWorkflowRun): void {
    this.DeployRunEvent.emit(run);
  }

  //  Helpers
}
