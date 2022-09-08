import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Input, OnInit } from '@angular/core';
import {
    MatTreeFlatDataSource,
    MatTreeFlattener,
} from '@angular/material/tree';
import { EaCApplicationAsCode, EaCProjectAsCode } from '@semanticjs/common';
import { FlatNode, TreeNode } from '../../models/tree-node.model';
import { EaCService } from '../../services/eac.service';
import { SocialUIService } from '../../services/social-ui.service';

@Component({
    selector: 'lcu-project-card',
    templateUrl: './project-card.component.html',
    styleUrls: ['./project-card.component.scss'],
})
export class ProjectCardComponent implements OnInit {
    @Input('applications-bank')
    public ApplicationsBank: Array<EaCApplicationAsCode>;

    @Input('loading')
    public Loading: boolean;

    @Input('project-lookups')
    public ProjectLookups: Array<string>;

    @Input('projects')
    public Projects: Array<EaCProjectAsCode>;

    private transformer = (node: TreeNode, level: number) => {
        return {
            expandable: !!node.children && node.children.length > 0,
            name: node.name,
            level: level,
            routerLink: node.routerLink,
            url: node.url,
            lookup: node.lookup,
            description: node.description,
        };
    };

    protected get Applications(): {
        [lookup: string]: EaCApplicationAsCode;
    } {
        const apps: { [lookup: string]: EaCApplicationAsCode } = {};

        this.Project?.ApplicationLookups?.forEach((appLookup: string) => {
            apps[appLookup] = this.ApplicationsBank[appLookup];
        });
        return apps;
    }

    protected get ApplicationRoutes(): Array<string> {
        return Object.keys(this.RoutedApplications || {});
    }

    protected get CurrentRouteApplicationLookups(): Array<string> {
        return Object.keys(this.RoutedApplications[this.AppRoute] || {});
    }

    protected get RoutedApplications(): {
        [route: string]: { [lookup: string]: EaCApplicationAsCode };
    } {
        const appLookups = Object.keys(this.Applications);

        const apps = appLookups.map(
            (appLookup) => this.Applications[appLookup]
        );

        let appRoutes =
            apps.map((app) => {
                // console.log("App from projects: ", app);
                return app?.LookupConfig?.PathRegex.replace('.*', '');
            }) || [];

        appRoutes = appRoutes.filter((ar) => ar != null);

        let routeBases: string[] = [];

        appRoutes.forEach((appRoute) => {
            const appRouteParts = appRoute.split('/');

            const appRouteBase = `/${appRouteParts[1]}`;

            if (routeBases.indexOf(appRouteBase) < 0) {
                routeBases.push(appRouteBase);
            }
        });

        let workingAppLookups = [...(appLookups || [])];

        routeBases = routeBases.sort((a, b) => b.localeCompare(a));

        const routeSet =
            routeBases.reduce((prevRouteMap, currentRouteBase) => {
                const routeMap = {
                    ...prevRouteMap,
                };

                const filteredAppLookups = workingAppLookups.filter((wal) => {
                    const wa = this.Applications[wal];

                    return wa?.LookupConfig?.PathRegex.startsWith(
                        currentRouteBase
                    );
                });

                routeMap[currentRouteBase] =
                    filteredAppLookups.reduce((prevAppMap, appLookup) => {
                        const appMap: any = {
                            ...prevAppMap,
                        };

                        appMap[appLookup] = this.Applications[appLookup];

                        return appMap;
                    }, {}) || {};

                workingAppLookups = workingAppLookups.filter((wa) => {
                    return filteredAppLookups.indexOf(wa) < 0;
                });

                return routeMap;
            }, {}) || {};

        let routeSetKeys = Object.keys(routeSet);

        routeSetKeys = routeSetKeys.sort((a, b) => a.localeCompare(b));

        const routeSetResult = {};

        routeSetKeys.forEach((rsk) => (routeSetResult[rsk] = routeSet[rsk]));

        // console.log("App Routes: ",routeSetResult)

        return routeSetResult;
    }

    treeControl = new FlatTreeControl<FlatNode>(
        (node: any) => node.level,
        (node: any) => node.expandable
    );

    treeFlattener = new MatTreeFlattener(
        this.transformer,
        (node) => node.level,
        (node) => node.expandable,
        (node) => node.children
    );

    public DataSource = new MatTreeFlatDataSource(
        this.treeControl,
        this.treeFlattener
    );

    @Input('project')
    public Project: EaCProjectAsCode;

    @Input('project-lookup')
    public ProjectLookup: string;

    public AppRoute: string;

    // public RoutedApplications: any;

    constructor() {}

    public HasChild = (_: number, node: FlatNode) => node.expandable;

    public ngOnInit(): void {}

    public ngOnChanges() {
        if (this.Projects && this.ProjectLookups && this.Applications) {
            let temp = this.BuildProjectTree();
            // console.log("to string: ", JSON.stringify(temp))

            if (JSON.stringify(this.DataSource.data) !== JSON.stringify(temp)) {
                // console.log('Its different')
                this.DataSource.data = temp;
            }
        }
    }

    public RouteToPath(path: string): void {
        window.location.href = path;
    }

    public BuildProjectTree(): Array<TreeNode> {
        console.log('calling build project tree');
        let tempTreeData: Array<TreeNode> = [];
        this.ProjectLookups?.forEach((pLookup: string) => {
            let tempProj = this.Projects[pLookup];
            this.Project = tempProj;
            let tempProjNode: TreeNode = {
                name: tempProj.Project.Name,
                description: tempProj.Project.Description,
                lookup: pLookup,
                url: 'https://' + tempProj.Hosts[tempProj?.Hosts?.length - 1],
                routerLink: ['/project', pLookup],
            };

            let tempRoutes = this.ApplicationRoutes;

            if (tempRoutes) {
                let tempProjChildren: Array<TreeNode> = [];
                tempRoutes.forEach((appRoute: string) => {
                    this.AppRoute = appRoute;
                    // routerLink: ['/route', this.AppRoute, pLookup],
                    let tempRouteNode: TreeNode = {
                        name: this.AppRoute,
                        url:
                            'https://' +
                            tempProj?.Hosts[tempProj?.Hosts?.length - 1] +
                            this.AppRoute,
                    };

                    let tempApps = this.CurrentRouteApplicationLookups;
                    if (tempApps) {
                        let tempRouteChildren: Array<TreeNode> = [];
                        tempApps.forEach((appLookup: string) => {
                            let tempApp =
                                this.RoutedApplications[this.AppRoute][
                                    appLookup
                                ];
                            let tempAppNode: TreeNode = {
                                lookup: appLookup,
                                name: tempApp.Application.Name,
                                url:
                                    'https://' +
                                    tempProj?.Hosts[
                                        tempProj?.Hosts?.length - 1
                                    ] +
                                    this.AppRoute,
                                description: tempApp.Application.Description,
                                routerLink: [
                                    '/application',
                                    appLookup,
                                    this.AppRoute,
                                    pLookup,
                                ],
                            };
                            tempRouteChildren.push(tempAppNode);
                        });
                        tempRouteNode.children = tempRouteChildren;
                    }
                    tempProjChildren.push(tempRouteNode);
                });
                tempProjNode.children = tempProjChildren;
            }
            tempTreeData.push(tempProjNode);
        });
        // console.log('THE TREE: ', tempTreeData);
        return tempTreeData;

        // return tempTreeData;
    }

    public BuildRouteTree() {
        console.log('called route tree');
        let tempTreeData: Array<TreeNode> = [];

        let tempRoutes = this.ApplicationRoutes;
        if (tempRoutes) {
            // let tempProjChildren: Array<TreeNode> = [];
            tempRoutes.forEach((appRoute: string) => {
                this.AppRoute = appRoute;

                let tempRouteNode: TreeNode = {
                    name: this.AppRoute,
                    url:
                        'https://' +
                        this.Project?.Hosts[this.Project?.Hosts?.length - 1] +
                        this.AppRoute,
                    routerLink: ['/route', this.AppRoute, this.ProjectLookup],
                };

                let tempApps = this.CurrentRouteApplicationLookups;
                if (tempApps) {
                    let tempRouteChildren: Array<TreeNode> = [];
                    tempApps.forEach((appLookup: string) => {
                        let tempApp =
                            this.RoutedApplications[this.AppRoute][appLookup];
                        let tempAppNode: TreeNode = {
                            lookup: appLookup,
                            name: tempApp.Application.Name,
                            url:
                                'https://' +
                                this.Project?.Hosts[
                                    this.Project?.Hosts?.length - 1
                                ] +
                                this.AppRoute,
                            description: tempApp.Application.Description,
                            routerLink: [
                                '/application',
                                appLookup,
                                this.AppRoute,
                                this.ProjectLookup,
                            ],
                        };
                        tempRouteChildren.push(tempAppNode);
                    });
                    tempRouteNode.children = tempRouteChildren;
                }
                tempTreeData.push(tempRouteNode);
            });
        }
        return tempTreeData;
    }

    public HandleRoute(route: string) {
        console.log('route: ', route);
    }
}
