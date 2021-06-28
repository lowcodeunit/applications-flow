import { ApplicationsFlowService } from './../../../../services/applications-flow.service';
import { ProjectService } from './../../../../services/project.service';
import { ApplicationsFlowState, GitHubLowCodeUnit, GitHubWorkflowRun, ProjectState } from './../../../../state/applications-flow.state';
import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'lcu-builds',
  templateUrl: './builds.component.html',
  styleUrls: ['./builds.component.scss']
})
export class BuildsComponent implements OnInit, OnDestroy {

  // @Output('deploy-run')
  // public DeployRunEmitter: EventEmitter<GitHubWorkflowRun>;

  // @Output('retrieve-lcu')
  // public RetrieveLCUEmitter: EventEmitter<{project: ProjectState, lcuID: string}>;

  protected currentSelectedProjectSubscription: Subscription;

  /**
   * List of projects
   */
   private _projects: Array<ProjectState>;
   @Input('projects')
   set Projects(val: Array<ProjectState>) {
 
     if (!val) { return; }
 
     this._projects = val;
 
     // set the initial project, passes data to the build componoent
     // this.CurrentProject(val[0]);
   }
 
   get Projects(): Array<ProjectState> {
     return this._projects;
   }

  public State: ApplicationsFlowState;

  protected stateChangeSubscription: Subscription;

  constructor(protected projectService: ProjectService, protected appsFlowSvc: ApplicationsFlowService) {

    // this.DeployRunEmitter = new EventEmitter();
    // this.RetrieveLCUEmitter = new EventEmitter();

    this.stateChangeSubscription = this.appsFlowSvc.StateChanged
    .subscribe((state: ApplicationsFlowState) => {
     this.State = state;
    });

    // this.currentSelectedProjectSubscription = projectService.CurrentSelectedProject
    // .subscribe((val: ProjectState) => {
    //   this.Project = val;
    // });
  }

  public ngOnInit(): void {
  }

  public ngOnDestroy(): void {
    this.currentSelectedProjectSubscription.unsubscribe();
  }

  public DeployRun(lastrun: GitHubWorkflowRun): void {
    // this.DeployRunEmitter.emit(lastrun);
    this.projectService.DeployRun(this.State, lastrun);
  }

  public RetrieveLCU(val: {project: ProjectState, lcuID: string}): GitHubLowCodeUnit {
    // this.RetrieveLCUEmitter.emit(lcu);
    return val.project.LCUs.find((lcu) => lcu.ID === val.lcuID);
  }
}
