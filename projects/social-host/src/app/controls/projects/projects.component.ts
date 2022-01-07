import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from 'projects/common/src/lib/services/project.service';
import { ApplicationsFlowState } from '@lowcodeunit/applications-flow-common';

@Component({
  selector: 'lcu-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  public routeData: any;

  public State: ApplicationsFlowState;


  public test: any;

  public get Project(): any{
    return this.State?.EaC?.Projects[this.routeData.projectLookup] || {};
  }

  public get NumberOfRoutes(): number{
    return this.ApplicationLookups.length;
  }

  public get ApplicationLookups(): string[]{
    return Object.keys(this.Project.ApplicationLookups || {});
  }
  
  
  constructor(private router: Router,
     protected projectService: ProjectService) {

    this.State = new ApplicationsFlowState();

    this.routeData = this.router.getCurrentNavigation().extras.state;
   }

  public ngOnInit(): void {

    this.handleStateChange().then((eac) => {});
    
    console.log("route Data: ", this.routeData); 

  }

  protected async handleStateChange(): Promise<void> {
    this.State.Loading = true;

    await this.projectService.HasValidConnection(this.State);

    await this.projectService.ListEnterprises(this.State);

    if (this.State.Enterprises?.length > 0) {
      await this.projectService.GetActiveEnterprise(this.State);
    }

  }

}
