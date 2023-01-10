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
import { SocialUIService } from 'projects/common/src/lib/services/social-ui.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'lcu-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy, OnInit {
    protected feedCheckInterval: any;

    protected initialized: boolean;

    public RouterSub: Subscription;

    public State: ApplicationsFlowState;

    public StateSub: Subscription;

    public IsSmScreen: boolean;

    public IoTConfig: LazyElementConfig;

    public EntPath: string;

    constructor(
        public breakpointObserver: BreakpointObserver,
        protected serviceSettings: LCUServiceSettings,
        protected eacSvc: EaCService,
        protected http: HttpClient,
        protected router: Router,
        protected activatedRoute: ActivatedRoute,
        protected socialSvc: SocialUIService
    ) {
        this.RouterSub = router.events.subscribe(async (event: RouterEvent) => {
            let changed = event instanceof NavigationEnd; //ActivationEnd

            if (changed) {
                if (this.State?.EaC) {
                    console.log('calling from here 1');
                    await Promise.all([
                        this.eacSvc.GetActiveEnterprise(),
                        // this.eacSvc.LoadEnterpriseAsCode(),
                        // this.eacSvc.LoadUserFeed(1, 25, false),
                    ]);
                    await Promise.all([
                        this.eacSvc.LoadEnterpriseAsCode(),
                        this.eacSvc.LoadUserFeed(1, 25, false),
                    ]);
                } else if (!this.initialized) {
                    // console.log("refresh")
                    console.log('calling from here 2');

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
                            this.eacSvc.LoadUserFeed(
                                1,
                                25,
                                false,
                                localStorage.getItem('activeFilter')
                                    ? localStorage.getItem('activeFilter')
                                    : ''
                            ),
                            this.eacSvc.LoadUserInfo(),
                        ]).catch((err) => {
                            console.log(err);
                        });
                    }

                    if (!this.feedCheckInterval) {
                        this.feedCheckInterval = setInterval(() => {
                            console.log('interval called');
                            this.eacSvc.LoadUserFeed(
                                1,
                                25,
                                true,
                                localStorage.getItem('activeFilter')
                                    ? localStorage.getItem('activeFilter')
                                    : ''
                            );
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

        this.RouterSub.unsubscribe();
        this.StateSub.unsubscribe();
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

        this.StateSub = this.eacSvc.State.subscribe(
            (state: ApplicationsFlowState) => {
                this.State = state;
                console.log('STATE CHANGED APP LEVEL: ', this.State);
            }
        );
        this.handleStateChange().then((eac) => {});
    }

    protected async handleStateChange(): Promise<void> {
        this.State.Loading = true;

        this.loadScripts();

        this.loadStyles();

        // this.eacSvc.SetActiveEnterprise(this.State?.Enterprises[0].Lookup);
        // console.log('state = ', this.State);
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
