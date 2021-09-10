import { ApplicationsFlowService } from './../../../../services/applications-flow.service';
import { ProjectService } from './../../../../services/project.service';
import {
  GitHubWorkflowRun,
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
import { EaCLowCodeUnit, EaCProjectAsCode } from '../../../../models/eac.models';

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

  constructor(protected appsFlowEventsSvc: ApplicationsFlowEventsService) {}

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
