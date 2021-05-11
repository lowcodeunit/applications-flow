export class ApplicationsFlowState {
  public GitHub?: GitHubSetupState;

  public HostingDetails?: ProjectHostingDetails;

  public Loading?: boolean;

  public Projects?: ProjectState[];

  public UserEnterpriseLookup?: string;

  constructor() {
    this.GitHub = {};

    this.HostingDetails = {};

    this.Loading = true;

    this.Projects = [];
  }
}

export class ProjectState {
  public Description?: string;

  public Host?: string;

  public Name?: string;

  public Image?: string;

  public PreventInheritedApplications?: string;
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

export class GitHubOrganization {
  public Name?: string;
}

export class GitHubRepository {
  public CloneURL?: string;

  public Name?: string;
}

export class ProjectHostingDetails {
  public HostingOptions?: ProjectHostingOption[];

  public Loading?: boolean;
}

export class ProjectHostingOption {
  public Lookup?: string;

  public Name?: string;
}

export class EstablishProjectRequest {
  public Branch?: string;

  public BuildScript?: string;

  public HostingOption?: string;

  public Organization?: string;

  public OutputFolder?: string;

  public ProjectName?: string;

  public Repository?: string;
}
