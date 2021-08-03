import { FormsService } from './../../../../../services/forms.service';
import { CardFormConfigModel } from './../../../../../models/card-form-config.model';
import { DomainModel } from './../../../../../models/domain.model';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProjectState } from './../../../../../state/applications-flow.state';
import { ApplicationsFlowEventsService } from '../../../../../services/applications-flow-events.service';

@Component({
  selector: 'lcu-domains',
  templateUrl: './domains.component.html',
  styleUrls: ['./domains.component.scss']
})
export class DomainsComponent implements OnInit {

  /**
   * Card / Form Config
   */
  public Config: CardFormConfigModel;

  /**
   * FormGroup
   */
  public Form: FormGroup;

  /**
   * Form name
   */
  protected formName: string;

  /**
   * When form is dirty, ties into formsService.DisableForms
   */
  public IsDirty: boolean;

  /**
   * Access form control for root directory
   */
  public get Domain(): AbstractControl {
    return this.Form.get('domain');
  }

  @Input('data')
  public Data: { Project: ProjectState, HostDNSInstance: string };

  public get HostDNSInstance(): string {
    return this.Data.HostDNSInstance;
  }

  public get Project(): ProjectState {
    return this.Data.Project;
  }

  constructor(
    protected formsService: FormsService,
    protected appsFlowEventsSvc: ApplicationsFlowEventsService) {
  }

  public ngOnInit(): void {

    this.formName = 'DomainForm';

    this.setupForm();

    this.config();
  }

  protected config(): void {
   this.Config = new CardFormConfigModel({
     Icon: 'head',
     Title: 'Domains',
     Subtitle: 'These domains are assigned to your deployments. Optionally, a different Git branch or a redirection to another domain can be configured for each one.',
     FormActions: {
      Message: 'Changes will be applied to your next deployment',
      Actions: [
        {
          Label: 'Reset',
          Color: 'warn',
          ClickEvent: () => this.resetForm(),
          // use arrow function, so 'this' refers to ProjectNameComponent
          // if we used ClickeEvent: this.clearForm, then 'this' would refer to this current Actions object
          Type: 'RESET',
        },
        {
          Label: 'Save',
          Color: 'accent',
          ClickEvent: () => this.save(),
          Type: 'SAVE',
        },
      ],
    },
   });
  }

  protected setupForm(): void {
    this.Form = new FormGroup({
      domain: new FormControl(this.Project.Host || '', {
        validators: [Validators.required, Validators.minLength(3)],
        updateOn: 'change'
      }),
    });

    this.formsService.Form = { Id: this.formName, Form: this.Form };
    this.onChange()
  }

  protected onChange(): void {
    this.Form.valueChanges.subscribe((val: any) => {

      if (this.formsService.ForRealThough(this.formName, this.Form)) {

        this.IsDirty = true;
         // disable all forms except the current form being edited
        this.formsService.DisableForms(this.formName);
      } else {

        this.IsDirty = false;
        // enable all forms
        this.formsService.DisableForms(false);
      }
    });
  }

  /**
   * Reset form controls back to previous values
   */
   protected resetForm(): void {
    // enable all forms
    // this.formsService.DisableForms(false);

    this.formsService.ResetFormValues(this.formName);
  }

  /**
   * Save changes
   */
  protected save(): void {
    this.appsFlowEventsSvc.SaveProject({
      ...this.Project,
      Host: this.Domain.value
    });
    this.formsService.UpdateValuesReference({ Id: this.formName, Form: this.Form });
  }
}
