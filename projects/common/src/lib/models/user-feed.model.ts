export class UserFeedResponseModel{
    
    public Runs: Array<AdjustedGitHubWorkflowRun>;

}

export class AdjustedGitHubWorkflowRun {

    public Committer: string;

    public CommitMessage: string;

    public CommittedAt: Date;

}


export class GitHubWorkflowRun {

    public Conclusion: string;

    public CreatedAt: Date;

    public ID: number;

    public  RunNumber: number;

    public Status: string;

    public Workflow: string;

    public UpdatedAt: Date;
}

