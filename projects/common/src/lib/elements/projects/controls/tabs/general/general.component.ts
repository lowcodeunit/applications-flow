import { FormGroup } from '@angular/forms';
import { FormsService } from './../../../../../services/forms.service';
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
    protected cd: ChangeDetectorRef,
    protected formsService: FormsService
  ) {
    super(injector);

    this.State = new ApplicationsFlowState();
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
