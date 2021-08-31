import { DomainsComponent } from './../tabs/domains/domains.component';
import { DynamicTabsModel } from './../../../../models/dynamic-tabs.model';
import { Component, Input, OnInit } from '@angular/core';
import { GeneralComponent } from '../tabs/general/general.component';
import {
  EaCApplicationAsCode,
  EaCProjectAsCode,
} from '../../../../models/eac.models';
import { AppsFlowComponent } from '../tabs/apps-flow/apps-flow.component';

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

  @Input('host-dns-instance')
  public HostDNSInstance: string;

  @Input('project')
  public Project: EaCProjectAsCode;

  @Input('project-lookup')
  public ProjectLookup: string;

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
        },
        Label: 'Application Flow',
        Icon: 'account_tree',
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
          HostDNSInstance: this.HostDNSInstance,
        },
        Label: 'Domains',
        Icon: 'domain',
      }),
    ];
  }
}
