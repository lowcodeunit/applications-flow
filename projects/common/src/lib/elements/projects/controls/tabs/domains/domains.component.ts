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
  public Data: { Project: ProjectState };

  public get Project(): ProjectState {
    return this.Data.Project;
  }

  constructor(protected formsService: FormsService,
    protected appsFlowEventsSvc: ApplicationsFlowEventsService) {
  }

  public ngOnInit(): void {
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
          Label: 'Clear',
          Color: 'warn',
          ClickEvent: () => this.clearForm(),
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

    this.formsService.Form = { Id: 'DomainForm', Form: this.Form };
    this.onChange()
  }

  protected onChange(): void {
    this.Form.valueChanges.subscribe((val: any) => {

      if (this.formsService.ForRealThough('DomainForm', this.Form)) {

        this.IsDirty = true;
         // disable all forms except the current form being edited
        this.formsService.DisableForms('DomainForm');
      } else {

        this.IsDirty = false;
        // enable all forms
        this.formsService.DisableForms(false);
      }
    });
  }

  /**
   * Clear form controls
   */
  protected clearForm(): void {
    // this.Form.reset();

    // enable all forms
    this.formsService.DisableForms(false);
  }

  /**
   * Save changes
   */
  protected save(): void {
    this.appsFlowEventsSvc.SaveProject({
      ...this.Project,
      Host: this.Domain.value
    });
  }
}
