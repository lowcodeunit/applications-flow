import { Component, Injector, OnInit } from '@angular/core';
import { EnterpriseAsCode } from '@semanticjs/common';
import { EaCNapkinIDEFlowImporter } from '@semanticjs/napkin-ide';
import '@semanticjs/krakyn';
import { ConstantUtils, DragDropUtils, DragItemsTemplates, VariablesUtils } from '@semanticjs/krakyn';
import { LcuElementComponent } from '@lcu/common';
import { ApplicationsFlowProjectsContext } from '../projects/projects.component';
import { ApplicationsFlowState } from '../../state/applications-flow.state';
import { ApplicationsFlowService } from '../../services/applications-flow.service';
import { ProjectService } from '../../services/project.service';
import { ApplicationsFlowEventsService } from '../../services/applications-flow-events.service';

@Component({
  selector: 'lcu-flow-tool',
  templateUrl: './flow-tool.component.html',
  styleUrls: ['./flow-tool.component.scss']
})


export class FlowToolComponent extends LcuElementComponent<ApplicationsFlowProjectsContext>
implements OnInit  {

  public State: ApplicationsFlowState;


  // Array<{Module: string, Data: Array<any>}>
  public Data: any;
  public DataTest: any;
  public SideMenuItems: any;
  public Title: string;
  public TabMenuItems: Array<{Label: string, Target: string, Class?: string}>;

  constructor(
    protected injector: Injector,
    protected appsFlowSvc: ApplicationsFlowService,
    protected projectService: ProjectService,
    protected appsFlowEventsSvc: ApplicationsFlowEventsService
  ) {

    super(injector);

    console.log('CONSTRUCTOR');

    this.State = new ApplicationsFlowState();

    VariablesUtils.DataFlowModuleData =
    [
      ConstantUtils.NAPKIN_IDE_MODULE_DATA,
      ConstantUtils.HOME_MODULE_DATA
    ];

    this.Title = 'The Krakyn Tool';

    this.SideMenuItems = DragItemsTemplates.FLOW_DRAG_ITEMS(DragDropUtils.Drag);

    this.TabMenuItems = [
      { Label: 'Napkin IDE', Target: 'NapkinIDE', Class: 'selected' },
      { Label: 'Home', Target: 'Home' }
    ];

    // this.Data = VariablesUtils.DataFlowModuleData[0];
    // console.log('Krakyn Tool Test Data: ', this.Data.Data);
   }

   // Lifecycle hooks
  public ngOnInit(): void {

    super.ngOnInit();

    this.handleStateChange()
    .then((eac) => {});
  }

  /**
   * Import tool data
   */
  protected importData(): void {

    console.log('IMPORT DATA');
    this.Title = 'Import Data for Krakyn Tool';

    const eaCNapkinIDEFlowImporter: EaCNapkinIDEFlowImporter = new EaCNapkinIDEFlowImporter();
    const model: EnterpriseAsCode = new EnterpriseAsCode();

    console.log('STATE', this.State);
    console.log('KRAKYN', this.State.EaC);

    this.Data = eaCNapkinIDEFlowImporter.Import(this.State.EaC);
    this.DataTest = eaCNapkinIDEFlowImporter.Import(this.State.EaC);

    console.log('KRAKYN  DATA SET!!!!!!!', this.Data);

  }

  protected async handleStateChange(): Promise<void> {

    console.log('HANDLE STATE CHANGE');

    this.State.Loading = true;

    await this.projectService.HasValidConnection(this.State);

    await this.projectService.EnsureUserEnterprise(this.State);

    await this.projectService.ListEnterprises(this.State);

    if (this.State.Enterprises?.length > 0) {

      this.State.Loading = false;

      this.importData();

      await this.projectService.GetActiveEnterprise(this.State);

    }
  }
}
