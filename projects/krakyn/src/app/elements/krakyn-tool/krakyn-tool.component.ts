import { Component, Injector, OnInit } from '@angular/core';
import {
  ApplicationsFlowState,
  // EaCService,
  // SourceControlDialogComponent,
  // BuildPipelineDialogComponent,
  // ApplicationsFlowService,
  ProjectService,
} from '@lowcodeunit/applications-flow-common';
import { ConstantUtils, DragDropUtils, DragItemsTemplates, VariablesUtils } from '@semanticjs/krakyn';
import { EaCNapkinIDEFlowImporter } from '@semanticjs/napkin-ide';

@Component({
  selector: 'app-krakyn-tool',
  templateUrl: './krakyn-tool.component.html',
  styleUrls: ['./krakyn-tool.component.scss']
})
export class KrakynToolComponent implements OnInit {

  public State: ApplicationsFlowState;

  // Array<{Module: string, Data: Array<any>}>
  public KrakynData: any;
  public SideMenuItems: any;
  public Title: string;
  public TabMenuItems: Array<{Label: string, Target: string, Class?: string}>;

  constructor(
    protected injector: Injector,
    protected projectService: ProjectService
  ) {

    // super(injector);

    console.log('FLOW TOOL CONSTRUCTOR');

    this.State = new ApplicationsFlowState();

    // VariablesUtils.DataFlowModuleData =
    // [
    //   ConstantUtils.NAPKIN_IDE_MODULE_DATA,
    //   ConstantUtils.HOME_MODULE_DATA
    // ];

    this.Title = 'The Krakyn Tool';

    this.SideMenuItems = DragItemsTemplates.FLOW_DRAG_ITEMS(DragDropUtils.Drag);

    this.TabMenuItems = [
      { Label: 'External Data Test', Target: 'ExternalData', Class: 'selected' },
      { Label: 'Original Data', Target: 'OriginalData', Class: '' }
    //   { Label: 'Home', Target: 'Home' }
    ];

    // this.Data = VariablesUtils.DataFlowModuleData[0];
    // console.log('Krakyn Tool Test Data: ', this.Data.Data);
   }

   // Lifecycle hooks
  public ngOnInit(): void {

    this.handleStateChange()
    .then((eac) => {});
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

    const eaCNapkinIDEFlowImporter: EaCNapkinIDEFlowImporter = new EaCNapkinIDEFlowImporter();

    this.Title = 'Imported data for Krakyn';

    const externalData: { Module: string, Data: any } = {
      Module: 'ExternalData',
      Data: eaCNapkinIDEFlowImporter.Import(this.State.EaC)
    };

    const dataIndex: number = 0;

    VariablesUtils.DataFlowModuleData = [
      ConstantUtils.MapData('ExternalData', externalData.Data),
      ConstantUtils.MapData('OriginalData', ConstantUtils.ORIGINAL_TEST_DATA)
    ];

    VariablesUtils.ActiveModule = VariablesUtils.DataFlowModuleData[dataIndex].Module;

    this.KrakynData = VariablesUtils.DataFlowModuleData[dataIndex];

    console.log('KRAKYN - DATA SET!!!!!!!', this.KrakynData);

  }

  protected async handleStateChange(): Promise<void> {
    debugger;
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

