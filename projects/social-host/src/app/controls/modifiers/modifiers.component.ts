import {
    ApplicationsFlowState,
    DFSModifiersDialogComponent,
    EaCService,
} from '@lowcodeunit/applications-flow-common';
import { Component, OnInit } from '@angular/core';
import { EaCDFSModifier } from '@semanticjs/common';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'lcu-modifiers',
    templateUrl: './modifiers.component.html',
    styleUrls: ['./modifiers.component.scss'],
})
export class ModifiersComponent implements OnInit {
    public ModifierLookups: Array<string>;

    public ProjectLookups: Array<string>;

    public State: ApplicationsFlowState;

    public SkeletonEffect: string;

    constructor(protected eacSvc: EaCService, protected dialog: MatDialog) {
        this.SkeletonEffect = 'wave';
    }

    ngOnInit(): void {
        this.eacSvc.State.subscribe((state) => {
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
        });
    }

    public OpenModifierDialog(mdfrLookup: string, mdfrName: string) {
        console.log('Modifier lookup: ', mdfrLookup);
        // throw new Error('Not implemented: OpenModifierDialog');
        const dialogRef = this.dialog.open(DFSModifiersDialogComponent, {
            width: '600px',
            data: {
                modifierLookup: mdfrLookup,
                modifierName: mdfrName,
                modifiers: this.State?.EaC?.Modifiers,
                level: 'enterprise',
            },
        });

        dialogRef.afterClosed().subscribe((result: any) => {
            // console.log('The dialog was closed');
            // console.log("result:", result)
        });
    }
}
