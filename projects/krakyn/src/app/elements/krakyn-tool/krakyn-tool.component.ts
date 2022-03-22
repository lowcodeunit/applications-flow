import { Component, Injector, OnInit } from '@angular/core';
import {
  ApplicationsFlowState,
  // EaCService,
  // SourceControlDialogComponent,
  // BuildPipelineDialogComponent,
  // ApplicationsFlowService,
  ProjectService,
} from '@lowcodeunit/applications-flow-common';
import { EnterpriseAsCode } from '@semanticjs/common';
import { ConstantUtils, DragDropUtils, SideMenuItemTemplates, VariablesUtils } from '@semanticjs/krakyn';
import { NapkinIDEFlow, NapkinIDEFlowImporter, NapkinIDENode } from '@semanticjs/napkin-ide';

export class EaCNapkinIDEFlowImporter extends NapkinIDEFlowImporter<EnterpriseAsCode> {
  //  Fields

  //  Properties

  //  Constructors
  constructor() {
    super();
  }

  //  API Methods
  public Import(eac: EnterpriseAsCode): NapkinIDEFlow {
    const flow = new NapkinIDEFlow();

    
    if (eac != null) {
      flow.Name = eac.Enterprise?.Name;

      flow.ID = eac.EnterpriseLookup;

      this.establishFlowNodesAndEdges(eac, flow);
    }

    return flow;
  }

  //  Helpers
  protected establishFlowNodesAndEdges(
    eac: EnterpriseAsCode,
    flow: NapkinIDEFlow
  ): void {
    const projLookups = Object.keys(eac.Projects || {});

    let sysCount = 0;

    const requestNode: NapkinIDENode = {
      ID: `sys-${++sysCount}`,
      Type: 'request',
      ClassList: [],
      Data: {},
    };

    flow.Nodes = [requestNode];

    flow.Edges = [];

    //  Process for project nodes
    projLookups.forEach((projLookup: any,index: number) => {
      const project = eac.Projects![projLookup];

      //  Setup Project Node
      const projectNode = new NapkinIDENode();
      projectNode.Type = 'project';
      projectNode.ID = `${projectNode.Type}-${projLookup}`;
      projectNode.Data = {
        Lookup: projLookup,
        Name: project.Project?.Name,
        Hosts: project.Hosts,
      };

      flow.Nodes?.push(projectNode);

      //  Add Request => Project Edge
      flow.Edges?.push({
        ID: `sys-edge-${++sysCount}`,
        NodeInID: requestNode.ID,
        NodeOutID: projectNode.ID,
      });

      //  Process for application nodes
      project.ApplicationLookups?.forEach((appLookup) => {
        const app = eac.Applications![appLookup];

        //  Setup AppLookupConfig Nodes
        //  Setup Security Filters
        // app.AccessRightLookups;
        // app.LookupConfig.AccessRightsAllAny;
        // app.LookupConfig.IsPrivate;
        // app.LookupConfig.IsTriggerSignIn;
        // app.LookupConfig.LicensesAllAny;
        // app.LicenseConfigurationLookups;

        //  Setup Route Filters
        const routeParts = app
          .LookupConfig!.PathRegex?.split('/')
          .slice(1)
          .map((pr) =>  {
            return `/${pr}`
          });

        let routePartType = 'path';

        if (app.LookupConfig!.QueryRegex) {
          routeParts?.push(`?${app.LookupConfig!.QueryRegex!}`);

          routePartType = 'query';
        }

        if (app.LookupConfig!.HeaderRegex) {
          routeParts?.push(`[${app.LookupConfig!.HeaderRegex!}]`);

          routePartType = 'header';
        }

        if (app.LookupConfig!.UserAgentRegex) {
          routeParts?.push(`#${app.LookupConfig!.UserAgentRegex!}`);

          routePartType = 'user-agent';
        }

        let pathPartsCount = 0;

        let lastRoutePartNodeId = projectNode.ID;

        //  Setup Route Filters
        routeParts?.forEach((routePart) => {
          const routePartType = `route-filter`;
          const routePartNodeId = `${routePartType}-${pathPartsCount}`;

          let routePartNode = this.loadExistingNode(flow, routePartNodeId);

          if (routePartNode == null) {
            routePartNode = new NapkinIDENode();
            routePartNode.Type = routePartType;
            routePartNode.ID = routePartNodeId;
            routePartNode.Data = {
              Name: routePart,
              Type: routePartType,
            };
          }

          flow.Nodes?.push(routePartNode);

          //  Add last route part => new route part Edge
          flow.Edges?.push({
            ID: `sys-edge-${++sysCount}`,
            NodeInID: lastRoutePartNodeId,
            NodeOutID: routePartNode.ID,
          });

          lastRoutePartNodeId = routePartNode.ID;

          pathPartsCount++;
        });

        //  Setup Application Nodes
        const appNode = new NapkinIDENode();
        appNode.Type = 'application';
        appNode.ID = `${appNode.Type}-${appLookup}`;
        appNode.Data = {
          Details: app.Application,
          Processor: app.Processor,
        };

        flow.Nodes?.push(appNode);

        //  Add last route part => Application Edge
        flow.Edges?.push({
          ID: `sys-edge-${++sysCount}`,
          NodeInID: lastRoutePartNodeId,
          NodeOutID: appNode.ID,
        });
      });
    });

    //  Setup DevOps nodes (Source Control and DevOpsActions)...  relate apps to source control via edges
  }

  protected loadExistingNode(flow: NapkinIDEFlow, id: string): NapkinIDENode {
    return <NapkinIDENode>flow.Nodes?.find((node) => node.ID === id);
  }
}

export class EaCNapkinIDELayoutManager {
  //  Fields

  //  Properties

  //  Constructors
  constructor() {
  }

  //  API Methods

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
