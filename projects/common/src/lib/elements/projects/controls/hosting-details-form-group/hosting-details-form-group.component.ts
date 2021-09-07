import { Component, Input, OnChanges, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import {
  ProjectHostingDetails,
  ProjectHostingOption,
} from '../../../../state/applications-flow.state';

@Component({
  selector: 'lcu-hosting-details-form-group',
  templateUrl: './hosting-details-form-group.component.html',
  styleUrls: ['./hosting-details-form-group.component.scss'],
})
export class HostingDetailsFormGroupComponent implements OnChanges, OnInit {
  //  Fields

  //  Properties
  @Input('build-pipeline')
  public BuildPipeline: string;

  public get BuildPipelineFormControl(): AbstractControl {
    return this.FormGroup.get('buildPipeline');
  }

  @Input('details')
  public Details: ProjectHostingDetails;

  public get FormGroup(): FormGroup {
    return this.ParentFormGroup.get('hostingDetails') as FormGroup;
  }

  public get NPMTokenFormControl(): AbstractControl {
    return this.FormGroup.get('npmToken');
  }

  @Input('organization')
  public Organization: string;

  @Input('formGroup')
  public ParentFormGroup: FormGroup;

  public get SelectedHostingOption(): ProjectHostingOption {
    return this.Details?.HostingOptions?.find(
      (ho) => ho.Lookup === this.BuildPipeline
    );
  }

  public get SelectedHostingOptionInputControlValues(): {
    [lookup: string]: any;
  } {
    return this.SelectedHostingOption?.Inputs?.reduce((prev, cur) => {
      const res = {
        ...prev
      };

      prev[cur.Lookup] = this.FormGroup.controls[cur.Lookup].value;

      return res;
    }, {});
  }

  //  Constructors
  constructor(protected formBuilder: FormBuilder) {}

  //  Life Cycle
  public ngOnChanges(): void {}

  public ngOnInit(): void {
    this.BuildPipeline =
      this.BuildPipeline || this.Details?.HostingOptions
        ? this.Details?.HostingOptions[0]?.Lookup
        : '';

    if (this.FormGroup != null) {
      this.ParentFormGroup.removeControl('hostingDetails');
    }

    this.ParentFormGroup.addControl(
      'hostingDetails',
      this.formBuilder.group({
        buildPipeline: [this.BuildPipeline, [Validators.required]],
      })
    );

    this.setupControlsForForm();
  }

  //  API Methods
  public BuildPipelineChanged(): void {
    this.BuildPipeline = this.BuildPipelineFormControl.value;

    this.setupControlsForForm();
  }

  //  Helpers
  protected setupControlsForForm(): void {
    for (const ctrlName in this.FormGroup.controls) {
      if (ctrlName !== 'buildPipeline' && ctrlName !== 'devOpsAction') {
        this.FormGroup.removeControl(ctrlName);
      }
    }

    this.SelectedHostingOption?.Inputs?.forEach((input) => {
      const validators = input.Required ? [Validators.required] : [];

      this.FormGroup.addControl(
        input.Lookup,
        this.formBuilder.control(input.DefaultValue || '', validators)
      );
    });

    if (this.BuildPipelineFormControl.value === 'npm-release') {
      if (!this.FormGroup.controls.npmToken) {
        this.FormGroup.addControl(
          'npmToken',
          this.formBuilder.control('', [Validators.required])
        );
      }
    } else if (
      this.BuildPipelineFormControl.value === 'github-artifacts-release'
    ) {
      if (this.FormGroup.controls.npmToken) {
        this.FormGroup.removeControl('npmToken');
      }
    }
  }
}
