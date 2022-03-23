import { EnterpriseAsCode } from '@semanticjs/common';
import {
  NapkinIDEFlow,
  NapkinIDEFlowImporter,
  NapkinIDENode,
} from '@semanticjs/napkin-ide';
import { map } from 'rxjs';

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
    projLookups.forEach((projLookup: any, index: number) => {
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

      //  Setup Route Filters
      let appRoutePartMap: { [appLookup: string]: string[] };

      project.ApplicationLookups?.reduce((map, appLookup, i) => {
        const app = eac.Applications![appLookup];

        map[appLookup] = app
          .LookupConfig!.PathRegex?.split('/')
          .slice(1)
          .map((pr) => {
            return `/${pr}`;
          });

        let routePartType = 'path';

        if (app.LookupConfig!.QueryRegex) {
          map[appLookup]?.push(`?${app.LookupConfig!.QueryRegex!}`);

          routePartType = 'query';
        }

        if (app.LookupConfig!.HeaderRegex) {
          map[appLookup]?.push(`[${app.LookupConfig!.HeaderRegex!}]`);

          routePartType = 'header';
        }

        if (app.LookupConfig!.UserAgentRegex) {
          map[appLookup]?.push(`#${app.LookupConfig!.UserAgentRegex!}`);

          routePartType = 'user-agent';
        }

        return map;
      }, {});

      //  Process for application nodes
      project.ApplicationLookups?.forEach((appLookup) => {
        const app = eac.Applications![appLookup];

        const routeParts = appRoutePartMap[appLookup];

        //  Setup AppLookupConfig Nodes
        //  Setup Security Filters
        // app.AccessRightLookups;
        // app.LookupConfig.AccessRightsAllAny;
        // app.LookupConfig.IsPrivate;
        // app.LookupConfig.IsTriggerSignIn;
        // app.LookupConfig.LicensesAllAny;
        // app.LicenseConfigurationLookups;

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
              Route: routePart,
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
          Name: app.Application?.Name,
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
