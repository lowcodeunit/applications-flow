import { DomainsComponent } from './../tabs/domains/domains.component';
import { DynamicTabsModel } from './../../../../models/dynamic-tabs.model';
import { Component, Input, OnInit } from '@angular/core';
import { GeneralComponent } from '../tabs/general/general.component';
import {
  EaCApplicationAsCode,
  EaCEnvironmentAsCode,
  EaCProjectAsCode,
} from '../../../../models/eac.models';
import { AppsFlowComponent } from '../tabs/apps-flow/apps-flow.component';
import { EaCSourceControl } from '../../../../models/eac.models';
import { DevOpsComponent } from '../tabs/devops/devops.component';

@Component({
  selector: 'lcu-project-tabs',
  templateUrl: './project-tabs.component.html',
  styleUrls: ['./project-tabs.component.scss'],
})
export class ProjectTabsComponent implements OnInit {
  //  Fields

  //  Properties
  public get ApplicationLookups(): Array<string> {
    return Object.keys(this.Applications || {});
  }

  @Input('applications')
  public Applications: { [lookup: string]: EaCApplicationAsCode };

  @Input('project')
  public Project: EaCProjectAsCode;

  @Input('project-lookup')
  public ProjectLookup: string;

  @Input('environment')
  public Environment: EaCEnvironmentAsCode;

  @Input('environment-lookup')
  public EnvironmentLookup: string;

  public TabComponents: Array<DynamicTabsModel>;

  constructor() {}

  public ngOnInit(): void {
    this.tabsComponents();
  }

  protected tabsComponents(): void {
    this.TabComponents = [
      new DynamicTabsModel({
        Component: AppsFlowComponent,
        Data: {
          Project: this.Project,
          ProjectLookup: this.ProjectLookup,
          Applications: this.Applications,
          Environment: this.Environment
        },
        Label: 'Application Flow',
        Icon: 'account_tree',
      }),
      new DynamicTabsModel({
        Component: DevOpsComponent,
        Data: {
          Environment: this.Environment,
          EnvironmentLookup: this.EnvironmentLookup
        },
        Label: 'DevOps',
        Icon: 'build',
      }),
      new DynamicTabsModel({
        Component: GeneralComponent,
        Data: { Project: this.Project, ProjectLookup: this.ProjectLookup },
        Label: 'General',
        Icon: 'pages',
      }),
      new DynamicTabsModel({
        Component: DomainsComponent,
        Data: {
          Project: this.Project,
          ProjectLookup: this.ProjectLookup,
        },
        Label: 'Domains',
        Icon: 'domain',
      }),
    ];
  }
}
