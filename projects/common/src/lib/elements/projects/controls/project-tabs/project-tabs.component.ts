import { DomainsComponent } from './../tabs/domains/domains.component';
import { DynamicTabsModel } from './../../../../models/dynamic-tabs.model';
import { Component, Input, OnInit } from '@angular/core';
import { GeneralComponent } from '../tabs/general/general.component';
import { ProjectState } from '../../../../state/applications-flow.state';

@Component({
  selector: 'lcu-project-tabs',
  templateUrl: './project-tabs.component.html',
  styleUrls: ['./project-tabs.component.scss'],
})
export class ProjectTabsComponent implements OnInit {
  //  Fields

  //  Properties
  @Input('host-dns-instance')
  public HostDNSInstance: string;

  @Input('project')
  public Project: ProjectState;

  public TabComponents: Array<DynamicTabsModel>;

  constructor() {}

  public ngOnInit(): void {
    this.tabsComponents();
  }

  protected tabsComponents(): void {
    this.TabComponents = [
      new DynamicTabsModel({
        Component: GeneralComponent,
        Data: { Project: this.Project },
        Label: 'General',
        Icon: 'pages'
      }),
      new DynamicTabsModel({
        Component: DomainsComponent,
        Data: { Project: this.Project, HostDNSInstance: this.HostDNSInstance },
        Label: 'Domains',
        Icon: 'domain'
      }),
    ];
  }
}
