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

    public CurrentRouteApplicationLookups: Array<string>;

    public IsSmScreen: boolean;

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

        if (this.RoutedApplications) {
            this.Routes = Object.keys(this.RoutedApplications || {});

            // console.log('routed apps: ', this.RoutedApplications);

            if (this.SelectedRoute) {
                // console.log('selected route: ', this.SelectedRoute)

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
    }

    public ngOnDestroy(): void {
        this.BPSub.unsubscribe();
    }

    public SetActiveEnterprise(entLookup: string): void {
        this.eacSvc.SetActiveEnterprise(entLookup).then(() => {});
    }

    protected determineLastLevel() {
        let lastLevel: string;
        if (this.Enterprise) {
            lastLevel = 'ent';
        } else if (this.ProjectLookup) {
            lastLevel = 'project';
        } else if (this.SelectedRoute) {
            lastLevel = 'route';
        } else if (this.SelectedApplication) {
            lastLevel = 'app';
        }
    }

    // protected async handleStateChange(): Promise<void> {}
}
