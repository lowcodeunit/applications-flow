import { FeedItemActionModel } from './feed-item-action.model';
import { FeedItemContributorModel } from './feed-item-contributor.model';
import { FeedItemTabModel } from './feed-item-tab.model';
import { FeedItemModel } from './feed-item.model';

export class MainFeedModel {
    public FeedItem: { [key: string]: FeedItemModel };
    public FeedItemContributor: { [key: string]: FeedItemContributorModel };
    public FeedItemAction: { [key: string]: FeedItemActionModel };
    public FeedItemTab: { [key: string]: FeedItemTabModel };
}

// public class UserFeedResponse : BaseResponse
// {
//     public  List<FeedItem> Items { get; set; }
// }

// public class FeedItem : MetadataModel
// {
//     public  List<FeedItemAction> Actions { get; set; }
//     public  string Avatar { get; set; }
//     public  string Badge { get; set; }
//     public  List<FeedItemContributor> Contributors { get; set; }
//     public  bool IsPinned { get; set; }
//     public  bool IsShortForm { get; set; }
//     public  Status Status { get; set; }
//     public  string Subtitle { get; set; }
//     public  List<FeedItemTab> Tabs { get; set; }
//     public  DateTimeOffset Timestamp { get; set; }
//     public  string Title { get; set; }
//     public  string Type { get; set; }
// }

// public class FeedItemContributor : MetadataModel
// {
//     public  string Status { get; set; }
//     public  string StatusIcon { get; set; }
//     public  string UserImage { get; set; }
//     public  string Username { get; set; }
// }

// public class FeedItemAction : MetadataModel
// {
//     public  string Action { get; set; }
//     public  string ActionType { get; set; }
//     public  string Color { get; set; }
//     public  string Icon { get; set; }
//     public  string Text { get; set; }
// }

// public class FeedItemTab : MetadataModel
// {
//     public  MetadataModel Data { get; set; }
//     public  string Title { get; set; }
// }
