import { DomainsComponent } from './../tabs/domains/domains.component';
import { DynamicTabsModel } from './../../../../models/dynamic-tabs.model';
import { Component, OnInit } from '@angular/core';
import { GeneralComponent } from '../tabs/general/general.component';

@Component({
  selector: 'lcu-project-tabs',
  templateUrl: './project-tabs.component.html',
  styleUrls: ['./project-tabs.component.scss']
})
export class ProjectTabsComponent implements OnInit {

  public TabComponents: Array<DynamicTabsModel>;

  constructor() { }

  ngOnInit(): void {
    this.tabsComponents();
  }

  protected tabsComponents(): void {
    this.TabComponents = [
      new DynamicTabsModel({ Component: GeneralComponent,
                              Data: {},
                              Label: 'General' }),
      new DynamicTabsModel({ Component: DomainsComponent,
                              Data: {},
                              Label: 'Domains' })
    ];
  }

}
