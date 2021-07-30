import { ApplicationsFlowService } from './../../../../services/applications-flow.service';
import { ProjectService } from './../../../../services/project.service';
import {
  ApplicationsFlowState,
  GitHubLowCodeUnit,
  GitHubWorkflowRun,
  ProjectState,
} from './../../../../state/applications-flow.state';
import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ApplicationsFlowEventsService } from './../../../../services/applications-flow-events.service';

@Component({
  selector: 'lcu-builds',
  templateUrl: './builds.component.html',
  styleUrls: ['./builds.component.scss'],
})
export class BuildsComponent implements OnInit, OnDestroy {
  //  Fields

  //  Properties
  /**
   * List of projects
   */
  private _projects: Array<ProjectState>;
  @Input('projects')
  public set Projects(val: Array<ProjectState>) {
    this._projects = val;
  }

  public get Projects(): Array<ProjectState> {
    return this._projects;
  }

  constructor(protected appsFlowEventsSvc: ApplicationsFlowEventsService) {}

  public ngOnInit(): void {}

  public ngOnDestroy(): void {
  }

  public DeployRun(lastrun: GitHubWorkflowRun): void {
    this.appsFlowEventsSvc.DeployRun(lastrun);
  }

  public RetrieveLCU(val: {
    project: ProjectState;
    lcuID: string;
  }): GitHubLowCodeUnit {
    // this.RetrieveLCUEmitter.emit(lcu);
    return val.project.LCUs.find((lcu) => lcu.ID === val.lcuID);
  }
}
