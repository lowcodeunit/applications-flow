import { FeedItemActionModel } from './feed-item-action.model';
import { FeedItemContributorModel } from './feed-item-contributor.model';

export class FeedItemModel {
    [key: string]: any;

    public Actions: Array<FeedItemActionModel>;
    public Avatar: string;
    public Badge: string;
    public Contributors: Array<FeedItemContributorModel>;
    public IsPinned: string;
    public IsShortForm: string;
    public Status: any;
    public Subtitle: string;
    public Tabs: Array<FeedItemContributorModel>;
    public Timestamp: [keyof Date];
    public Title: string;
    public Type: string;
}
