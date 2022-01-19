import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from 'projects/common/src/lib/services/project.service';
import { ApplicationsFlowState } from '@lowcodeunit/applications-flow-common';

@Component({
  selector: 'lcu-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss']
})
export class ApplicationsComponent implements OnInit {

  public get Application(): any{
    return this.State?.EaC?.Applications[this.routeData.appLookup] || {};
  }

  public State: ApplicationsFlowState;

  protected routeData: any;

  

  constructor(private router: Router,
    protected projectService: ProjectService) {

   this.State = new ApplicationsFlowState();

   this.routeData = this.router.getCurrentNavigation().extras.state;


  }

  public ngOnInit(): void {

  }


}
