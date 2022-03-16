import {
  GitHubWorkflowRun,
} from './../../../../state/applications-flow.state';
import {
  Component,
  Input,
  OnInit,
  OnDestroy
} from '@angular/core';
import { EaCLowCodeUnit, EaCProjectAsCode } from '@semanticjs/common';

@Component({
  selector: 'lcu-builds',
  templateUrl: './builds.component.html',
  styleUrls: ['./builds.component.scss'],
})
export class BuildsComponent implements OnInit, OnDestroy {
  //  Fields

  //  Properties
  @Input('projects')
  public Projects: Array<EaCProjectAsCode>;

  constructor() {}

  public ngOnInit(): void {}

  public ngOnDestroy(): void {
  }

  public DeployRun(lastrun: GitHubWorkflowRun): void {
    // this.appsFlowEventsSvc.DeployRun(lastrun);
  }

  public RetrieveLCU(val: {
    project: EaCProjectAsCode;
    lcuID: string;
  }): EaCLowCodeUnit {
    // this.RetrieveLCUEmitter.emit(lcu);
    return {};//val.project.LCUs.find((lcu) => lcu.ID === val.lcuID);
  }
}
