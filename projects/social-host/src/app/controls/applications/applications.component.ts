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

  public Stats: any;

  protected routeData: any;

  constructor(private router: Router,
    protected projectService: ProjectService) {

      this.Stats = [{Name: "Retention Rate", Stat: "85%"}, 
   {Name: "Bounce Rate", Stat: "38%"}, 
   {Name: "Someother Rate", Stat: "5%"}];

   this.State = new ApplicationsFlowState();

   this.routeData = this.router.getCurrentNavigation().extras.state;


  }

  public ngOnInit(): void {

    this.handleStateChange().then((eac) => {});

  }

  //HELPERS

  protected async handleStateChange(): Promise<void> {
    this.State.Loading = true;

    await this.projectService.HasValidConnection(this.State);

    await this.projectService.ListEnterprises(this.State);

    if (this.State.Enterprises?.length > 0) {
      await this.projectService.GetActiveEnterprise(this.State);
    }

  }


}
