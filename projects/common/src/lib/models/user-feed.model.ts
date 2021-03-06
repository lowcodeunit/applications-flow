import { BaseResponse, Status } from '@lcu/common';
import { Advertisement } from '../state/applications-flow.state';
import { ActionsModel } from './actions.model';

export class UserFeedResponse extends BaseResponse {
    public Actions: Array<FeedItemAction>;

    public Advertisements: Array<Advertisement>;

    public Items: Array<FeedItem>;

    public ItemTypes: Array<ItemType>;

    public SourceControlLookups: Array<string>;

    public Questions: Array<Question>;
}

export class FeedItem {
    [key: string]: any;

    public Actions: Array<FeedItemAction>;

    public Avatar: string;

    public Badge: string;

    public Contributors: Array<FeedItemContributor>;

    public ID: string;

    public IsPinned: boolean;

    public IsShortForm: boolean;

    public RefreshLink: string;

    public Status: Status;

    public Subtext: string;

    public Subtitle: string;

    public Tabs: Array<FeedItemTab>;

    public Timestamp: Date;

    public Title: string;

    public Type: string;
}

export class FeedItemContributor {
    [key: string]: any;

    public Status: string;

    public StatusIcon: string;

    public UserImage: string;

    public Username: string;
}

export class FeedItemAction {
    [key: string]: any;

    public Action: string;

    public ActionType: string;

    public Color: string;

    public Icon: string;

    public Text: string;
}

export class FeedItemTab {
    [key: string]: any;

    public Data: { [key: string]: any };

    public Title: string;
}

export class FeedEntry {
    public ActionIcon: string;

    public ActionLink: string;

    public ActionText: string;

    public Avatar: string;

    public Content: string;

    public ExpiresAt: Date;

    public Organization: string;

    public Repository: string;

    public SourceBranch: string;

    public SourceControlLookup: string;

    public Subtitle: string;

    public TargetBranch: string;

    public Title: string;

    public Type: string;
}

export class ItemType {
    [key: string]: any;
}

export class Question {
    public Actions: Array<ActionsModel>;

    public Description: string;

    public Image: string;

    public Title: string;
}
