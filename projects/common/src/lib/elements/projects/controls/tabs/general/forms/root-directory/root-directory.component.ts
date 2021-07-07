import { Subscription } from 'rxjs';
import { FormsService } from './../../../../../../../services/forms.service';
import { CardFormConfigModel } from './../../../../../../../models/card-form-config.model';
import { ApplicationsFlowState } from './../../../../../../../state/applications-flow.state';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'lcu-root-directory',
  templateUrl: './root-directory.component.html',
  styleUrls: ['./root-directory.component.scss']
})

export class RootDirectoryComponent implements OnInit {

  /**
   * Card / Form Config
   */
   public Config: CardFormConfigModel;

   /**
    * FormGroup
    */
   public Form: FormGroup;

   protected formIsDirtySubscription: Subscription;
 

  /**
   * Access form control for root directory
   */
   public get Root(): AbstractControl {
    return this.Form.get('root');
  }

  /**
   * Access form control for root directory
   */
   public get IncludeSource(): AbstractControl {
    return this.Form.get('includeSource');
  }

  /**
   * Input value for state
   */
 @Input('state')
 public State: ApplicationsFlowState;

  constructor(protected formsService: FormsService) {

    this.setupForm();
    this.config();
  }

  ngOnInit(): void {

    // this.formIsDirtySubscription = this.formsService.FormIsDirty.subscribe(
    //   (val: {IsDirty: boolean, Id: string, Form: FormGroup}) => {

    //   if (val.Id !== 'RootDirectoryForm' && this.Form.enabled) {
    //     console.log('DISABLE Root Directory');
    //     // val.IsDirty ? this.Form.disable() : this.Form.enable();
    //     this.Form.disable();
    //   }
    // });
  }

  /**
   * Setup form controls
   */
  protected setupForm(): void {
    this.Form = new FormGroup({
      root: new FormControl('', {
        validators: [Validators.required, Validators.minLength(3)],
        updateOn: 'change'
      }),
      includeSource: new FormControl(false)
    });

    this.formsService.Forms.push({Id: 'RootDirectoryForm', Form: this.Form});
    this.onChange();
  }

  /**
   * Form configurations
   */
  protected config(): void {
    this.Config = new CardFormConfigModel({
      Icon: 'house',
      Title: 'Root Directory',
      Subtitle: 'The directory within your project, in which your code is located. Leave this field empty if your code is not located in a subdirectory',
      FormActions: {
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
   * Save form
   */
  protected save(): void {
    
  }

  /**
   * Clear form controls
   */
  protected clearForm(): void {
    this.Form.reset();
  }

  /**
   * Listen to form changes
   */
  protected onChange(): void {
    this.Form.valueChanges.subscribe((val: any) => {
      // this.formsService.FormIsDirty.next(
      //   {
      //     IsDirty: true, Id: 'RootDirectoryForm', Form: this.Form
      //   }
      // );
    });
  }

}
