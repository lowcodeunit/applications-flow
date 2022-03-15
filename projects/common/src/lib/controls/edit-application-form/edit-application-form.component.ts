import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EaCApplicationAsCode } from '@semanticjs/common';
import { EaCService, SaveApplicationAsCodeEventRequest } from '../../services/eac.service';
import { ApplicationsFlowState } from '../../state/applications-flow.state';

@Component({
  selector: 'lcu-edit-application-form',
  templateUrl: './edit-application-form.component.html',
  styleUrls: ['./edit-application-form.component.scss']
})
export class EditApplicationFormComponent implements OnInit {

  @Input('application-lookup')
  public ApplicationLookup: string;

  @Input('current-route')
  public CurrentRoute: string;

  @Input('editing-application') 
  public EditingApplication: EaCApplicationAsCode;

  @Input('has-save-button')
  public HasSaveButton: boolean;

  @Input('project-lookup')
  public ProjectLookup: string;

  @Output('save-form-event')
  public SaveFormEvent: EventEmitter<{}>

  public get DescriptionFormControl(): AbstractControl {
    return this.ApplicationFormGroup?.controls.description;
  }

  public get NameFormControl(): AbstractControl {
    return this.ApplicationFormGroup?.controls.name;
  }

  public get RouteFormControl(): AbstractControl {
    return this.ApplicationFormGroup?.controls.route;
  }

  public get State(): ApplicationsFlowState{
    return this.eacSvc.State;
  }

  public ApplicationFormGroup: FormGroup;

  constructor(protected formBldr: FormBuilder,
    protected eacSvc: EaCService) {
    this.SaveFormEvent = new EventEmitter;
    this.HasSaveButton = true;
   }

  public ngOnInit(): void {
    this.setupApplicationForm();
  }

  public SubmitApplicationControl(){
    console.log("application form: ", this.ApplicationFormGroup.value);
    this.SaveApplication();
  }

  public SaveApplication(): void {
    const app: EaCApplicationAsCode = this.EditingApplication;
    // console.log("APP=", app);
    app.Application = {
      Name: this.NameFormControl.value,
      Description: this.DescriptionFormControl.value,
      PriorityShift: this.EditingApplication?.Application?.PriorityShift || 0,
    };

    app.LookupConfig.PathRegex = `${this.RouteFormControl.value}.*`;

    switch (app.Processor.Type) {
      case 'DFS':
        app.Processor.BaseHref = `${this.RouteFormControl.value}/`.replace('//', '/');

        break;
    }

    if (!app.LookupConfig.PathRegex.startsWith('/')) {
      app.LookupConfig.PathRegex = `/${app.LookupConfig.PathRegex}`;
    }

    const saveAppReq: SaveApplicationAsCodeEventRequest = {
      ProjectLookup: this.ProjectLookup,
      Application: app,
      ApplicationLookup: this.ApplicationLookup,
    };

    console.log("processor details being submitted: ", app.Processor)

    this.eacSvc.SaveApplicationAsCode(saveAppReq).then(res =>{
      this.SaveFormEvent.emit(res);
    })
    
  }

  //HELPERS
  protected setupApplicationForm(){
    if (this.EditingApplication != null) {
      this.ApplicationFormGroup = this.formBldr.group({
        name: [this.EditingApplication.Application?.Name, Validators.required],
        description: [
          this.EditingApplication.Application?.Description,
          Validators.required,
        ],
        route: [this.CurrentRoute ? this.CurrentRoute :
          this.EditingApplication.LookupConfig?.PathRegex.replace('.*', '') ||
            '/',
          Validators.required,
        ],
        // priority: [
        //   this.EditingApplication.Application?.Priority || 10000,
        //   Validators.required,
        // ],
      });
    }
  }

  

}
