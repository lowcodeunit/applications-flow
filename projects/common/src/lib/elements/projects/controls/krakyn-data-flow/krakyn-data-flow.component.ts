import { Component, OnInit } from '@angular/core';
import { 
  FlowTool,
  MenuTemplatesUtils,
  VariablesUtils,
  EventsUtils,
  ConstantUtils,
  NodeTemplates,
  DragItemsTemplates,
  PositionUtils,
  DragDropUtils,
  RollUpTest } from '@semanticjs/krakyn';
import { DataFlowDataModel } from '@semanticjs/krakyn/dist/src/models/dataflow-data.model';
import { MenuTemplateModel } from '@semanticjs/krakyn/dist/src/models/menu/menu-template.model';

@Component({
  selector: 'lcu-krakyn-data-flow',
  templateUrl: './krakyn-data-flow.component.html',
  styleUrls: ['./krakyn-data-flow.component.scss']
})

// @customElement('hello-world')

export class KrakynDataFlowComponent implements OnInit {

  // public DefaultData: Array<DataFlowDataModel>;
  public DefaultData: DataFlowDataModel;
  public MenuItems: Array<MenuTemplateModel>;
  public Title: string;
  public TabMenuItems: Array<any>;

  ngOnInit(): void {
    // customElements.define('roll-up-test', RollUpTest);

    VariablesUtils.DataFlowModuleData =
    [
      ConstantUtils.NAPKIN_IDE_MODULE_DATA,
      ConstantUtils.HOME_MODULE_DATA
    ];

    this.TabMenuItems = [
      { Label: 'Napkin IDE', Target: 'NapkinIDE', Class: 'selected' },
      { Label: 'Home', Target: 'Home' }];
    this.DefaultData = VariablesUtils.DataFlowModuleData[0];
    this.MenuItems = DragItemsTemplates.FLOW_DRAG_ITEMS(DragDropUtils.Drag);
    this.Title = 'App Flow Krakyn';
  }
}
