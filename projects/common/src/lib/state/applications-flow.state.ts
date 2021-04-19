export class ApplicationsFlowState {
  public GitHub?: GitHubSetupState;

  public Loading?: boolean;

  public Projects?: ProjectState[];

  public UserEnterpriseLookup?: string;

  constructor() {
    this.GitHub = {};
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
  public HasConnection?: boolean;

  public Loading?: boolean;

  public OrganizationOptions?: string[];

  public RepositoryOptions?: string[];
}
