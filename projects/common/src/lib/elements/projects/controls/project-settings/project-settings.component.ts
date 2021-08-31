import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectHostingDetails } from '../../../../state/applications-flow.state';
import { ApplicationsFlowService } from '../../../../services/applications-flow.service';
import { BaseResponse } from '@lcu/common';
import { EaCProjectAsCode } from '../../../../models/eac.models';

@Component({
  selector: 'lcu-project-settings',
  templateUrl: './project-settings.component.html',
  styleUrls: ['./project-settings.component.scss'],
})
export class ProjectSettingsComponent implements OnInit {
  //  Fields

  //  Properties
  @Output('cancelled')
  public Cancelled: EventEmitter<EaCProjectAsCode>;

  @Input('host-dns-instance')
  public HostDNSInstance: string;

  public ProjectSettingsFormGroup: FormGroup;

  @Input('project')
  public Project: EaCProjectAsCode;

  @Output('saved')
  public Saved: EventEmitter<EaCProjectAsCode>;

  //  Constructors
  constructor(protected formBuilder: FormBuilder) {
    this.Cancelled = new EventEmitter();

    this.Saved = new EventEmitter();
  }
  //  Life Cycle
  public ngOnInit() {
    this.ProjectSettingsFormGroup = this.formBuilder.group({
      host: [this.Project?.Hosts[0] || '', Validators.required],
      name: [this.Project?.Project?.Name || '', Validators.required],
      description: [
        this.Project?.Project?.Description || '',
        Validators.required,
      ],
    });
  }

  //  API Methods
  public Cancel() {
    this.Cancelled.emit(this.Project);
  }

  public Save() {
    const project: EaCProjectAsCode = {
      ...this.Project,
      Project: {
        ...(this.Project.Project || {}),
        Name: this.ProjectSettingsFormGroup.get('name').value,
        Description: this.ProjectSettingsFormGroup.get('description').value,
      },
      Hosts: [
        ...(this.Project.Hosts || []),
        this.ProjectSettingsFormGroup.get('host').value,
      ],
    };

    this.Saved.emit(project);
  }

  //  Helpers
}
