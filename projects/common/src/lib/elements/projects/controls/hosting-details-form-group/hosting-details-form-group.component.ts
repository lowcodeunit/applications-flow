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
  public get BuildPipeline(): AbstractControl {
    return this.FormGroup.get('buildPipeline');
  }

  @Input('details')
  public Details: ProjectHostingDetails;

  @Input('formGroup')
  public FormGroup: FormGroup;

  @Input('organization')
  public Organization: string;

  public get SelectedHostingOption(): ProjectHostingOption {
    return this.Details?.HostingOptions?.find(
      (ho) => ho.Lookup === this.SelectedHostingOptionLookup
    );
  }

  public SelectedHostingOptionLookup: string;

  //  Constructors
  constructor(protected formBuilder: FormBuilder) {}

  //  Life Cycle
  public ngOnChanges() {}

  public ngOnInit() {
    for (const ctrl in this.FormGroup.controls) {
      if (ctrl != null) {
        this.FormGroup.removeControl(ctrl);
      }
    }

    this.SelectedHostingOptionLookup =
      this.SelectedHostingOptionLookup || this.Details?.HostingOptions
        ? this.Details?.HostingOptions[0]?.Lookup
        : '';

    this.FormGroup.addControl(
      'buildPipeline',
      this.formBuilder.control(this.SelectedHostingOptionLookup, [
        Validators.required,
      ])
    );

    this.setupControlsForForm();
  }

  //  API Methods
  public BuildPipelineChanged(event: MatRadioChange): void {
    this.SelectedHostingOptionLookup = this.BuildPipeline.value;

    this.setupControlsForForm();
  }

  //  Helpers
  protected setupControlsForForm() {
    const controlNames = Object.keys(this.FormGroup.controls);

    for (const ctrlName in this.FormGroup.controls) {
      if (ctrlName !== 'buildPipeline') {
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

    if (this.BuildPipeline.value === 'npm-release') {
      if (!this.FormGroup.controls.npmToken) {
        this.FormGroup.addControl(
          'npmToken',
          this.formBuilder.control('', [Validators.required])
        );
      }
    } else if (this.BuildPipeline.value === 'github-artifacts-release') {
      if (this.FormGroup.controls.npmToken) {
        this.FormGroup.removeControl('npmToken');
      }
    }
  }
}
