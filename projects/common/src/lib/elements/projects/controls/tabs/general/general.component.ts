import { FormGroup } from '@angular/forms';
import { FormsService } from './../../../../../services/forms.service';
import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  Injector,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';

import { LcuElementComponent, LCUElementContext } from '@lcu/common';
import { ProjectState } from './../../../../../state/applications-flow.state';
import { ApplicationsFlowService } from './../../../../../services/applications-flow.service';

export class ApplicationsFlowProjectsElementState {}

export class ApplicationsFlowProjectsContext extends LCUElementContext<ApplicationsFlowProjectsElementState> {}

@Component({
  selector: 'lcu-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss'],
})
export class GeneralComponent
  extends LcuElementComponent<ApplicationsFlowProjectsContext>
  implements OnDestroy, OnInit, AfterContentChecked
{
  @Input('data')
  public Data: { Project: ProjectState };

  public get Project(): ProjectState {
    return this.Data.Project;
  }

  constructor(
    protected injector: Injector,
    protected appsFlowSvc: ApplicationsFlowService,
    protected cd: ChangeDetectorRef,
    protected formsService: FormsService
  ) {
    super(injector);
  }

  //  Life Cycle
  public ngOnDestroy(): void {}

  public ngOnInit(): void {

  }

  public ngAfterContentChecked(): void {
    this.cd.detectChanges();
  }
}
