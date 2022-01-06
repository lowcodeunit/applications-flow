import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'projects/common/src/lib/services/project.service';
import { ApplicationsFlowState } from '@lowcodeunit/applications-flow-common';

@Component({
  selector: 'lcu-enterprise',
  templateUrl: './enterprise.component.html',
  styleUrls: ['./enterprise.component.scss']
})
export class EnterpriseComponent implements OnInit {


  public State: ApplicationsFlowState;

  public get NumberOfProjects(): number{
    return this.ProjectKeys.length;
  }

  public get ProjectKeys(): string[]{
    return Object.keys(this.State?.EaC?.Projects || {});
  }



  constructor(protected projectService: ProjectService) {
    this.State = new ApplicationsFlowState();
    
   }

  public ngOnInit(): void {
    this.handleStateChange().then((eac) => {});
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
