import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { EaCApplicationAsCode, EaCEnvironmentAsCode, EaCProjectAsCode, EaCSourceControl } from '@semanticjs/common';
import { SourceControlFormControlsComponent } from '../../elements/projects/controls/forms/source-control/source-control.component';

@Component({
  selector: 'lcu-source-control-form',
  templateUrl: './source-control-form.component.html',
  styleUrls: ['./source-control-form.component.scss']
})
export class SourceControlFormComponent implements OnInit {

  @Input('editing-application')
  public EditingApplication: EaCApplicationAsCode;

  @Input('environment')
  public Environment: EaCEnvironmentAsCode;

  @ViewChild(SourceControlFormControlsComponent)
  public SourceControlFormControls: SourceControlFormControlsComponent;

  public get HasBuildFormControl(): AbstractControl {
    return this.SourceControlFormGroup?.controls.hasBuild;
  }

  public get SourceControlLookupFormControl(): AbstractControl {
    return this.SourceControlFormGroup?.controls.sourceControlLookup;
  }

  public get SourceControlLookups(): Array<string> {
    return Object.keys(this.SourceControls || {});
  }

  public get SourceControls(): { [lookup: string]: EaCSourceControl } {
    return this.Environment.Sources || {};
  }

  public SourceControlFormGroup: FormGroup;

  public ProcessorType: string;

  constructor(protected formBldr: FormBuilder) { }

  public ngOnInit(): void {
    this.setupSourceControlForm();
  }

  public SourceControlLookupChanged(event: MatSelectChange): void {
    //  TODO:  Anything to do here on change?
    console.log("sourceControlLookupChanged: ", event);
  }

  public SubmitSourceControl() {
    console.log("submitting source control: ", this.SourceControlFormGroup.value);
  }


  //HELPER

  protected setupSourceControlForm(): void {
    this.ProcessorType = this.EditingApplication?.Processor?.Type || '';

    this.SourceControlFormGroup = this.formBldr.group({});

    this.setupBuildForm();

  }

  protected setupBuildForm(): void {
    this.SourceControlFormGroup.addControl(
      'hasBuild',
      this.formBldr.control(
        !!this.EditingApplication.LowCodeUnit?.SourceControlLookup || false,
        [Validators.required]
      )
    );

    this.SourceControlFormGroup.addControl(
      'sourceControlLookup',
      this.formBldr.control(
        this.EditingApplication.LowCodeUnit?.SourceControlLookup || '',
        []
      )
    );
  }

}
