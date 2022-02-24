import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EaCApplicationAsCode } from '@semanticjs/common';
import { EaCService } from '../../services/eac.service';
import { ApplicationsFlowState } from '../../state/applications-flow.state';

@Component({
  selector: 'lcu-security-toggle',
  templateUrl: './security-toggle.component.html',
  styleUrls: ['./security-toggle.component.scss']
})
export class SecurityToggleComponent implements OnInit {

  @Input('editing-application')
  public EditingApplication: EaCApplicationAsCode;

  @Output('save-form-event')
  public SaveFormEvent: EventEmitter<{}>;

  public get IsPrivateFormControl(): AbstractControl {
    return this.SecurityFormGroup?.controls.isPrivate;
  }

  public get IsTriggerSignInFormControl(): AbstractControl {
    return this.SecurityFormGroup?.controls.isTriggerSignIn;
  }

  public get State(): ApplicationsFlowState{
    return this.eacSvc.State;
  }

  public SecurityFormGroup: FormGroup;

  public ProcessorType: string;

  public SkeletonEffect: string;

  constructor(protected eacSvc: EaCService,
    protected formBldr: FormBuilder) { 
    this.SaveFormEvent = new EventEmitter;
    this.SkeletonEffect = 'wave';
  }

  public ngOnInit(): void {
    this.setupSecurityFormGroup();
  }

  public SecuritySubmit() {
    //save the security settings
    console.log("submitting security values: ", this.SecurityFormGroup.value);
    this.SaveFormEvent.emit(this.SecurityFormGroup.value);
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
