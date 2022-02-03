import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EaCApplicationAsCode } from '@semanticjs/common';

@Component({
  selector: 'lcu-security-toggle',
  templateUrl: './security-toggle.component.html',
  styleUrls: ['./security-toggle.component.scss']
})
export class SecurityToggleComponent implements OnInit {

  @Input('editing-application')
  public EditingApplication: EaCApplicationAsCode;

  public get IsPrivateFormControl(): AbstractControl {
    return this.SecurityFormGroup?.controls.isPrivate;
  }

  public SecurityFormGroup: FormGroup;

  public ProcessorType: string;

  constructor(protected formBldr: FormBuilder) { }

  public ngOnInit(): void {
    this.setupSecurityFormGroup();
  }

  public SecuritySubmit() {
    //save the security settings
    console.log("submitting values: ", this.SecurityFormGroup.value);
  }

  protected setupSecurityFormGroup() {
    this.ProcessorType = this.EditingApplication?.Processor?.Type || '';
    this.SecurityFormGroup = this.formBldr.group({});
    this.setupSecurityForm();
  }

  protected setupSecurityForm(): void {
    this.SecurityFormGroup.addControl(
      'isPrivate',
      this.formBldr.control(
        this.EditingApplication.LookupConfig?.IsPrivate || false,
        [Validators.required]
      )
    );

    this.SecurityFormGroup.addControl(
      'isTriggerSignIn',
      this.formBldr.control(
        this.EditingApplication.LookupConfig?.IsTriggerSignIn || false,
        [Validators.required]
      )
    );
  }

}
