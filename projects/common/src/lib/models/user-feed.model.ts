export class UserFeedResponse {
  public Items: Array<FeedItem>;
}

export class FeedItem {
  public Committer: string;

  public CommitMessage: string;

  public CommittedAt: Date;
}

export class GitHubWorkflowRun {
  public Conclusion: string;

  public CreatedAt: Date;

  public ID: number;

  public RunNumber: number;

  public Status: string;

  public Workflow: string;

  public UpdatedAt: Date;
}
