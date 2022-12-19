import { Component, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FeedItem, FeedItemAction } from '../../models/user-feed.model';
import moment from 'moment';
import { EaCService } from '../../services/eac.service';
import { BaseModeledResponse } from '@lcu/common';
import { SourceControlDialogComponent } from '../../dialogs/source-control-dialog/source-control-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { EaCEnvironmentAsCode } from '@semanticjs/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AbstractControl, FormBuilder } from '@angular/forms';
import { FeedCommentFormComponent } from '../../controls/feed-comment-form/feed-comment-form.component';

@Component({
    selector: 'lcu-main-feed-card',
    templateUrl: './main-feed-card.component.html',
    styleUrls: ['./main-feed-card.component.scss'],
})
export class MainFeedCardComponent implements OnDestroy, OnInit {
    protected checkTimeout: any;

    @ViewChild(FeedCommentFormComponent)
    public FeedCommentFormControls: FeedCommentFormComponent;

    @Input('active-environment')
    public ActiveEnvironment: EaCEnvironmentAsCode;

    @Input('active-environment-lookup')
    public ActiveEnvironmentLookup: string;

    @Input('environment')
    public Environment: EaCEnvironmentAsCode;

    @Input('feed-item')
    public FeedItem: FeedItem;

    // public get ActiveEnvironment(): EaCEnvironmentAsCode {
    //     return this.State?.EaC?.Environments[this.ActiveEnvironmentLookup];
    // }

    // public get ActiveEnvironmentLookup(): string {
    //     //  TODO:  Eventually support multiple environments
    //     const envLookups = Object.keys(this.State?.EaC?.Environments || {});

    //     return envLookups[0];
    // }

    public get CommentControl(): AbstractControl {
        return this.FeedCommentFormControls?.FeedCommentsFormGroup?.controls
            .comment;
    }

    // public Icon: string;

    // public IconColor: string;

    constructor(
        protected eacSvc: EaCService,
        protected dialog: MatDialog,
        private sanitizer: DomSanitizer,
        protected formBuilder: FormBuilder
    ) {}

    //  Life Cycle
    public ngOnDestroy(): void {
        if (this.checkTimeout) {
            clearTimeout(this.checkTimeout);
        }
    }

    public ngOnInit(): void {
        this.handleRefresh();
        this.SanitizeVideos();
    }

    public ngOnChanges() {
        // if (this.FeedItem?.Status?.Code === 0) {
        //     this.Icon = 'check_circle';
        //     this.IconColor = 'green';
        // } else if (this.FeedItem?.Status?.Code === 1) {
        //     this.Icon = 'cancel';
        //     this.IconColor = 'red';
        // } else if (this.FeedItem?.Status?.Code === 2) {
        //     this.Icon = 'sync';
        //     this.IconColor = 'blue';
        // } else {
        //     this.Icon = 'help_outline';
        //     this.IconColor = 'gray';
        // }
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

    public HandleSubmitComment(event: any) {
        // console.log('recieved comment: ', event);
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

        dialogRef.afterClosed().subscribe((result: any) => {
            // console.log('The dialog was closed');
            // console.log("result:", result)
        });
    }

    public SafeHtml(html: string): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(html);
    }

    public SanitizeVideos() {
        this.FeedItem?.Tabs?.forEach((tab) => {
            if (tab.Data?.Video) {
                tab.Data.Video = this.SafeHtml(tab.Data?.Video);
            }
        });
    }

    public SubmitComment() {
        // console.log('comment: ', this.CommentControl.value);
    }

    //  Helpers

    protected handleRefresh(): void {
        if (this.FeedItem?.RefreshLink) {
            this.checkTimeout = setTimeout(() => {
                this.eacSvc.CheckUserFeedItem(this.FeedItem).subscribe(
                    async (response: BaseModeledResponse<FeedItem>) => {
                        if (response.Status.Code === 0) {
                            this.FeedItem = response.Model;

                            this.handleRefresh();
                        } else {
                            // console.log(response);
                        }
                    },
                    (err: any) => {
                        console.log(err);
                    }
                );
            }, 30000);
        }
    }
}
