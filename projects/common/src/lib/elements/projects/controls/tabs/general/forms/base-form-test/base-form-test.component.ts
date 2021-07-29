import { CardFormConfigModel } from '../../../../../../../models/card-form-config.model';
import { ApplicationsFlowEventsService } from '../../../../../../../services/applications-flow-events.service';
import { FormsService } from '../../../../../../../services/forms.service';
import { BaseFormComponent } from '../../../../../../base-form/base-form.component';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseFormConfigModel } from '../../../../../../../models/base-form-config.model';

@Component({
  selector: 'lcu-base-form-test',
  templateUrl: './base-form-test.component.html',
  styleUrls: ['./base-form-test.component.scss']
})
export class BaseFormTestComponent extends BaseFormComponent implements OnInit {


  /**
   * Access form control for description
   */
   public get Description(): AbstractControl {
    return this.FormConfig.Form.get('description');
  }

  /**
   * Access form control for project name
   */
   public get Name(): AbstractControl {
    return this.FormConfig.Form.get('name');
  }

  constructor(
    protected formsService: FormsService,
    protected appsFlowEventsSvc: ApplicationsFlowEventsService
  ) {

    super(formsService, appsFlowEventsSvc);
    
  }

  public ngOnInit(): void {
    this.FormConfig = new BaseFormConfigModel({FormName: 'TestFormComponent'});

    this.setupConfig();
    this.setupMyForm();

    super.ngOnInit();
  }

  protected setupMyForm(): void {
    this.FormConfig.Form = new FormGroup({
      name: new FormControl('', {
        validators: [Validators.required, Validators.minLength(1)],
        updateOn: 'change',
      }),
      description: new FormControl('', {
        validators: [Validators.required, Validators.minLength(1)],
        updateOn: 'change',
      }),
    });

    this.checkFormForChanges();
  }

  protected setupConfig(): void {
    this.FormConfig.CardConfig = new CardFormConfigModel({
      Icon: 'house',
      Title: 'Test Form',
      Subtitle:
        'The directory within your project, in which your code is located. Leave this field empty if your code is not located in a subdirectory',
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

  protected save(): void {
    console.log('CHILD SAVE');
  }

}
