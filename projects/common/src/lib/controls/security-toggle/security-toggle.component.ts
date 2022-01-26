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

  public SecuritySubmit(){
    console.log("submitting values")
  }

  protected setupSecurityFormGroup(){
    this.ProcessorType = this.EditingApplication?.Processor?.Type || '';
    if (this.EditingApplication != null) {
      // this.SecurityFormGroup = this.formBldr.group({
      //   name: [this.EditingApplication.Application?.Name, Validators.required],
      //   description: [
      //     this.EditingApplication.Application?.Description,
      //     Validators.required,
      //   ],
      //   route: [
      //     this.EditingApplication.LookupConfig?.PathRegex.replace('.*', '') ||
      //       '/',
      //     Validators.required,
      //   ],
      //   // priority: [
      //   //   this.EditingApplication.Application?.Priority || 10000,
      //   //   Validators.required,
      //   // ],
      //   procType: [this.ProcessorType, [Validators.required]],
      // });

  }
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
