import { FormsService } from '../../../../../../../services/forms.service';
import { CardFormConfigModel } from '../../../../../../../models/card-form-config.model';
import {
  ApplicationsFlowState,
  ProjectState,
} from '../../../../../../../state/applications-flow.state';
import { FormActionsModel } from '../../../../../../../models/form-actions.model';
import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'lcu-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss'],
})
export class ProjectNameComponent implements OnInit {
  /**
   * Form button actions
   */
  public Config: CardFormConfigModel;

  /**
   * Access form control for description
   */
  public get Description(): AbstractControl {
    return this.Form.get('description');
  }

  /**
   * FormGroup for project name card
   */
  public Form: FormGroup;

  // protected formIsDirtySubscription: Subscription;

  /**
   * Access form control for project name
   */
  public get Name(): AbstractControl {
    return this.Form.get('name');
  }

  /**
   * Input value for state
   */
  @Input('project')
  public Project: ProjectState;

  constructor(protected formsService: FormsService) {}

  public ngOnInit(): void {
    this.setupForm();

    this.config();

    // this.formIsDirtySubscription = this.formsService.FormIsDirty.subscribe(
    //   (val: {IsDirty: boolean, Id: string, Form: FormGroup}) => {

    //   if (val.Id !== 'ProjectNameForm' && this.Form.enabled) {
    //     console.log('DISABLE Project Name');
    //     // val.IsDirty ? this.Form.disable() : this.Form.enable();
    //     this.Form.disable();
    //   }
    // });
  }

  /**
   * Form configurations
   */
  protected config(): void {
    this.Config = new CardFormConfigModel({
      Icon: 'house',
      Title: 'Root Directory',
      Subtitle:
        'The directory within your project, in which your code is located. Leave this field empty if your code is not located in a subdirectory',
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
  /**
   * Setup form controls
   */
  protected setupForm(): void {
    this.Form = new FormGroup({
      name: new FormControl(this.Project?.Name || '', {
        validators: [Validators.required, Validators.minLength(1)],
        updateOn: 'change',
      }),
      description: new FormControl(this.Project?.Description || '', {
        validators: [Validators.required, Validators.minLength(1)],
        updateOn: 'change',
      }),
    });

    this.formsService.Forms.push({ Id: 'ProjectNameForm', Form: this.Form });

    this.onChange();
  }

  /**
   * Save form
   */
  protected save(): void {}

  /**
   * Clear form controls
   */
  protected clearForm(): void {
    // enable all forms
    this.formsService.DisableForms(false);
  }

  /**
   * Listen to form changes
   */
  protected onChange(): void {
    this.Form.valueChanges.subscribe((val: object) => {
      // disable all forms except the current form being edited
      this.formsService.DisableForms('ProjectNameForm');

      /**
       * One possible way to enable / disable - shannon
       */
      // this.formsService.FormIsDirty.next(
      //   {
      //     IsDirty: true,
      //     Id: 'ProjectNameForm',
      //     Form: this.Form
      //   }
      // );
    });
  }
}