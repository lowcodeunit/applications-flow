import { Component, Injector, OnInit } from '@angular/core';
import {
  ApplicationsFlowState,
  // EaCService,
  // SourceControlDialogComponent,
  // BuildPipelineDialogComponent,
  // ApplicationsFlowService,
  ProjectService,
} from '@lowcodeunit/applications-flow-common';
import { ConstantUtils, DragDropUtils, SideMenuItemTemplates, VariablesUtils } from '@semanticjs/krakyn';
import { EaCNapkinIDEFlowImporter } from './EaCNapkinIDEFlowImporter';

export class EaCNapkinIDELayoutManager {
  //  Fields

  //  Properties

  //  Constructors
  constructor() {
  }

  //  API Methods
  public Layout(data: any) {
    console.log('Layout manager =================================>');
    console.log(data);

    return data;
  }

  //  Helpers
}

@Component({
  selector: 'app-krakyn-tool',
  templateUrl: './krakyn-tool.component.html',
  styleUrls: ['./krakyn-tool.component.scss'],
})
export class KrakynToolComponent implements OnInit {
  public State: ApplicationsFlowState;

  public KrakynData: any;
  public SideMenuItems: any;
  public Title: string;
  public TabMenuItems: Array<{ Label: string; Target: string; Class?: string }>;

  constructor(
    protected injector: Injector,
    protected projectService: ProjectService
  ) {

    this.State = new ApplicationsFlowState();
   }

  // Lifecycle hooks
  public ngOnInit(): void {
    this.Title = 'The Krakyn Tool';

    this.SideMenuItems = SideMenuItemTemplates.FLOW_DRAG_ITEMS(DragDropUtils.SideMenuDragEvent);

    this.TabMenuItems = [
      {
        Label: 'External Data Test',
        Target: 'ExternalData',
        Class: 'selected',
      },
      { Label: 'Original Data', Target: 'OriginalData', Class: '' },
      //   { Label: 'Home', Target: 'Home' }
    ];

    this.handleStateChange().then((eac) => {});
  }

  /**
   * Krakyn data
   *
   * @returns krakyn data or empty object
   */
  // public KrakynData(): Promise<any> {
  //   return (this.State && this.State.Enterprises) ? this.krakynData : null;
  // }

  /**
   * Import tool data
   */
  protected importData(): void {
    const eaCNapkinIDEFlowImporter: EaCNapkinIDEFlowImporter =
      new EaCNapkinIDEFlowImporter();

    this.Title = 'Imported data for Krakyn';

    const externalData: { Module: string; Data: any } = {
      Module: 'ExternalData',
      Data: eaCNapkinIDEFlowImporter.Import(this.State.EaC),
    };

    const layoutMgr = new EaCNapkinIDELayoutManager();

    externalData.Data = layoutMgr.Layout(externalData.Data);

    const dataIndex: number = 0;

    VariablesUtils.DataFlowModuleData = [
      ConstantUtils.MapData('ExternalData', externalData.Data),
      ConstantUtils.MapData('OriginalData', ConstantUtils.ORIGINAL_TEST_DATA),
    ];

    VariablesUtils.ActiveModule =
      VariablesUtils.DataFlowModuleData[dataIndex].Module;

    this.KrakynData = VariablesUtils.DataFlowModuleData[dataIndex];
  }

  protected async handleStateChange(): Promise<void> {
    this.State.Loading = true;

    await this.projectService.HasValidConnection(this.State);

    await this.projectService.LoadEnterpriseAsCode(this.State);

    await this.projectService.ListEnterprises(this.State);

    if (this.State.Enterprises?.length > 0) {
      this.State.Loading = false;

      this.importData();

      await this.projectService.GetActiveEnterprise(this.State);
    }
  }
}
