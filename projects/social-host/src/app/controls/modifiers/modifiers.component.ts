import {
    ApplicationsFlowState,
    DFSModifiersDialogComponent,
    EaCService,
} from '@lowcodeunit/applications-flow-common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'lcu-modifiers',
    templateUrl: './modifiers.component.html',
    styleUrls: ['./modifiers.component.scss'],
})
export class ModifiersComponent implements OnInit, OnDestroy {
    public ModifierLookups: Array<string>;

    public ProjectLookup: string;

    public ProjectLookups: Array<string>;

    public State: ApplicationsFlowState;

    public StateSub: Subscription;

    public SkeletonEffect: string;

    public Loading: boolean;

    constructor(
        private activatedRoute: ActivatedRoute,
        protected eacSvc: EaCService,
        protected dialog: MatDialog
    ) {
        this.SkeletonEffect = 'wave';

        this.activatedRoute.params.subscribe((params: any) => {
            // console.log('params: ', params);
            if (params) {
                this.ProjectLookup = params['projectLookup'];
            } else {
                this.ProjectLookup = null;
            }
            // console.log('pjl:', this.ProjectLookup);
        });
    }

    ngOnInit(): void {
        this.StateSub = this.eacSvc.State.subscribe(
            (state: ApplicationsFlowState) => {
                this.State = state;

                if (this.State?.EaC?.Modifiers) {
                    this.ModifierLookups = Object.keys(
                        this.State?.EaC?.Modifiers || {}
                    );
                }
                if (this.State?.EaC?.Projects) {
                    this.ProjectLookups = Object.keys(
                        this.State?.EaC?.Projects || {}
                    ).reverse();
                }

                this.Loading =
                    this.State?.LoadingActiveEnterprise ||
                    this.State?.LoadingEnterprises ||
                    this.State?.Loading;
            }
        );
    }

    public ngOnDestroy() {
        this.StateSub.unsubscribe();
    }

    public OpenModifierDialog(mdfrLookup: string, mdfrName: string) {
        // console.log('Modifier lookup: ', mdfrLookup);
        // throw new Error('Not implemented: OpenModifierDialog');
        let level: string;
        if (this.ProjectLookup) {
            level = 'project';
        } else {
            level = 'enterprise';
        }
        const dialogRef = this.dialog.open(DFSModifiersDialogComponent, {
            width: '600px',
            data: {
                modifierLookup: mdfrLookup,
                modifierName: mdfrName,
                modifiers: this.State?.EaC?.Modifiers,
                level: level,
                projectLookup: this.ProjectLookup,
            },
        });

        dialogRef.afterClosed().subscribe((result: any) => {
            // console.log('The dialog was closed');
            // console.log("result:", result)
        });
    }
}
