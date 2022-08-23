import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
    MatTreeFlatDataSource,
    MatTreeFlattener,
} from '@angular/material/tree';
import { EaCApplicationAsCode, EaCProjectAsCode } from '@semanticjs/common';
import { NewApplicationDialogComponent } from '../../dialogs/new-application-dialog/new-application-dialog.component';
import { FlatNode, TreeNode } from '../../models/tree-node.model';

@Component({
    selector: 'lcu-route-card',
    templateUrl: './route-card.component.html',
    styleUrls: ['./route-card.component.scss'],
})
export class RouteCardComponent implements OnInit {
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

    @Input('applications-bank')
    public ApplicationsBank: Array<EaCApplicationAsCode>;

    @Input('loading')
    public Loading: boolean;

    protected get Applications(): {
        [lookup: string]: EaCApplicationAsCode;
    } {
        const apps: { [lookup: string]: EaCApplicationAsCode } = {};

        this.Project?.ApplicationLookups?.forEach((appLookup: string) => {
            apps[appLookup] = this.ApplicationsBank[appLookup];
        });
        return apps;
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
    public treeControl = new FlatTreeControl<FlatNode>(
        (node: any) => node.level,
        (node: any) => node.expandable
    );

    protected treeFlattener = new MatTreeFlattener(
        this.transformer,
        (node: any) => node.level,
        (node: any) => node.expandable,
        (node: any) => node.children
    );

    public DataSource = new MatTreeFlatDataSource(
        this.treeControl,
        this.treeFlattener
    );

    @Input('project')
    public Project: EaCProjectAsCode;

    @Input('project-lookup')
    public ProjectLookup: string;

    @Input('active-environment-lookup')
    public ActiveEnvironmentLookup: string;

    public ApplicationRoutes: Array<string>;

    public AppRoute: string;

    constructor(protected dialog: MatDialog) {}

    public HasChild = (_: number, node: FlatNode) => node.expandable;

    ngOnInit(): void {
        if (this.ProjectLookup && this.Project) {
            let temp = this.BuildRouteTree();

            if (JSON.stringify(this.DataSource.data) !== JSON.stringify(temp)) {
                // console.log('Its different: ', JSON.stringify(temp));
                this.DataSource.data = temp;
            }
        }
    }

    ngOnChanges() {}

    public BuildRouteTree() {
        // console.log('called route tree');
        let tempTreeData: Array<TreeNode> = [];

        this.ApplicationRoutes = Object.keys(this.RoutedApplications || {});
        if (this.ApplicationRoutes) {
            // let tempProjChildren: Array<TreeNode> = [];
            this.ApplicationRoutes.forEach((appRoute: string) => {
                this.AppRoute = appRoute;
                // routerLink: ['/route', this.AppRoute, this.ProjectLookup],

                let tempRouteNode: TreeNode = {
                    name: this.AppRoute,
                    url:
                        'https://' +
                        this.Project?.Hosts[this.Project?.Hosts?.length - 1] +
                        this.AppRoute,
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
        // console.log('route: ', route);
    }

    public OpenNewAppDialog(event: any) {
        const dialogRef = this.dialog.open(NewApplicationDialogComponent, {
            width: '600px',
            data: {
                projectLookup: this.ProjectLookup,
                environmentLookup: this.ActiveEnvironmentLookup,
            },
        });

        dialogRef.afterClosed().subscribe((result: any) => {
            // console.log('The dialog was closed');
            // console.log("result:", result)
        });
    }
}
