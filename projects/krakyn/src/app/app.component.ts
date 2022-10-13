import { Component } from '@angular/core';
import { EaCService } from 'projects/common/src/lib/services/eac.service';
import { ApplicationsFlowState } from 'projects/common/src/lib/state/applications-flow.state';

@Component({
    selector: 'lcu-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    public State: ApplicationsFlowState;

    constructor(protected eacSvc: EaCService) {
        this.eacSvc.LoadUserInfo();
        this.eacSvc.State.subscribe((state) => {
            this.State = state;
        });
    }

    public ReturnToDashboard() {
        window.location.href = '/dashboard';
    }
}
