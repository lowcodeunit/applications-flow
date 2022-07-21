import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { EaCService } from '../../services/eac.service';
import { ApplicationsFlowState } from '../../state/applications-flow.state';

@Component({
    selector: 'lcu-dashboard-toolbar',
    templateUrl: './dashboard-toolbar.component.html',
    styleUrls: ['./dashboard-toolbar.component.scss'],
})
export class DashboardToolbarComponent implements OnInit {
    public get State(): ApplicationsFlowState {
        return this.eacSvc.State;
    }

    public get ProjectLookups(): string[] {
        // console.log("PJS: ",Object.keys(this.State?.EaC?.Projects || {}).reverse() )
        return Object.keys(this.State?.EaC?.Projects || {}).reverse();
    }

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
