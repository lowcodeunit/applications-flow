import { ProjectService } from './../../../../services/project.service';
import { GitHubLowCodeUnit, GitHubWorkflowRun, ProjectState } from './../../../../state/applications-flow.state';
import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'lcu-builds',
  templateUrl: './builds.component.html',
  styleUrls: ['./builds.component.scss']
})
export class BuildsComponent implements OnInit, OnDestroy {

  @Output('deploy-run')
  public DeployRunEmitter: EventEmitter<GitHubWorkflowRun>;

  // @Output('retrieve-lcu')
  // public RetrieveLCUEmitter: EventEmitter<{project: ProjectState, lcuID: string}>;

  protected currentSelectedProjectSubscription: Subscription;

  /**
   * Current selected project from the project's list
   */
  public Project: ProjectState;

  constructor(protected projectService: ProjectService) {

    this.DeployRunEmitter = new EventEmitter();
    // this.RetrieveLCUEmitter = new EventEmitter();

    this.currentSelectedProjectSubscription = projectService.CurrentSelectedProject
    .subscribe((val: ProjectState) => {
      this.Project = val;
    });
  }

  public ngOnInit(): void {
  }

  public ngOnDestroy(): void {
    this.currentSelectedProjectSubscription.unsubscribe();
  }

  public DeployRun(lastrun: GitHubWorkflowRun): void {
    this.DeployRunEmitter.emit(lastrun);
  }

  public RetrieveLCU(val: {project: ProjectState, lcuID: string}): GitHubLowCodeUnit {
    // this.RetrieveLCUEmitter.emit(lcu);
    return val.project.LCUs.find((lcu) => lcu.ID === val.lcuID);
  }
}
