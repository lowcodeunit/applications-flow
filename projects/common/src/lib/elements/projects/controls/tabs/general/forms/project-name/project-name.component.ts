import { BaseCardFormComponent } from './../../../../../../base-card-form/base-card-form.component';
import { ApplicationsFlowState } from './../../../../../../../state/applications-flow.state';
import { FormActionsModel } from './../../../../../../../models/form-actions.model';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'lcu-project-name',
  templateUrl: './project-name.component.html',
  styleUrls: ['./project-name.component.scss']
})

export class ProjectNameComponent extends BaseCardFormComponent implements OnInit {

  /**
   * Access form control for project name
   */
   public get Name(): AbstractControl {
    return this.Form.get('name');
  }

  /**
   * Card subtitle
   */
  public Subtitle: string;

  /**
   * Access form control for project surname
   */
 public get Surname(): AbstractControl {
  return this.Form.get('surname');
}

  /**
   * Input value for state
   */
  @Input('state')
  public State: ApplicationsFlowState;

  /**
   * Card title
   */
  public Title: string;

  constructor() {
    super();
   }

  ngOnInit(): void {
    this.setupForm();
    this.config();
  }

  /**
   * Form configurations
   */
  protected config(): void {

    this.Icon = 'house';
    this.Title = 'Root Directory';
    this.Subtitle = 'The directory within your project, in which your code is located. Leave this field empty if your code is not located in a subdirectory';

    this.Actions =
     {
       Message: 'Changes will be applied to your next deployment',
       Actions:
       [
        {
          Label: 'Clear',
          Color: 'warn',
          ClickEvent: this.clearForm
        },
        {
          Label: 'Save',
          Color: 'accent',
          ClickEvent: this.save
        }
      ]
     };
  }
  /**
   * Setup form controls
   */
  protected setupForm(): void {
    this.Form = new FormGroup({
      name: new FormControl('', {
        validators: [Validators.required, Validators.minLength(3)],
        updateOn: 'change'
      }),
      surname: new FormControl('', {
        validators: [Validators.required, Validators.minLength(3)],
        updateOn: 'change'
      })
    });

    this.onChange();
  }
}
