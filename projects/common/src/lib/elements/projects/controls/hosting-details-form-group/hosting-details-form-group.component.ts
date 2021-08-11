import { Component, Input, OnChanges, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { ProjectHostingDetails } from './../../../../state/applications-flow.state';

@Component({
  selector: 'lcu-hosting-details-form-group',
  templateUrl: './hosting-details-form-group.component.html',
  styleUrls: ['./hosting-details-form-group.component.scss'],
})
export class HostingDetailsFormGroupComponent implements OnChanges, OnInit {
  //  Fields

  //  Properties
  public get BuildPipeline(): AbstractControl {
    return this.FormGroup.get('projectDetails').get('buildPipeline');
  }

  @Input('details')
  public Details: ProjectHostingDetails;

  @Input('formGroup')
  public FormGroup: FormGroup;

  public get Organization(): AbstractControl {
    return this.FormGroup.get('repoDetails').get('organization');
  }

  //  Constructors
  constructor(protected formBuilder: FormBuilder) {}

  //  Life Cycle
  public ngOnChanges() {}

  public ngOnInit() {
    const formGroup = this.FormGroup.get('projectDetails') as FormGroup;

    for (const ctrl in formGroup.controls) {
      if (ctrl != null) {
        formGroup.removeControl(ctrl);
      }
    }

    formGroup.addControl(
      'buildPipeline',
      this.formBuilder.control('github', [Validators.required])
    );

    // formGroup.addControl(
    //   'projectName',
    //   this.formBuilder.control('', [Validators.required])
    // );

    // formGroup.addControl(
    //   'hostingOption',
    //   this.formBuilder.control('', [Validators.required])
    // );

    formGroup.addControl(
      'buildScript',
      this.formBuilder.control('npm run build', [Validators.required])
    );

    formGroup.addControl(
      'outputFolder',
      this.formBuilder.control('dist', [Validators.required])
    );

    formGroup.addControl(
      'installCommand',
      this.formBuilder.control('npm ci', [Validators.required])
    );

    // formGroup.addControl('deployScript', this.formBuilder.control(['']));

    // this.FormGroup.setControl(
    //   'projectDetails',
    //   this.formBuilder.group({
    //     hostingOption: ['', Validators.required],
    //     // apiLocation: [''],
    //     // appLocation: ['', Validators.required],
    //     // outputLocation: ['', Validators.required],
    //     // template: ['', Validators.required],
    //     // templateType: ['', Validators.required],
    //   })
    // );
  }

  //  API Methods
  public BuildPipelineChanged(event: MatRadioChange): void {
    const formGroup = this.FormGroup.get('projectDetails') as FormGroup;

    if (this.BuildPipeline.value === 'npm') {
      if (!formGroup.controls.npmToken) {
        formGroup.addControl('npmToken', this.formBuilder.control('', [Validators.required]));
      }
    } else {
      if (formGroup.controls.npmToken) {
        formGroup.removeControl('npmToken');
      }
    }
  }

  //  Helpers
}
