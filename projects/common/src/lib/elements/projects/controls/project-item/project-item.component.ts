import { ProjectActionsModel } from './../../../../models/project-actions.model';
import { ProjectItemModel } from './../../../../models/project-item.model';
import { Component, OnInit } from '@angular/core';
import { ProjectDetailModel } from 'projects/common/src/lib/models/project-details.model';

@Component({
  selector: 'lcu-project-items',
  templateUrl: './project-item.component.html',
  styleUrls: ['./project-item.component.scss']
})
export class ProjectItemComponent implements OnInit {

  public ProjectItems: Array<ProjectItemModel>;

  constructor() { }

  ngOnInit(): void {
    this.itemDetails();
  }

  protected itemDetails(): void {

    this.ProjectItems = [
      new ProjectItemModel({
        Image: 'asdfsdf',
        Actions: [
          {
            Icon: 'settings',
            Tooltip: 'Settings'
          },
          {
            Icon: 'refresh',
            Tooltip: 'Refresh'
          },
          {
            Icon: 'open_in_new',
            Tooltip: 'Open'
          }
        ],
        Details: {
          Title: 'Pimpire',
          Source: 'Deploys from Github',
          URL: 'www.pimpire.com'
        }
      })
    ];
  }

}
// {Icon: 'settings', Tooltip: 'Settings'},
// {Icon: 'refresh', Tooltip: 'Refresh'},
// {Icon: 'open_in_new', Tooltip: 'Open in new window'}