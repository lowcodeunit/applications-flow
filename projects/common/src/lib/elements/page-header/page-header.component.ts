import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserAccountDialogComponent } from '../../dialogs/user-account-dialog/user-account-dialog.component';
import { ApplicationsFlowState } from '../../state/applications-flow.state';

@Component({
    selector: 'lcu-page-header',
    templateUrl: './page-header.component.html',
    styleUrls: ['./page-header.component.scss'],
})
export class PageHeaderComponent implements OnInit {
    @Input('state')
    public State: ApplicationsFlowState;

    public IsSmScreen: boolean;

    constructor(
        public breakpointObserver: BreakpointObserver,
        protected dialog: MatDialog,
        protected userAccountDialog: MatDialog
    ) {}

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
    }

    /**
     * Opens the users account modal passing in the users state so there is no lag in
     *
     * filling out user info
     */
    public OpenMyAccount() {
        this.userAccountDialog.open(UserAccountDialogComponent, {
            position: { top: '64px', right: '0px' },
            width: '260px',
            panelClass: 'user-account-dialog-container',
            data: this.State,
        });
    }
}
