import { Component, OnInit } from '@angular/core';
import { ApplicationsFlowState,  EaCService } from '@lowcodeunit/applications-flow-common';
import { EaCEnvironmentAsCode } from '@semanticjs/common';

@Component({
  selector: 'lcu-enterprise',
  templateUrl: './enterprise.component.html',
  styleUrls: ['./enterprise.component.scss']
})
export class EnterpriseComponent implements OnInit {

  public get Enterprise():any{
    return this.State?.EaC?.Enterprise;
  }

  public get Environment(): EaCEnvironmentAsCode {
    return this.State?.EaC?.Environments[this.State?.EaC?.Enterprise?.PrimaryEnvironment];
  }

  
  public get NumberOfProjects(): number{
    return this.ProjectLookups.length;
  }

  public get ProjectLookups(): string[]{
    return Object.keys(this.State?.EaC?.Projects || {});
  }

  public get State(): ApplicationsFlowState {
    return this.eacSvc.State;
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
