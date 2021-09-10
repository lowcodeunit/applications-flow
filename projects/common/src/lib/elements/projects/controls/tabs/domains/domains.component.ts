import { FormsService } from './../../../../../services/forms.service';
import { CardFormConfigModel } from './../../../../../models/card-form-config.model';
import { DomainModel } from './../../../../../models/domain.model';
import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ApplicationsFlowEventsService } from '../../../../../services/applications-flow-events.service';
import { EaCHost, EaCProjectAsCode } from '../../../../../models/eac.models';

@Component({
  selector: 'lcu-domains',
  templateUrl: './domains.component.html',
  styleUrls: ['./domains.component.scss'],
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
  public Data: {
    Hosts: { [lookup: string]: EaCHost };
    Project: EaCProjectAsCode;
    ProjectLookup: string;
  };

  public get HostDNSInstance(): string {
    return this.Data?.Hosts ? this.Data?.Hosts[this.Project.Hosts[0]]?.HostDNSInstance : null;
  }

  public get Project(): EaCProjectAsCode {
    return this.Data.Project;
  }

  public get ProjectLookup(): string {
    return this.Data.ProjectLookup;
  }

  constructor(
    protected formsService: FormsService,
    protected appsFlowEventsSvc: ApplicationsFlowEventsService
  ) {}

  public ngOnInit(): void {
    this.formName = 'DomainForm';

    this.setupForm();

    this.config();
  }

  protected config(): void {
    this.Config = new CardFormConfigModel({
      Icon: 'head',
      Title: 'Domains',
      Subtitle:
        'These domains are assigned to your deployments. Optionally, a different Git branch or a redirection to another domain can be configured for each one.',
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
      domain: new FormControl(this.Project.Hosts[0] || '', {
        validators: [Validators.required, Validators.minLength(3)],
        updateOn: 'change',
      }),
    });

    this.formsService.Form = { Id: this.formName, Form: this.Form };
    this.onChange();
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
    this.appsFlowEventsSvc.SaveProjectAsCode({
      ProjectLookup: this.ProjectLookup,
      Project: {
        ...this.Project,
        Hosts: [...this.Project.Hosts, this.Domain.value],
      },
    });
    this.formsService.UpdateValuesReference({
      Id: this.formName,
      Form: this.Form,
    });
  }
}
