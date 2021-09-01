import { ApplicationsFlowService } from './../../../../services/applications-flow.service';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApplicationsFlowEventsService } from './../../../../services/applications-flow-events.service';
import {
  EaCApplicationAsCode,
  EaCProjectAsCode,
} from '../../../../models/eac.models';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Guid } from '@lcu/common';
import { ProjectItemsComponent } from '../project-items/project-items.component';

@Component({
  selector: 'lcu-projects-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  //  Fields

  //  Properties
  @Input('creating-project')
  public CreatingProject: boolean;

  public get HasProjects(): boolean {
    return this.ProjectLookups && this.ProjectLookups.length > 0;
  }

  public ProjectFormGroup: FormGroup;

  public get ProjectLookups(): Array<string> {
    return Object.keys(this.Projects || {});
  }

  public get ProjectName(): AbstractControl {
    return this.ProjectFormGroup.get('name');
  }

  @Input('projects')
  public Projects: { [lookup: string]: EaCProjectAsCode };

  @Input('selected-project-lookup')
  public SelectedProjectLookup: string;

  //  Constructors
  public constructor(
    protected formBuilder: FormBuilder,
    protected appsFlowEventsSvc: ApplicationsFlowEventsService
  ) {}

  //  Life Cycle
  public ngOnInit(): void {
    this.ProjectFormGroup = this.formBuilder.group({
      name: ['', Validators.required],
    });
  }

  //  API Methods
  public CreateProject(): void {
    const proj: EaCProjectAsCode = {
      Project: {
        Name: this.ProjectName?.value,
      },
      Hosts: [`${Guid.CreateRaw()}-shared.lowcodeunit.com`],
      RelyingParty: {
        AccessConfigurations: {
          fathym: {
            AccessRightLookups: ['Fathym.Global.Admin', 'Fathym.User'],
            ProviderLookups: ['ADB2C'],
          },
        },
        AccessRightLookups: ['Fathym.Global.Admin', 'Fathym.User'],
        DefaultAccessConfigurationLookup: 'fathym',
        TrustedProviderLookups: ['ADB2C'],
      },
    };

    this.appsFlowEventsSvc.SaveProjectAsCode({
      ProjectLookup: Guid.CreateRaw(),
      Project: proj,
    });
  }

  public EnableCreatingProject(): void {
    this.appsFlowEventsSvc.SetCreatingProject(true);
  }

  //  Helpers
}
