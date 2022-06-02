import { Component } from '@angular/core';
import { EaCService } from 'projects/common/src/lib/services/eac.service';
import { ApplicationsFlowState } from 'projects/common/src/lib/state/applications-flow.state';

@Component({
    selector: 'lcu-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    public get State(): ApplicationsFlowState {
        return this.eacSvc.State;
    }

    constructor(protected eacSvc: EaCService) {
        this.eacSvc.LoadUserInfo();
    }

    public ReturnToDashboard() {
        window.location.href = '/dashboard';
    }
}
