import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, Input, OnInit } from '@angular/core';
import { EaCService } from '../../services/eac.service';

@Component({
    selector: 'lcu-dashboard-toolbar',
    templateUrl: './dashboard-toolbar.component.html',
    styleUrls: ['./dashboard-toolbar.component.scss'],
})
export class DashboardToolbarComponent implements OnInit {
    @Input('project-lookups')
    public ProjectLookups: Array<string>;

    @Input('loading')
    public Loading: boolean;

    // public get State(): ApplicationsFlowState {
    //     return this.eacSvc.State;
    // }

    // public get ProjectLookups(): string[] {
    //     // console.log("PJS: ",Object.keys(this.State?.EaC?.Projects || {}).reverse() )
    //     return Object.keys(this.State?.EaC?.Projects || {}).reverse();
    // }

    public IsSmScreen: boolean;

    constructor(
        public breakpointObserver: BreakpointObserver,
        protected eacSvc: EaCService
    ) {}

    ngOnInit(): void {
        this.breakpointObserver
            .observe(['(max-width: 959px)'])
            .subscribe((state: BreakpointState) => {
                if (state.matches) {
                    this.IsSmScreen = true;
                } else {
                    this.IsSmScreen = false;
                }
            });
    }
}
