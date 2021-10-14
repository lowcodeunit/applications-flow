import { EnterpriseAsCode } from '@semanticjs/common';

export class ApplicationsFlowState {
  public ActiveEnterpriseLookup?: string;

  public EaC?: EnterpriseAsCode;

  public Enterprises?: Array<{ Name: string; Lookup: string }>;

  public GitHub?: GitHubSetupState;

  public HostingDetails?: ProjectHostingDetails;

  public Loading?: boolean;

  // public Projects?: ProjectState[];

  public UserEnterpriseLookup?: string;

  constructor() {
    this.GitHub = {};

    this.HostingDetails = {};

    this.Loading = true;

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
