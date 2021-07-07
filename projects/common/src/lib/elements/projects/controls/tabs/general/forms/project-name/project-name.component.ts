import { FormsService } from './../../../../../../../services/forms.service';
import { CardFormConfigModel } from './../../../../../../../models/card-form-config.model';
import { ApplicationsFlowState } from './../../../../../../../state/applications-flow.state';
import { FormActionsModel } from './../../../../../../../models/form-actions.model';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

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

  // protected formIsDirtySubscription: Subscription;

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

  constructor(protected formsService: FormsService) {
   }

  ngOnInit(): void {

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
           ClickEvent: () => this.clearForm(),
           // use arrow function, so 'this' refers to ProjectNameComponent 
           // if we used ClickeEvent: this.clearForm, then 'this' would refer to this current Actions object
           Type: 'RESET'
         },
         {
           Label: 'Save',
           Color: 'accent',
           ClickEvent: () => this.save(),
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

    this.formsService.Forms.push({Id: 'ProjectNameForm', Form: this.Form});
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
    
    // enable all forms
    this.formsService.DisableForms(false);
   
  }

  /**
   * Listen to form changes
   */
  protected onChange(): void {
    this.Form.valueChanges.subscribe((val: object) => {
      console.log('DISABLE FORMS');
      this.Form.disable();
      // this.formsService.DisableForms('ProjectNameForm');
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
