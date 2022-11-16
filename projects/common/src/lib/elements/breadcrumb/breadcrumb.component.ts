import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { EaCApplicationAsCode, EaCProjectAsCode } from '@semanticjs/common';
import { Subscribable, Subscription } from 'rxjs';
import { EaCService } from '../../services/eac.service';

@Component({
    selector: 'lcu-breadcrumb',
    templateUrl: './breadcrumb.component.html',
    styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent implements OnInit, OnDestroy {
    @Input('application-lookup')
    public ApplicationLookup: string;

    @Input('enterprise')
    public Enterprise: any;

    @Input('enterprises')
    public Enterprises: Array<any>;

    @Input('loading')
    public Loading: boolean;

    @Input('projects')
    public Projects: any;

    @Input('project-lookup')
    public ProjectLookup: string;

    @Input('routed-application')
    public RoutedApplications: {
        [route: string]: { [lookup: string]: EaCApplicationAsCode };
    };

    @Input('selected-route')
    public SelectedRoute: string;

    @Input('applications-bank')
    public ApplicationsBank: { [lookup: string]: EaCApplicationAsCode };

    public Applications: { [lookup: string]: EaCApplicationAsCode };

    public BPSub: Subscription;

    public CurrentLevel: string;

    public CurrentRouteApplicationLookups: Array<string>;

    public IsSmScreen: boolean;

    public ReturnRouterLink: any;

    public Routes: Array<string>;

    public SelectedProject: EaCProjectAsCode;

    public SkeletonEffect: string;

    public SelectedApplication: EaCApplicationAsCode;

    public ProjectLookups: Array<string>;

    constructor(
        protected eacSvc: EaCService,
        public breakpointObserver: BreakpointObserver
    ) {
        this.SkeletonEffect = 'wave';
    }

    ngOnInit(): void {
        this.BPSub = this.breakpointObserver
            .observe(['(max-width: 959px)'])
            .subscribe((state: BreakpointState) => {
                if (state.matches) {
                    this.IsSmScreen = true;
                } else {
                    this.IsSmScreen = false;
                }

                if (this.IsSmScreen) {
                    this.CurrentLevel = this.determineCurrentLevel();

                    this.ReturnRouterLink = this.determineReturnRouterLink();
                }
            });
    }

    ngOnChanges() {
        if (this.ApplicationsBank && this.ApplicationLookup) {
            this.SelectedApplication =
                this.ApplicationsBank[this.ApplicationLookup];
        }

        if (this.Projects) {
            this.ProjectLookups = Object.keys(this.Projects || {});

            if (this.ProjectLookup) {
                this.SelectedProject = this.Projects[this.ProjectLookup];
            }
        }

        if (
            this.RoutedApplications &&
            Object.keys(this.RoutedApplications)?.length !== 0
        ) {
            this.Routes = Object.keys(this.RoutedApplications || {});

            // console.log('routed apps: ', this.RoutedApplications);

            if (this.SelectedRoute) {
                // console.log('selected route: ', this.SelectedRoute);

                this.CurrentRouteApplicationLookups =
                    Object.keys(this.RoutedApplications[this.SelectedRoute]) ||
                    [];
            }
        }

        if (this.SelectedProject && this.ApplicationsBank) {
            this.Applications = {};

            this.SelectedProject?.ApplicationLookups?.forEach(
                (appLookup: string) => {
                    this.Applications[appLookup] =
                        this.ApplicationsBank[appLookup];
                }
            );
        }

        if (this.IsSmScreen) {
            this.CurrentLevel = this.determineCurrentLevel();

            this.ReturnRouterLink = this.determineReturnRouterLink();
        }
        // console.log('Enterprises: ', this.Enterprises);
    }

    public ngOnDestroy(): void {
        this.BPSub.unsubscribe();
    }

    public SetActiveEnterprise(entLookup: string): void {
        this.eacSvc.SetActiveEnterprise(entLookup).then(() => {});
    }

    protected determineCurrentLevel(): string {
        let lastLevel: string;
        if (this.Enterprise) {
            lastLevel = 'ent';
        }
        if (this.ProjectLookup) {
            lastLevel = 'project';
        }
        if (this.SelectedRoute) {
            lastLevel = 'route';
        }
        if (this.SelectedApplication) {
            lastLevel = 'app';
        }
        return lastLevel;
    }

    protected determineReturnRouterLink(): any {
        let rLink;
        if (this.Enterprise) {
            rLink = null;
        }
        if (this.ProjectLookup) {
            rLink = ['/enterprise'];
        }
        if (this.SelectedRoute) {
            rLink = ['/project', this.ProjectLookup];
        }
        if (this.SelectedApplication) {
            // rLink = ['/project', this.ProjectLookup];

            rLink = ['/route', this.SelectedRoute, this.ProjectLookup];
        }
        console.log('rlink: ', rLink);
        return rLink;
    }

    // protected async handleStateChange(): Promise<void> {}
}
