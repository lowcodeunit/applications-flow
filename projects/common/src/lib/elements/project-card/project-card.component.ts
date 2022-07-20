import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import {
    MatTreeFlatDataSource,
    MatTreeFlattener,
} from '@angular/material/tree';
import { EaCApplicationAsCode, EaCProjectAsCode } from '@semanticjs/common';
import { FlatNode, TreeNode } from '../../models/tree-node.model';
import { EaCService } from '../../services/eac.service';
import { SocialUIService } from '../../services/social-ui.service';
import { ApplicationsFlowState } from '../../state/applications-flow.state';

@Component({
    selector: 'lcu-project-card',
    templateUrl: './project-card.component.html',
    styleUrls: ['./project-card.component.scss'],
})
export class ProjectCardComponent implements OnInit {
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
    public get ProjectLookups(): string[] {
        return Object.keys(this.State?.EaC?.Projects || {}).reverse();
    }

    public get State(): ApplicationsFlowState {
        return this.eacSvc?.State;
    }

    public get ApplicationsBank(): { [lookup: string]: EaCApplicationAsCode } {
        return this.State?.EaC?.Applications || {};
    }

    public get ApplicationLookups(): string[] {
        return Object.keys(this.Project.ApplicationLookups || {});
    }

    public get Applications(): {
        [lookup: string]: EaCApplicationAsCode;
    } {
        const apps: { [lookup: string]: EaCApplicationAsCode } = {};

        this.Project.ApplicationLookups?.forEach((appLookup: string) => {
            apps[appLookup] = this.ApplicationsBank[appLookup];
        });
        return apps;
    }

    public get ApplicationRoutes(): Array<string> {
        return Object.keys(this.RoutedApplications || {});
    }

    public get CurrentRouteApplicationLookups(): Array<string> {
        return Object.keys(this.RoutedApplications[this.AppRoute] || {});
    }

    public get RoutedApplications(): {
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

    // public get DataTree():Array<TreeNode>{
    //   let tempTreeData: Array<TreeNode>= []
    //     this.ProjectLookups?.forEach((pLookup: string) => {
    //         let tempProj = this.State?.EaC?.Projects[pLookup];
    //         this.Project = tempProj;
    //         let tempProjNode: TreeNode = {
    //             name: tempProj.Project.Name,
    //             description: tempProj.Project.Description,
    //             lookup: pLookup,
    //             url: 'https://' + tempProj.Hosts[tempProj?.Hosts?.length - 1],
    //             routerLink: "['/project'/" + pLookup + ']',
    //         };

    //         let tempRoutes = this.ApplicationRoutes;
    //         console.log('temp Routes: ', tempRoutes);

    //         if (tempRoutes) {
    //             let tempProjChildren: Array<TreeNode> = [];
    //             tempRoutes.forEach((appRoute: string) => {
    //                 this.AppRoute = appRoute;
    //                 console.log("approute = ", this.AppRoute)

    //                 let tempRouteNode: TreeNode = {
    //                     name: this.AppRoute,
    //                     url:
    //                         'https://' +
    //                         tempProj?.Hosts[tempProj?.Hosts?.length - 1] + "/" +
    //                         appRoute,
    //                     routerLink:
    //                         "['/route'/" + this.AppRoute + '/' + pLookup + ']',
    //                 };
    //                 let tempApps = this.CurrentRouteApplicationLookups;
    //                 console.log("temp apps: ", tempApps);
    //                 if (tempApps) {
    //                     let tempRouteChildren: Array<TreeNode> = [];
    //                     tempApps.forEach((appLookup: string) => {
    //                         let tempApp =
    //                             this.RoutedApplications[this.AppRoute][appLookup];
    //                         console.log('tempApp: ', tempApp);
    //                         let tempAppNode: TreeNode = {
    //                             lookup: appLookup,
    //                             name: tempApp.Application.Name,
    //                             url:
    //                                 'https://' +
    //                                 tempProj?.Hosts[
    //                                     tempProj?.Hosts?.length - 1
    //                                 ],
    //                             description: tempApp.Application.Description,
    //                             routerLink:
    //                                 "['/application/'" +
    //                                 appLookup +
    //                                 '/' +
    //                                 this.AppRoute +
    //                                 '/' +
    //                                 pLookup +
    //                                 ']',
    //                         };
    //                         console.log('temp App Node: ', tempAppNode);
    //                         tempRouteChildren.push(tempAppNode);
    //                     });
    //                     tempRouteNode.children = tempRouteChildren;
    //                 }
    //                 tempProjChildren.push(tempRouteNode);
    //             });
    //             tempProjNode.children = tempProjChildren;
    //         }
    //         tempTreeData.push(tempProjNode);
    //     });
    //     console.log('THE TREE: ', tempTreeData);
    //     this.DataSource.data = tempTreeData;

    //     return tempTreeData;
    // }

    treeControl = new FlatTreeControl<FlatNode>(
        (node) => node.level,
        (node) => node.expandable
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

    public Project: EaCProjectAsCode;

    public AppRoute: string;

    // public State: ApplicationsFlowState;

    constructor(
        protected eacSvc: EaCService,
        protected socialSvc: SocialUIService
    ) {
        // this.TreeData = new Array<TreeNode>();
        //   socialSvc.stateChangeEmitted$.subscribe((state: ApplicationsFlowState) => {
        //     this.State = state;
        //     if(state){
        //       this.BuildTree();
        //     }
        // });
    }

    public HasChild = (_: number, node: FlatNode) => node.expandable;

    public ngOnInit(): void {}

    public RouteToPath(path: string): void {
        window.location.href = path;
    }

    public BuildTree(): Array<TreeNode> {
        let tempTreeData: Array<TreeNode> = [];
        this.ProjectLookups?.forEach((pLookup: string) => {
            let tempProj = this.State?.EaC?.Projects[pLookup];
            this.Project = tempProj;
            let tempProjNode: TreeNode = {
                name: tempProj.Project.Name,
                description: tempProj.Project.Description,
                lookup: pLookup,
                url: 'https://' + tempProj.Hosts[tempProj?.Hosts?.length - 1],
                routerLink: "['/project'/" + pLookup + ']',
            };

            let tempRoutes = this.ApplicationRoutes;
            console.log('temp Routes: ', tempRoutes);

            if (tempRoutes) {
                let tempProjChildren: Array<TreeNode> = [];
                tempRoutes.forEach((appRoute: string) => {
                    this.AppRoute = appRoute;
                    console.log('approute = ', this.AppRoute);

                    let tempRouteNode: TreeNode = {
                        name: this.AppRoute,
                        url:
                            'https://' +
                            tempProj?.Hosts[tempProj?.Hosts?.length - 1] +
                            '/' +
                            appRoute,
                        routerLink:
                            "['/route'/" + this.AppRoute + '/' + pLookup + ']',
                    };
                    let tempApps = this.CurrentRouteApplicationLookups;
                    console.log('temp apps: ', tempApps);
                    if (tempApps) {
                        let tempRouteChildren: Array<TreeNode> = [];
                        tempApps.forEach((appLookup: string) => {
                            let tempApp =
                                this.RoutedApplications[this.AppRoute][
                                    appLookup
                                ];
                            console.log('tempApp: ', tempApp);
                            let tempAppNode: TreeNode = {
                                lookup: appLookup,
                                name: tempApp.Application.Name,
                                url:
                                    'https://' +
                                    tempProj?.Hosts[
                                        tempProj?.Hosts?.length - 1
                                    ],
                                description: tempApp.Application.Description,
                                routerLink:
                                    "['/application/'" +
                                    appLookup +
                                    '/' +
                                    this.AppRoute +
                                    '/' +
                                    pLookup +
                                    ']',
                            };
                            console.log('temp App Node: ', tempAppNode);
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
        console.log('THE TREE: ', tempTreeData);
        this.DataSource.data = tempTreeData;

        return tempTreeData;
    }

    public HandleRoute(route: string) {
        console.log('route: ', route);
    }
}
