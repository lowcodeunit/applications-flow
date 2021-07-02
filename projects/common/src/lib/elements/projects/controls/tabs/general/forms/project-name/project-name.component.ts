import { CardFormConfigModel } from './../../../../../../../models/card-form-config.model';
import { ApplicationsFlowState } from './../../../../../../../state/applications-flow.state';
import { FormActionsModel } from './../../../../../../../models/form-actions.model';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'lcu-project-name',
  templateUrl: './project-name.component.html',
  styleUrls: ['./project-name.component.scss']
})

export class ProjectNameComponent implements OnInit {

  /**
   * Form button actions
   */
  public Config: CardFormConfigModel;

  /**
   * FormGroup for project name card
   */
  public Form: FormGroup;

  /**
   * Access form control for project name
   */
   public get Name(): AbstractControl {
    return this.Form.get('name');
  }

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

  constructor() {
   }

  ngOnInit(): void {
    this.setupForm();
    this.config();
  }

  /**
   * Form configurations
   */
  protected config(): void {
    this.Config = new CardFormConfigModel(
      {
      Icon: 'house',
      Title: 'Root Directory',
      Subtitle: 'The directory within your project, in which your code is located. Leave this field empty if your code is not located in a subdirectory',
      FormActions:
      {
        Message: 'Changes will be applied to your next deployment',
        Actions:
        [
         {
           Label: 'Clear',
           Color: 'warn',
           ClickEvent: this.clearForm,
           Type: 'RESET'
         },
         {
           Label: 'Save',
           Color: 'accent',
           ClickEvent: this.save,
           Type: 'SAVE'
         }
       ]
      }
    });
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

  /**
   * Save form
   */
  protected save(): void {
    
  }

  /**
   * Clear form controls
   */
  protected clearForm(): void {

  }

  /**
   * Listen to form changes
   */
  protected onChange(): void {
    this.Form.valueChanges.subscribe((val: any) => {

    });
  }
}
