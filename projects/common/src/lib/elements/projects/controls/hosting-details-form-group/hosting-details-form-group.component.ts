import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectHostingDetails } from './../../../../state/applications-flow.state';

@Component({
  selector: 'lcu-hosting-details-form-group',
  templateUrl: './hosting-details-form-group.component.html',
  styleUrls: ['./hosting-details-form-group.component.scss'],
})
export class HostingDetailsFormGroupComponent implements OnChanges, OnInit {
  //  Fields

  //  Properties
  @Input('details')
  public Details: ProjectHostingDetails;

  @Input('formGroup')
  public FormGroup: FormGroup;

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

  //  Helpers
}
