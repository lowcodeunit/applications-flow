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
    public get Modifiers(): { [lookup: string]: EaCDFSModifier } {
        return this.State?.EaC?.Modifiers || {};
    }

    public get ModifierLookups(): Array<string> {
        return Object.keys(this.Modifiers || {});
    }

    public get State(): ApplicationsFlowState {
        return this.eacSvc?.State;
    }

    public SkeletonEffect: string;
    constructor(protected eacSvc: EaCService, protected dialog: MatDialog) {
        this.SkeletonEffect = 'wave';
    }

    ngOnInit(): void {}

    public OpenModifierDialog(mdfrLookup: string, mdfrName: string) {
        console.log('Modifier lookup: ', mdfrLookup);
        // throw new Error('Not implemented: OpenModifierDialog');
        const dialogRef = this.dialog.open(DFSModifiersDialogComponent, {
            width: '600px',
            data: {
                modifierLookup: mdfrLookup,
                modifierName: mdfrName,
                modifiers: this.Modifiers,
                level: 'enterprise',
            },
        });

        dialogRef.afterClosed().subscribe((result: any) => {
            // console.log('The dialog was closed');
            // console.log("result:", result)
        });
    }
}
