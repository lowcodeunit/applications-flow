import { Component, Input, OnInit } from '@angular/core';
import { FeedItem, FeedItemAction } from '../../models/user-feed.model';
import moment from 'moment';
import { JsonHubProtocol } from '@aspnet/signalr';
import { EaCService } from '../../services/eac.service';
import { BaseModeledResponse } from '@lcu/common';
import { SourceControlDialogComponent } from '../../dialogs/source-control-dialog/source-control-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { EaCEnvironmentAsCode } from '@semanticjs/common';
import { ApplicationsFlowState } from '../../state/applications-flow.state';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
    selector: 'lcu-main-feed-card',
    templateUrl: './main-feed-card.component.html',
    styleUrls: ['./main-feed-card.component.scss'],
})
export class MainFeedCardComponent implements OnInit {
    public get ActiveEnvironment(): EaCEnvironmentAsCode {
        return this.State?.EaC?.Environments[this.ActiveEnvironmentLookup];
    }

    public get ActiveEnvironmentLookup(): string {
        //  TODO:  Eventually support multiple environments
        const envLookups = Object.keys(this.State?.EaC?.Environments || {});

        return envLookups[0];
    }

    public get Environment(): EaCEnvironmentAsCode {
        // console.log("Ent Environment var: ", this.State?.EaC?.Environments[this.State?.EaC?.Enterprise?.PrimaryEnvironment]);
        return this.State?.EaC?.Environments[
            this.State?.EaC?.Enterprise?.PrimaryEnvironment
        ];
    }

    @Input('feed-item')
    public FeedItem: FeedItem;

    public get Icon(): string {
        if (this.FeedItem.Status.Code === 0) {
            return 'check_circle';
        } else if (this.FeedItem.Status.Code === 1) {
            return 'cancel';
        } else if (this.FeedItem.Status.Code === 2) {
            return 'sync';
        } else {
            return 'help_outline';
        }
    }

    public get IconColor(): string {
        if (this.FeedItem.Status.Code === 0) {
            return 'green';
        } else if (this.FeedItem.Status.Code === 1) {
            return 'red';
        } else if (this.FeedItem.Status.Code === 2) {
            return 'blue';
        } else {
            return 'gray';
        }
    }

    public get State(): ApplicationsFlowState {
        return this.eacSvc.State;
    }

    constructor(
        protected eacSvc: EaCService,
        protected dialog: MatDialog,
        private sanitizer: DomSanitizer
    ) {}

    //  Life Cycle
    public ngOnInit(): void {
        this.handleRefresh();
    }

    //  API Methods
    public CalculateTimelapse(timestamp: Date) {
        return moment(timestamp).fromNow();
    }

    public HandleAction(action: FeedItemAction) {
        if (action.ActionType == 'Link') {
            if (action.Action.startsWith('http')) {
                window.open(action.Action, '_blank');
            } else {
                window.location.href = action.Action;
            }
        } else if (action.ActionType == 'Modal') {
            if (action.Action == 'AddSourceControl') {
                this.OpenSourceControlDialog(null, null);
            } else {
                alert('other modaled ' + action.Action);
            }
        }
    }

    public OpenSourceControlDialog(scLookup: string, scName: string): void {
        const dialogRef = this.dialog.open(SourceControlDialogComponent, {
            width: '550px',
            data: {
                environment: this.Environment,
                environmentLookup: this.ActiveEnvironmentLookup,
                scLookup: scLookup,
                scName: scName,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            // console.log('The dialog was closed');
            // console.log("result:", result)
        });
    }

    public SafeHtml(html: string): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(html);
    }

    //  Helpers
    protected handleRefresh(): void {
        if (this.FeedItem?.RefreshLink) {
            setTimeout(() => {
                this.eacSvc.CheckUserFeedItem(this.FeedItem).subscribe(
                    async (response: BaseModeledResponse<FeedItem>) => {
                        if (response.Status.Code === 0) {
                            this.FeedItem = response.Model;

                            this.handleRefresh();
                        } else {
                            console.log(response);
                        }
                    },
                    (err) => {
                        console.log(err);
                    }
                );
            }, 15000);
        }
    }
}
