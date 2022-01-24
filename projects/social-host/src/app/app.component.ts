import { Component } from '@angular/core';
import { LCUServiceSettings } from '@lcu/common';
import { ApplicationsFlowState } from '@lowcodeunit/applications-flow-common';
import { ProjectService } from 'projects/common/src/lib/services/project.service';

@Component({
  selector: 'lcu-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'social-host';

  public State: ApplicationsFlowState;

  constructor(
    protected serviceSettings: LCUServiceSettings,
    protected projectService: ProjectService
  ) {
    this.State = new ApplicationsFlowState();
  }

  public ngOnInit(): void {
    this.handleStateChange().then((eac) => {});
  }

  protected async handleStateChange(): Promise<void> {
    this.State.Loading = true;

    await this.projectService.HasValidConnection(this.State);

    await this.projectService.EnsureUserEnterprise(this.State);

    await this.projectService.ListEnterprises(this.State);

    if (this.State.Enterprises?.length > 0) {
      await this.projectService.GetActiveEnterprise(this.State);
    }
  }
}
