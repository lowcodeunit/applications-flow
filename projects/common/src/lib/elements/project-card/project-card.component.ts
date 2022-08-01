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

        this.Project.ApplicationLookups?.forEach((appLookup: string) => {
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

    // public get DataTree():Array<TreeNode>{
    //   let tempTreeData: Array<TreeNode>= []
    //     this.ProjectLookups?.forEach((pLookup: string) => {
    //         let tempProj = this.Projects[pLookup];
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

    public RoutedApplications: any;

    constructor(
        protected eacSvc: EaCService,
        protected socialSvc: SocialUIService
    ) {}

    public HasChild = (_: number, node: FlatNode) => node.expandable;

    public ngOnInit(): void {}

    public ngOnChanges() {
        if (this.Applications) {
            this.RoutedApplications = this.eacSvc.GenerateRoutedApplications(
                this.Applications
            );
        }

        if (this.Projects && this.ProjectLookups && this.Applications) {
            this.BuildTree();
        }
    }

    public RouteToPath(path: string): void {
        window.location.href = path;
    }

    public BuildTree(): Array<TreeNode> {
        let tempTreeData: Array<TreeNode> = [];
        this.ProjectLookups?.forEach((pLookup: string) => {
            let tempProj = this.Projects[pLookup];
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
