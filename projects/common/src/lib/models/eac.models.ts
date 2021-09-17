export class EnterpriseAsCode {
  public AccessRights?: { [lookup: string]: EaCAccessRight };

  public Applications?: { [lookup: string]: EaCApplicationAsCode };

  public DataTokens?: { [lookup: string]: EaCDataToken };

  public Enterprise?: EaCEnterpriseDetails;

  public EnterpriseLookup?: string;

  public Environments?: { [lookup: string]: EaCEnvironmentAsCode };

  public Hosts?: { [lookup: string]: EaCHost };

  public LicenseConfigurations?: { [lookup: string]: EaCLicenseConfiguration };

  public Modifiers?: { [lookup: string]: EaCDFSModifier };

  public Projects?: { [lookup: string]: EaCProjectAsCode };

  public Providers?: { [lookup: string]: EaCProvider };
}

export class EaCEnterpriseDetails {
  public Description?: string;

  public Name?: string;

  public ParentEnterpriseLookup?: string;

  public PrimaryEnvironment?: string;

  public PrimaryHost?: string;
}

export class EaCLicenseConfiguration {
  public Plans?: { [lookup: string]: EaCPlan };
}

export class EaCHost {
  public HostDNSInstance?: string;

  public Verified?: boolean;
}

export class EaCDFSModifier {
  public Details?: string;

  public Enabled?: boolean;

  public Name?: string;

  public PathFilterRegex?: string;

  public Priority?: number;

  public Type?: string;
}

export class EaCAccessRight {
  public Description?: string;

  public Name?: string;
}

export class EaCDataToken {
  public Description?: string;

  public Name?: string;

  public Value?: string;
}

export class EaCPlan {
  public Details?: string;

  public Features?: Array<string>;

  public Featured?: boolean;

  public HeaderName?: string;

  public Name?: string;

  public Prices?: { [lookup: string]: EaCPrice };

  public Popular?: string;

  public Priorty?: number;

  public SuccessRedirect?: string;
}

export class EaCPrice {
  public Currency?: string;

  public Discount?: number;

  public Interval?: string;

  public Name?: string;

  public Value?: number;
}

export class EaCEnvironmentAsCode {
  public Artifacts?: { [lookup: string]: EaCArtifact };

  public Clouds?: { [lookup: string]: EaCCloud };

  public DevOpsActions?: { [lookup: string]: EaCDevOpsAction };

  public Environment?: EaCEnvironmentDetails;

  public Secrets?: { [lookup: string]: EaCSecret };

  public Sources?: { [lookup: string]: EaCSourceControl };
}

export class EaCEnvironmentDetails {
  public Description?: string;

  public Name?: string;
}

export class EaCCloud {
  [key: string]: any;

  public Description?: string;

  public Name?: string;

  public Type?: string;
}

export class EaCDevOpsAction {
  public ArtifactLookups?: Array<string>;

  public DevOpsActionTriggerLookups?: Array<string>;

  public Name?: string;

  public Path?: string;

  public SecretLookups?: Array<string>;

  public Templates?: Array<string>;
}

export class EaCArtifact {
  [key: string]: any;

  public Name?: string;

  public Output?: string;

  public Type?: string;
}

export class EaCSecret {
  [key: string]: any;

  public DataTokenLookup?: string;

  public KnownAs?: string;

  public Name?: string;
}

export class EaCSourceControl {
  [key: string]: any;

  public DevOpsActionTriggerLookups?: Array<string>;

  public Name?: string;

  public Type?: string;
}

export class EaCProjectAsCode {
  public ApplicationLookups?: Array<string>;

  public DataTokens?: { [lookup: string]: EaCDataToken};

  public Hosts?: Array<string>;

  public ModifierLookups?: Array<string>;

  public Project?: EaCProjectDetails;

  public RelyingParty?: EaCRelyingParty;
}

export class EaCProjectDetails {
  public Description?: string;

  public IsInheritable?: boolean;

  public IsInheritableByChild?: boolean;

  public Name?: string;

  public PreventInheritedApplications?: boolean;
}

export class EaCRelyingParty {
  public AccessRightLookups?: Array<string>;

  public AccessConfigurations?: { [lookup: string]: EaCAccessConfiguration};

  public DefaultAccessConfigurationLookup?: string;

  public TrustedProviderLookups?: Array<string>;
}

export class EaCAccessConfiguration {
  public AccessRightLookups?: Array<string>;

  public ProviderLookups?: Array<string>;

  public Usernames?: Array<string>;
}

export class EaCProvider {
  [key: string]: any;

  public Description?: string;

  public Name?: string;

  public Type?: string;
}

export class EaCApplicationAsCode {
  public AccessRightLookups?: Array<string>;

  public Application?: EaCApplicationDetails;

  public DataTokens?: { [lookup: string]: EaCDataToken};

  public LicenseConfigurationLookups?: Array<string>;

  public LookupConfig?: EaCApplicationLookupConfiguration;

  public ModifierLookups?: Array<string>;

  public Processor?: EaCProcessor;
}

export class EaCApplicationLookupConfiguration {
  public AccessRightsAllAny?: AllAnyTypes;

  public AllowedMethods?: Array<string>;

  public HeaderRegex?: string;

  public IsPrivate?: boolean;

  public IsTriggerSignIn?: boolean;

  public LicensesAllAny?: AllAnyTypes;

  public PathRegex?: string;

  public QueryRegex?: string;

  public UserAgentRegex?: string;

  constructor() {
    this.AccessRightsAllAny = AllAnyTypes.Any;

    this.LicensesAllAny = AllAnyTypes.All;
  }
}

export enum AllAnyTypes {
  All,
  Any,
}

export class EaCApplicationDetails {
  public Description?: string;

  public Name?: string;

  public Priority?: number;
}

export class EaCProcessor {
  [key: string]: any;

  public CacheControl?: string;

  public LowCodeUnit?: EaCLowCodeUnit;

  public ModifierLookups?: Array<string>;

  public Priority?: number;

  public Type?: string;
}

export class EaCLowCodeUnit {
  [key: string]: any;

  public SourceControlLookup?: string;

  public Type?: string;
}
