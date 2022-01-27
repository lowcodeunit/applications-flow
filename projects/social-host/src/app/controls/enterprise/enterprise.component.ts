import { Component, OnInit } from '@angular/core';
import { ApplicationsFlowState,  EaCService } from '@lowcodeunit/applications-flow-common';

@Component({
  selector: 'lcu-enterprise',
  templateUrl: './enterprise.component.html',
  styleUrls: ['./enterprise.component.scss']
})
export class EnterpriseComponent implements OnInit {


  public get State(): ApplicationsFlowState {
    return this.eacSvc.State;
  }

  public get NumberOfProjects(): number{
    return this.ProjectLookups.length;
  }

  public get ProjectLookups(): string[]{
    return Object.keys(this.State?.EaC?.Projects || {});
  }

  public get Enterprise():any{
    return this.State?.EaC?.Enterprise;
  }



  constructor(protected eacSvc: EaCService) {}

  public ngOnInit(): void {
    this.handleStateChange().then((eac) => {});
  }

  protected async handleStateChange(): Promise<void> {
    this.State.Loading = true;

    await this.eacSvc.EnsureUserEnterprise();

  }

}
