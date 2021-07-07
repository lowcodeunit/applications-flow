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
import {
  ApplicationsFlowState,
  ProjectState,
} from './../../../../../state/applications-flow.state';
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
    /**
     * Testing disabling forms
     */
    // setTimeout(() => {
    //   this.formsService.Forms.find((x: {Id: string, Form: FormGroup}) => {
    //    if (x.Id === 'RootDirectoryForm') {
    //      x.Form.disable();
    //      debugger;
    //    }
    //   });
    // }, 5000);
  }

  public ngAfterContentChecked(): void {
    this.cd.detectChanges();
  }
}
