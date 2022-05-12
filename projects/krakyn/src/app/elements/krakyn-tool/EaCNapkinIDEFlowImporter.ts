import { ActivatedRoute, Params, Router } from '@angular/router';
import { EnterpriseAsCode } from '@semanticjs/common';
import {
    NapkinIDEFlow,
    NapkinIDEFlowImporter,
    NapkinIDENode,
} from '@semanticjs/napkin-ide';
import {
    ApplicationsFlowState,
    ProjectService,
} from '@lowcodeunit/applications-flow-common';

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
        console.log('project lookups: ', projLookups);

        let sysCount = 0;

        let routePartsCount = 0;

        let appsCount = 0;

        let horizontalSpacing = 200;

        let verticalSpacing = 200;

        const requestNode: NapkinIDENode = {
            ID: `sys-${++sysCount}`,
            Type: 'request',
            ClassList: [],
            Data: {},
        };

        flow.Nodes = [requestNode];

        flow.Edges = [];

        let lastProjectSpacing = 0;

        //  Process for project nodes
        projLookups.forEach((projLookup: any, projectIndex: number) => {
            const project = eac.Projects![projLookup];

            //  Setup Project Node
            const projectNode = new NapkinIDENode();
            projectNode.Type = 'project';
            projectNode.ID = `${projectNode.Type}-${projLookup}`;
            projectNode.PositionX = lastProjectSpacing;
            projectNode.PositionY = verticalSpacing;
            projectNode.Data = {
                Lookup: projLookup,
                Name: project.Project?.Name,
                Hosts: project.Hosts,
                Button: {
                    Label: 'View',
                    URL: '/dashboard/project/' + `${projLookup} `,
                    Target: '_blank',
                },
            };

            //  Add application spacing
            // projectNode.PositionX +=
            //   ((project.ApplicationLookups.length - 1) * horizontalSpacing) / 2;

            flow.Nodes?.push(projectNode);

            //  Add Request => Project Edge
            flow.Edges?.push({
                ID: `sys-edge-${++sysCount}`,
                NodeInID: requestNode.ID,
                NodeOutID: projectNode.ID,
            });

            // Setup Route Filters
            // debugger;
            let maxRouteParts = 0;

            let appRoutePartMap: { [appLookup: string]: string[] } =
                project.ApplicationLookups?.reduce((map, appLookup, i) => {
                    const app = eac.Applications![appLookup];

                    var path = app.LookupConfig!.PathRegex;

                    if (path.endsWith('.*')) {
                        path = path.substring(0, path.length - 2);
                    }

                    if (path.endsWith('/')) {
                        path = path.substring(0, path.length - 1);
                    }

                    map[appLookup] = path.split('/').map((pr) => {
                        return `/${pr}`;
                    });

                    let routePartType = 'path';

                    if (app.LookupConfig!.QueryRegex) {
                        map[appLookup]?.push(
                            `?${app.LookupConfig!.QueryRegex!}`
                        );

                        routePartType = 'query';
                    }

                    if (app.LookupConfig!.HeaderRegex) {
                        map[appLookup]?.push(
                            `[${app.LookupConfig!.HeaderRegex!}]`
                        );

                        routePartType = 'header';
                    }

                    if (app.LookupConfig!.UserAgentRegex) {
                        map[appLookup]?.push(
                            `#${app.LookupConfig!.UserAgentRegex!}`
                        );

                        routePartType = 'user-agent';
                    }

                    if (map[appLookup].length > maxRouteParts) {
                        maxRouteParts = map[appLookup].length;
                    }

                    return map;
                }, {});

            var routePartsIteration = 0;

            maxRouteParts++;

            let lastRoutePartNodeIdMap: { [appLookup: string]: string } =
                project.ApplicationLookups?.reduce((map, appLookup, i) => {
                    map[appLookup] = projectNode.ID;

                    return map;
                }, {});

            var sortedProjectApps = project.ApplicationLookups?.sort((a, b) => {
                const aRouteParts = appRoutePartMap[a].join('');

                const bRouteParts = appRoutePartMap[b].join('');

                if (aRouteParts < bRouteParts) {
                    return -1;
                }
                if (aRouteParts > bRouteParts) {
                    return 1;
                }
                return 0;
                // return aRouteParts.length == bRouteParts.length
                //   ? 0
                //   : aRouteParts.length > bRouteParts.length
                //   ? 1
                //   : -1;
            });

            do {
                let lastRouteNodeBank: {
                    [lastRoutePartNodeId: string]: {
                        [routePart: string]: NapkinIDENode;
                    };
                } = {};

                let routeHorizCount = 0;

                sortedProjectApps?.forEach((appLookup) => {
                    const app = eac.Applications![appLookup];

                    let lastRoutePartNodeId = lastRoutePartNodeIdMap[appLookup];

                    lastRouteNodeBank[lastRoutePartNodeId] =
                        lastRouteNodeBank[lastRoutePartNodeId] || {};

                    const routeParts = appRoutePartMap[appLookup];

                    const currentRoutePart =
                        routeParts.length > routePartsIteration
                            ? routeParts[routePartsIteration]
                            : null;

                    if (currentRoutePart != null) {
                        //  Process route part connection to previous node
                        // console.log("current route part: ", currentRoutePart);
                        const routePartType = `route-filter`;
                        const routePartNodeId = `${routePartType}-${routePartsCount}`;

                        let routePartNode =
                            lastRouteNodeBank[lastRoutePartNodeId][
                                currentRoutePart
                            ] || null;

                        if (routePartNode === null) {
                            routePartNode = new NapkinIDENode();
                            routePartNode.Type = routePartType;
                            routePartNode.ID = routePartNodeId;
                            routePartNode.PositionX =
                                horizontalSpacing * routeHorizCount +
                                lastProjectSpacing;
                            routePartNode.PositionY =
                                verticalSpacing * (2 + routePartsIteration);
                            routePartNode.Data = {
                                Route: currentRoutePart,
                                Type: routePartType,
                                // Link: {
                                //   Label: 'currentRoutePart',
                                //   URL: 'dashboard/routes' + '/%2F/' +  `${ projLookup }`,
                                //   Target: '_blank'
                                // },
                                Button: {
                                    Label: currentRoutePart,

                                    /**
                                     * URL with currentRoutePart doesn't work in the browser
                                     * URL: 'dashboard/routes' + `${ currentRoutePart }` +  `${ projLookup }`,
                                     * https://localhost:44358/dashboard/routes/beff00a4-6181-48ce-a0f6-370e53b5e388,
                                     *
                                     * with %2F hardcoded the link works
                                     * https://localhost:44358/dashboard/routes/%2F/daed4b64-f5e8-4ef4-933c-cfa652a4c3a3
                                     *
                                     * Shannon
                                     */

                                    URL:
                                        '/dashboard/route' +
                                        '/%2F' +
                                        `${currentRoutePart.substring(1)}` +
                                        '/' +
                                        `${projLookup}`,
                                    Target: '_blank',
                                },
                            };

                            flow.Nodes?.push(routePartNode);

                            lastRouteNodeBank[lastRoutePartNodeId][
                                currentRoutePart
                            ] = routePartNode;
                        }

                        //  Add last route part => new route part Edge
                        flow.Edges?.push({
                            ID: `sys-edge-${++sysCount}`,
                            NodeInID: lastRoutePartNodeId,
                            NodeOutID: routePartNode.ID,
                        });

                        lastRoutePartNodeIdMap[appLookup] = routePartNode.ID;

                        routePartsCount++;
                    } else {
                        // Process application connection to previous node
                        var appNodeType = 'application';

                        var id = `${appNodeType}-${appLookup}`;

                        var existingApp = this.loadExistingNode(flow, id);

                        if (existingApp == null) {
                            //  Setup Application Nodes
                            // debugger;
                            const appNode = new NapkinIDENode();
                            appNode.Type = appNodeType;
                            appNode.ID = id;
                            appNode.PositionX =
                                horizontalSpacing * routeHorizCount +
                                lastProjectSpacing;
                            appNode.PositionY =
                                verticalSpacing * (1 + maxRouteParts);
                            appNode.Data = {
                                Name: app.Application?.Name,
                                Details: app.Application,
                                Processor: app.Processor,
                                Button: {
                                    Label: 'View',
                                    URL:
                                        '/dashboard/application/' +
                                        `${appLookup}` +
                                        '/%2F/' +
                                        `${projLookup}`,
                                    Target: '_blank',
                                },
                            };

                            flow.Nodes?.push(appNode);

                            //  Add last route part => Application Edge
                            flow.Edges?.push({
                                ID: `sys-edge-${++sysCount}`,
                                NodeInID: lastRoutePartNodeId,
                                NodeOutID: appNode.ID,
                            });

                            appsCount++;
                        }
                    }

                    routeHorizCount++;
                });

                routePartsIteration++;
            } while (maxRouteParts > routePartsIteration);

            //  Process for application security nodes
            project.ApplicationLookups?.forEach((appLookup) => {
                const app = eac.Applications![appLookup];
                // const projectNode = new NapkinIDENode();
                // projectNode.Type = 'project';
                // projectNode.ID = `${projectNode.Type}-${projLookup}`;
                // projectNode.PositionX = lastProjectSpacing;
                // projectNode.PositionY = verticalSpacing;
                // projectNode.Data = {
                //   Lookup: projLookup,
                //   Name: project.Project?.Name,
                //   Hosts: project.Hosts,
                //   Link: {
                //     Label: 'Launch',
                //     URL: project.Hosts[0],
                //     Target: '_blank'
                //   }
                // };
                //  Setup AppLookupConfig Nodes
                //  Setup Security Filters
                // app.AccessRightLookups;
                // app.LookupConfig.AccessRightsAllAny;
                // app.LookupConfig.IsPrivate;
                // app.LookupConfig.IsTriggerSignIn;
                // app.LookupConfig.LicensesAllAny;
                // app.LicenseConfigurationLookups;
            });

            lastProjectSpacing +=
                project.ApplicationLookups.length * horizontalSpacing;
        });

        //  Setup DevOps nodes (Source Control and DevOpsActions)...  relate apps to source control via edges

        // //  Add project spacing
        // requestNode.PositionX = lastProjectSpacing / 2;
    }

    protected loadExistingNode(flow: NapkinIDEFlow, id: string): NapkinIDENode {
        return <NapkinIDENode>flow.Nodes?.find((node) => node.ID === id);
    }
}
