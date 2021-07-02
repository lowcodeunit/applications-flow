import { 
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  Injector,
   OnDestroy,
   OnInit } from '@angular/core';

import { 
  LcuElementComponent,
  LCUElementContext
} from '@lcu/common';
import { ApplicationsFlowState } from './../../../../../state/applications-flow.state';
import { ApplicationsFlowService } from './../../../../../services/applications-flow.service';

export class ApplicationsFlowProjectsElementState {}

export class ApplicationsFlowProjectsContext extends LCUElementContext<ApplicationsFlowProjectsElementState> {}

@Component({
  selector: 'lcu-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})

export class GeneralComponent
extends LcuElementComponent<ApplicationsFlowProjectsContext>
  implements OnDestroy, OnInit, AfterContentChecked  {

  public State: ApplicationsFlowState;

  constructor(
    protected injector: Injector,
    protected appsFlowSvc: ApplicationsFlowService,
    protected cd: ChangeDetectorRef
  ) {
    super(injector);

    this.State = new ApplicationsFlowState();
  }

  //  Life Cycle
  public ngOnDestroy(): void {}

  public ngOnInit(): void {}

  public ngAfterContentChecked(): void {
    this.cd.detectChanges();
  }
}
