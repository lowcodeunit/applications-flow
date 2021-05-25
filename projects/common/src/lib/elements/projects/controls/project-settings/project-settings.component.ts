import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectHostingDetails, ProjectState } from '../../../../state/applications-flow.state';
import { ApplicationsFlowService } from '../../../../services/applications-flow.service';
import { BaseResponse } from '@lcu/common';

@Component({
  selector: 'lcu-project-settings',
  templateUrl: './project-settings.component.html',
  styleUrls: ['./project-settings.component.scss']
})
export class ProjectSettingsComponent implements OnInit {
  //  Fields

  //  Properties
  @Output('cancelled')
  public Cancelled: EventEmitter<ProjectState>;

  @Input('host-dns-instance')
  public HostDNSInstance: string;

  public ProjectSettingsFormGroup: FormGroup;

  @Input('project')
  public Project: ProjectState;

  @Output('saved')
  public Saved: EventEmitter<ProjectState>;

  //  Constructors
  constructor(
    protected formBuilder: FormBuilder
  ) {
    this.Cancelled = new EventEmitter();

    this.Saved = new EventEmitter();
  }
  //  Life Cycle
  public ngOnInit() {
    this.ProjectSettingsFormGroup = this.formBuilder.group({
      host: [this.Project?.Host || '', Validators.required],
      name: [this.Project?.Name || '', Validators.required],
      description: [this.Project?.Description || '', Validators.required],
    });
  }

  //  API Methods
  public Cancel() {
    this.Cancelled.emit(this.Project);
  }

  public Save() {
    const project: ProjectState = {
      ...this.Project,
      Name: this.ProjectSettingsFormGroup.get('name').value,
      Host: this.ProjectSettingsFormGroup.get('host').value,
      Description: this.ProjectSettingsFormGroup.get('description').value,
    };

    this.Saved.emit(project);
  }

  //  Helpers
}
