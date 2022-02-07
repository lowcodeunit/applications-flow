import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EaCApplicationAsCode } from '@semanticjs/common';

@Component({
  selector: 'lcu-edit-application-form',
  templateUrl: './edit-application-form.component.html',
  styleUrls: ['./edit-application-form.component.scss']
})
export class EditApplicationFormComponent implements OnInit {

  @Input('editing-application') 
  public EditingApplication: EaCApplicationAsCode;

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

  public ApplicationFormGroup: FormGroup;

  constructor(protected formBldr: FormBuilder) {
    this.SaveFormEvent = new EventEmitter;
   }

  public ngOnInit(): void {
    this.setupApplicationForm();
  }

  public SubmitApplicationControl(){
    console.log("application form: ", this.ApplicationFormGroup.value);
    this.SaveFormEvent.emit(this.ApplicationFormGroup.value);
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
        route: [
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
