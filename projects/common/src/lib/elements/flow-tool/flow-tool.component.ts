import { Component, OnInit } from '@angular/core';
import { StreamInvocationMessage } from '@aspnet/signalr';
import '@semanticjs/krakyn';
import { ConstantUtils, DragDropUtils, DragItemsTemplates, VariablesUtils } from '@semanticjs/krakyn';

@Component({
  selector: 'lcu-flow-tool',
  templateUrl: './flow-tool.component.html',
  styleUrls: ['./flow-tool.component.scss']
})


export class FlowToolComponent implements OnInit {

  // Array<{Module: string, Data: Array<any>}>
  public Data: any;
  public SideMenuItems: any;
  public Title: string;
  public TabMenuItems: Array<{Label: string, Target: string, Class?: string}>;

  constructor() {

    VariablesUtils.DataFlowModuleData =
    [
      ConstantUtils.NAPKIN_IDE_MODULE_DATA,
      ConstantUtils.HOME_MODULE_DATA
    ];

    this.Title = 'The Krakyn Tool!';

    this.SideMenuItems = DragItemsTemplates.FLOW_DRAG_ITEMS(DragDropUtils.Drag);

    this.TabMenuItems = [
      { Label: 'Napkin IDE', Target: 'NapkinIDE', Class: 'selected' },
      { Label: 'Home', Target: 'Home' }
    ];

    this.Data = VariablesUtils.DataFlowModuleData[0];
    console.log('DATA: ', this.Data.Data);
   }

  ngOnInit(): void {
  }

}
