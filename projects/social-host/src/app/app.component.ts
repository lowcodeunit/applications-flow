import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    ActivatedRoute,
    NavigationEnd,
    Router,
    RouterEvent,
} from '@angular/router';
import { LCUServiceSettings } from '@lcu/common';
import {
    ApplicationsFlowState,
    EaCService,
} from '@lowcodeunit/applications-flow-common';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { LazyElementConfig } from '@lowcodeunit/lazy-element';

@Component({
    selector: 'lcu-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy, OnInit {
    protected feedCheckInterval: any;

    protected initialized: boolean;

    public get State(): ApplicationsFlowState {
        return this.eacSvc.State;
    }

    public IsSmScreen: boolean;

    public IoTConfig: LazyElementConfig;

    constructor(
        public breakpointObserver: BreakpointObserver,
        protected serviceSettings: LCUServiceSettings,
        protected eacSvc: EaCService,
        protected http: HttpClient,
        protected router: Router,
        protected activatedRoute: ActivatedRoute
    ) {
        router.events.subscribe(async (event: RouterEvent) => {
            let changed = event instanceof NavigationEnd; //ActivationEnd

            if (changed) {
                if (this.State?.EaC) {
                    await Promise.all([
                        this.eacSvc.LoadEnterpriseAsCode(),
                        this.eacSvc.LoadUserFeed(1, 25, false),
                    ]);
                } else if (!this.initialized) {
                    this.initialized = true;

                    await Promise.all([
                        this.eacSvc.HasValidConnection(),
                        this.eacSvc.EnsureUserEnterprise(),
                    ]).catch((err) => {
                        console.log(err);
                    });
                    await Promise.all([
                        this.eacSvc.LoadEnterpriseAsCode(),
                        this.eacSvc.ListEnterprises(),
                        this.eacSvc.GetActiveEnterprise(),
                    ]).catch((err) => {
                        console.log(err);
                    });

                    if (this.State?.EaC) {
                        await Promise.all([
                            this.eacSvc.LoadUserFeed(1, 25, false),
                            this.eacSvc.LoadUserInfo(),
                        ]).catch((err) => {
                            console.log(err);
                        });
                    }

                    if (!this.feedCheckInterval) {
                        this.feedCheckInterval = setInterval(() => {
                            this.eacSvc.LoadUserFeed(1, 25, true);
                        }, 120 * 1000);
                    }
                }
            }
        });

        this.IoTConfig = {
            Scripts: [
                '/_lcu/lcu-device-data-flow-lcu/wc/lcu-device-data-flow.lcu.js',
            ],
            Styles: [
                '/_lcu/lcu-device-data-flow-lcu/wc/lcu-device-data-flow.lcu.css',
            ],
            ElementName: 'lcu-device-data-flow-manage-element',
        };
    }

    public ngOnDestroy(): void {
        if (this.feedCheckInterval) {
            clearInterval(this.feedCheckInterval);
        }
    }

    public ngOnInit(): void {
        this.breakpointObserver
            .observe(['(max-width: 959px)'])
            .subscribe((state: BreakpointState) => {
                if (state.matches) {
                    this.IsSmScreen = true;
                } else {
                    this.IsSmScreen = false;
                }
            });

        this.handleStateChange().then((eac) => {});
    }

    protected async handleStateChange(): Promise<void> {
        this.State.Loading = true;

        this.loadScripts();

        this.loadStyles();

        // this.eacSvc.SetActiveEnterprise(this.State?.Enterprises[0].Lookup);
        console.log('state = ', this.State);
        // console.log("enterprise = ", this.State?.Enterprises)
    }

    protected loadScripts() {
        for (let script of this.IoTConfig.Scripts) {
            let node = document.createElement('script'); // creates the script tag
            node.src = script; // sets the source (insert url in between quotes)
            node.type = 'text/javascript'; // set the script type
            node.async = true; // makes script run asynchronously
            node.charset = 'utf-8';
            // append to head of document
            document.getElementsByTagName('head')[0].appendChild(node);
        }
    }

    protected loadStyles() {
        for (let style of this.IoTConfig.Styles) {
            let node = document.createElement('link'); // creates the script tag
            node.href = style; // sets the source (insert url in between quotes)
            node.type = 'text/css'; // set the script type
            // append to head of document
            document.getElementsByTagName('head')[0].appendChild(node);
        }
    }
}
