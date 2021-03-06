import { EnterpriseAsCode } from '@semanticjs/common';
import {
    FeedItem,
    FeedItemAction,
    Question,
    UserFeedResponse,
} from '../models/user-feed.model';

export class ApplicationsFlowState {
    public ActiveEnterpriseLookup?: string;

    public Advertisements?: Array<Advertisement>;

    public EaC?: EnterpriseAsCode;

    public Enterprises?: Array<{ Name: string; Lookup: string }>;

    public Feed?: Array<FeedItem>;

    public FeedActions?: Array<FeedItemAction>;

    public FeedCheck?: UserFeedResponse;

    public FeedFilters?: any;

    public FeedSourceControlLookups?: Array<string>;

    public GitHub?: GitHubSetupState;

    public HostingDetails?: ProjectHostingDetails;

    public Loading?: boolean;

    public LoadingActiveEnterprise?: boolean;

    public LoadingEnterprises?: boolean;

    public LoadingFeed?: boolean;

    // public Projects?: ProjectState[];

    public Questions?: Array<Question>;

    public Unleashed?: boolean;

    public UserEnterpriseLookup?: string;

    public UserLicenseInfo?: LicenseAndBillingResponse;

    constructor() {
        this.GitHub = {};

        this.HostingDetails = {};

        this.Loading = true;

        this.LoadingActiveEnterprise = true;

        this.LoadingEnterprises = true;

        this.LoadingFeed = true;

        // this.Projects = [];
    }
}

// export class ProjectState {
//   public ActionsSet?: { [id: string]: DevOpsAction };

//   public Applications?: ApplicationState[];

//   public Description?: string;

//   public Host?: string;

//   public ID?: string;

//   public Image?: string;

//   public LCUs?: GitHubLowCodeUnit[];

//   public Name?: string;

//   public PreventInheritedApplications?: boolean;

//   public Runs?: GitHubWorkflowRun[];
// }

// export class ApplicationState {
//   public IsPrivate?: boolean;

//   public Name?: string;

//   public Organization?: string;

//   public PathRegex?: string;

//   public Priority?: number;

//   public Repository?: string;

//   public Version?: string;
// }

export class Advertisement {
    public Actions?: Array<FeedItemAction>;

    public Description?: string;

    public Image?: string;

    public Lead?: string;

    public Position?: number;
}

export class GitHubSetupState {
    public BranchOptions?: GitHubBranch[];

    public CreatingRepository?: boolean;

    public HasConnection?: boolean;

    public Loading?: boolean;

    public OrganizationOptions?: GitHubOrganization[];

    public RepositoryOptions?: GitHubRepository[];
}

export class GitHubBranch {
    public Name?: string;
}

// export class GitHubLowCodeUnit {
//   public Branch?: string;

//   public ID?: string;

//   public Lookup?: string;

//   public Organization?: string;

//   public Repository?: string;
// }

export class GitHubOrganization {
    public Name?: string;
}

export class GitHubRepository {
    public CloneURL?: string;

    public Name?: string;
}

export class GitHubWorkflowRun {
    public Conclusion?: string;

    public CreatedAt?: string;

    public ID?: string;

    public LCUID?: string;

    public RunNumber?: number;

    public Status?: string;

    public Workflow?: string;

    public UpdatedAt?: string;
}

export class LicenseAndBillingResponse {
    public Email: string;

    public License?: License;

    public Plan?: Plan;

    public Price?: Price;
}

export class License {
    public Details?: string;

    public ExpirationDate?: Date;

    public IsLocked?: boolean;
}

export class Plan {
    public Details?: string;

    public Featured?: boolean;

    public Features?: string[];

    public HeaderName?: string;

    public Lookup?: string;

    public Name?: string;

    public Popular?: string;

    public Priority?: string;

    public SuccessRedirect?: string;
}

export class Price {
    public Currency?: string;

    public Discount?: number;

    public Interval?: string;

    public Lookup?: string;

    public Name?: string;

    public Value?: number;
}

export class UnpackLowCodeUnitRequest {
    public ApplicationLookup?: string;

    public ApplicationName?: string;

    public Version?: string;
}

// export class DevOpsAction {
//   public Details?: string;

//   public ID?: string;

//   public Name?: string;

//   public Overwrite?: boolean;

//   public Path?: string;

//   public Template?: string;
// }

export class ProjectHostingDetails {
    public HostingOptions?: ProjectHostingOption[];

    public Loading?: boolean;
}

export class ProjectHostingOption {
    public ArtifactType?: string;

    public Description?: string;

    public Image?: string;

    public Inputs?: ProjectHostingOptionInput[];

    public Lookup?: string;

    public Name?: string;

    public Path?: string;

    public Templates?: string[];
}

export class ProjectHostingOptionInput {
    public DefaultValue?: string;

    public Hint?: string;

    public Lookup?: string;

    public Placeholder?: string;

    public Required?: boolean;
}

// export class EstablishProjectRequest {
//   public Branch?: string;

//   public BuildScript?: string;

//   public HostingOption?: string;

//   public Organization?: string;

//   public OutputFolder?: string;

//   public ProjectName?: string;

//   public Repository?: string;
// }
