import { Component, Input, OnInit } from '@angular/core';
import { FeedItem, FeedItemAction } from '../../models/user-feed.model';
import moment from 'moment';
import { JsonHubProtocol } from '@aspnet/signalr';
import { EaCService } from '../../services/eac.service';
import { BaseModeledResponse } from '@lcu/common';

@Component({
  selector: 'lcu-main-feed-card',
  templateUrl: './main-feed-card.component.html',
  styleUrls: ['./main-feed-card.component.scss'],
})
export class MainFeedCardComponent implements OnInit {
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

  constructor(protected eacSvc: EaCService) {}

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
        //  TODO:  George launch source control modal
        alert('AddSourceControl modaled');
      } else {
        alert('other modaled ' + action.Action);
      }
    }
  }

  public handleRefresh(): void {
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
      }, 5000);
    }
  }

  //  Helpers
}
