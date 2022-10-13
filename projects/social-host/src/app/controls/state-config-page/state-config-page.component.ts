import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Status } from '@lcu/common';
import {
    ApplicationsFlowState,
    EaCService,
    StateConfigFormComponent,
} from '@lowcodeunit/applications-flow-common';
import {
    EaCApplicationAsCode,
    EaCDataToken,
    EaCProjectAsCode,
} from '@semanticjs/common';
import { Subscription } from 'rxjs';

@Component({
    selector: 'lcu-state-config-page',
    templateUrl: './state-config-page.component.html',
    styleUrls: ['./state-config-page.component.scss'],
})
export class StateConfigPageComponent implements OnInit {
    @ViewChild(StateConfigFormComponent)
    public StateConfigForm: StateConfigFormComponent;

    public get StateConfigFormControl(): AbstractControl {
        return this.StateConfigForm?.StateConfigForm;
    }

    public StateConfig: EaCDataToken;

    public Application: EaCApplicationAsCode;

    public ApplicationLookup: string;

    public ErrorMessage: string;

    public State: ApplicationsFlowState;

    public StateSub: Subscription;

    public Project: EaCProjectAsCode;

    public ProjectLookup: string;

    constructor(
        protected activatedRoute: ActivatedRoute,
        protected eacSvc: EaCService,
        protected snackBar: MatSnackBar
    ) {
        this.activatedRoute.params.subscribe((params: any) => {
            this.ProjectLookup = params['projectLookup'];
            this.ApplicationLookup = params['appLookup'];
        });
    }

    public ngOnInit(): void {
        this.StateSub = this.eacSvc.State.subscribe(
            (state: ApplicationsFlowState) => {
                this.State = state;
                if (this.State?.EaC?.Applications) {
                    this.Application =
                        this.State?.EaC?.Applications[this.ApplicationLookup];
                }

                this.Project =
                    this.State?.EaC?.Projects[this.ProjectLookup] || {};

                if (this.Project?.DataTokens['lcu-state-config']) {
                    this.StateConfig =
                        this.Project?.DataTokens['lcu-state-config'];
                } else if (this.Application?.DataTokens['lcu-state-config']) {
                    this.StateConfig =
                        this.Application?.DataTokens['lcu-state-config'];
                } else {
                    this.StateConfig = null;
                }
            }
        );
    }

    public ngOnDestroy(): void {
        this.StateSub.unsubscribe();
    }

    public HandleStatusEvent(res: Status) {
        if (res.Code === 0) {
            this.snackBar.open('State Config Succesfully Updated', 'Dismiss', {
                duration: 5000,
            });
        } else {
            this.ErrorMessage = res.Message;
        }
    }

    public SaveStateConfig() {
        this.StateConfigForm?.SaveStateConfig();
    }
}
