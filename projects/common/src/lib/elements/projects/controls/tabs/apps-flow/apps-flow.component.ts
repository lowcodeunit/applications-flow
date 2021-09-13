import { FormsService } from './../../../../../services/forms.service';
import { CardFormConfigModel } from './../../../../../models/card-form-config.model';
import { DomainModel } from './../../../../../models/domain.model';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  ApplicationsFlowEventsService,
  SaveApplicationAsCodeEventRequest,
} from '../../../../../services/applications-flow-events.service';
import {
  EaCApplicationAsCode,
  EaCArtifact,
  EaCDevOpsAction,
  EaCEnvironmentAsCode,
  EaCProcessor,
  EaCProjectAsCode,
  EaCSourceControl,
} from '../../../../../models/eac.models';
import { BaseModeledResponse, Guid } from '@lcu/common';
import { MatSelectChange } from '@angular/material/select';
import { SourceControlFormControlsComponent } from '../../forms/source-control/source-control.component';
import { ProjectHostingDetails } from '../../../../../state/applications-flow.state';
import { ApplicationsFlowService } from '../../../../../services/applications-flow.service';
import { HostingDetailsFormGroupComponent } from '../../hosting-details-form-group/hosting-details-form-group.component';

@Component({
  selector: 'lcu-apps-flow',
  templateUrl: './apps-flow.component.html',
  styleUrls: ['./apps-flow.component.scss'],
})
export class AppsFlowComponent implements OnInit {
  //  Fields

  //  Properties
  public get APIRootFormControl(): AbstractControl {
    return this.ApplicationFormGroup?.controls.apiRoot;
  }

  public ApplicationFormGroup: FormGroup;

  public get ApplicationIDFormControl(): AbstractControl {
    return this.ApplicationFormGroup?.controls.applicationId;
  }

  public get ApplicationLookups(): Array<string> {
    return Object.keys(this.Applications || {});
  }

  public get ApplicationRoutes(): Array<string> {
    return Object.keys(this.RoutedApplications || {});
  }

  public get ApplicationsBank(): { [lookup: string]: EaCApplicationAsCode } {
    return this.Data?.Applications || {};
  }

  public get Applications(): { [lookup: string]: EaCApplicationAsCode } {
    const apps: { [lookup: string]: EaCApplicationAsCode } = {};

    this.Project.ApplicationLookups.forEach((appLookup) => {
      apps[appLookup] = this.ApplicationsBank[appLookup];
    });
    return apps;
  }

  public get Artifact(): EaCArtifact {
    return this.Data.Environment.Artifacts && this.ArtifactLookup
      ? this.Data.Environment.Artifacts[this.ArtifactLookup] || {}
      : {};
  }

  public get ArtifactLookup(): string {
    const artLookup = this.DevOpsAction?.ArtifactLookups
      ? this.DevOpsAction?.ArtifactLookups[0]
      : null;

    return artLookup;
  }

  public get BuildFormControl(): AbstractControl {
    return this.ApplicationFormGroup?.controls.build;
  }

  public get ClientIDFormControl(): AbstractControl {
    return this.ApplicationFormGroup?.controls.clientId;
  }

  public get ClientSecretFormControl(): AbstractControl {
    return this.ApplicationFormGroup?.controls.clientSecret;
  }

  public CurrentApplicationRoute: string;

  public get CurrentRouteApplicationLookups(): Array<string> {
    return Object.keys(
      this.RoutedApplications[this.CurrentApplicationRoute] || {}
    );
  }

  @Input('data')
  public Data: {
    Applications: { [lookup: string]: EaCApplicationAsCode };
    Environment: EaCEnvironmentAsCode;
    EnvironmentLookup: string;
    Project: EaCProjectAsCode;
    ProjectLookup: string;
  };

  public get DefaultFileFormControl(): AbstractControl {
    return this.ApplicationFormGroup?.controls.defaultFile;
  }

  public get DefaultSourceControl(): EaCSourceControl {
    return {
      Organization:
        this.EditingApplication?.Processor?.LowCodeUnit?.Organization,
      Repository: this.EditingApplication?.Processor?.LowCodeUnit?.Repository,
    };
  }

  public get DescriptionFormControl(): AbstractControl {
    return this.ApplicationFormGroup?.controls.description;
  }

  public get DevOpsAction(): EaCDevOpsAction {
    return this.Data.Environment.DevOpsActions && this.DevOpsActionLookup
      ? this.Data.Environment.DevOpsActions[this.DevOpsActionLookup] || {}
      : {};
  }

  public get DevOpsActionLookup(): string {
    if (!!this.DevOpsActionLookupFormControl?.value) {
      return this.DevOpsActionLookupFormControl.value;
    }

    if (!!this.SourceControl?.DevOpsActionTriggerLookups) {
      return this.SourceControl?.DevOpsActionTriggerLookups[0];
    } else {
      return null;
    }
    return this.DevOpsActionLookupFormControl?.value ||
      !!this.SourceControl?.DevOpsActionTriggerLookups
      ? this.SourceControl?.DevOpsActionTriggerLookups[0]
      : null;
  }

  public get DevOpsActionLookups(): Array<string> {
    return Object.keys(this.DevOpsActions || {});
  }

  public get DevOpsActionLookupFormControl(): AbstractControl {
    return this.ApplicationFormGroup.get('devOpsActionLookup');
  }

  public get DevOpsActions(): { [lookup: string]: EaCDevOpsAction } {
    return this.Data.Environment.DevOpsActions || {};
  }

  public get EditingApplication(): EaCApplicationAsCode {
    let app = this.Applications
      ? this.Applications[this.EditingApplicationLookup]
      : null;

    if (app == null && this.EditingApplicationLookup) {
      app = {};
    }

    return app;
  }

  public EditingApplicationLookup: string;

  public get HasBuildFormControl(): AbstractControl {
    return this.ApplicationFormGroup?.controls.hasBuild;
  }

  public HostingDetails: ProjectHostingDetails;

  @ViewChild(HostingDetailsFormGroupComponent)
  public HostingDetailsFormControls: HostingDetailsFormGroupComponent;

  public get InboundPathFormControl(): AbstractControl {
    return this.ApplicationFormGroup?.controls.inboundPath;
  }

  public get IsPrivateFormControl(): AbstractControl {
    return this.ApplicationFormGroup?.controls.isPrivate;
  }

  public get IsTriggerSignInFormControl(): AbstractControl {
    return this.ApplicationFormGroup?.controls.isTriggerSignIn;
  }

  public LCUType: string;

  public get MethodsFormControl(): AbstractControl {
    return this.ApplicationFormGroup?.controls.methods;
  }

  public get NameFormControl(): AbstractControl {
    return this.ApplicationFormGroup?.controls.name;
  }

  public get PackageFormControl(): AbstractControl {
    return this.ApplicationFormGroup?.controls.package;
  }

  public get PermanentFormControl(): AbstractControl {
    return this.ApplicationFormGroup?.controls.permanent;
  }

  public get PreserveMethodFormControl(): AbstractControl {
    return this.ApplicationFormGroup?.controls.preserveMethod;
  }

  // public get PriorityFormControl(): AbstractControl {
  //   return this.ApplicationFormGroup?.controls.priority;
  // }

  public ProcessorType: string;

  public get Project(): EaCProjectAsCode {
    return this.Data.Project;
  }

  public get ProjectLookup(): string {
    return this.Data.ProjectLookup;
  }

  public get RedirectFormControl(): AbstractControl {
    return this.ApplicationFormGroup?.controls.redirect;
  }

  public get RoutedApplications(): {
    [route: string]: { [lookup: string]: EaCApplicationAsCode };
  } {
    const appLookups = Object.keys(this.Applications);

    const apps = appLookups.map((appLookup) => this.Applications[appLookup]);

    let appRoutes =
      apps.map((app) => {
        return app.LookupConfig?.PathRegex.replace('.*', '');
      }) || [];

    appRoutes = appRoutes.filter((ar) => ar != null);

    let routeBases: string[] = [];

    appRoutes.forEach((appRoute) => {
      const appRouteParts = appRoute.split('/');

      const appRouteBase = `/${appRouteParts[1]}`;

      if (routeBases.indexOf(appRouteBase) < 0) {
        routeBases.push(appRouteBase);
      }
    });

    let workingAppLookups = [...(appLookups || [])];

    const routeSet =
      routeBases.reduce((prevRouteMap, currentRouteBase) => {
        const routeMap = {
          ...prevRouteMap,
        };

        const filteredAppLookups = workingAppLookups.filter((wal) => {
          const wa = this.Applications[wal];

          return wa.LookupConfig?.PathRegex.startsWith(currentRouteBase);
        });

        routeMap[currentRouteBase] =
          filteredAppLookups.reduce((prevAppMap, appLookup) => {
            const appMap = {
              ...prevAppMap,
            };

            appMap[appLookup] = this.Applications[appLookup];

            return appMap;
          }, {}) || {};

        workingAppLookups = workingAppLookups.filter((wa) => {
          return filteredAppLookups.indexOf(wa) < 0;
        });

        return routeMap;
      }, {}) || {};

    let routeSetKeys = Object.keys(routeSet);

    routeSetKeys = routeSetKeys.sort((a, b) => a.localeCompare(b));

    const routeSetResult = {};

    routeSetKeys.forEach((rsk) => (routeSetResult[rsk] = routeSet[rsk]));

    return routeSetResult;
  }

  public get RouteFormControl(): AbstractControl {
    return this.ApplicationFormGroup?.controls.route;
  }

  public get ScopesFormControl(): AbstractControl {
    return this.ApplicationFormGroup?.controls.scopes;
  }

  public get SecurityFormControl(): AbstractControl {
    return this.ApplicationFormGroup?.controls.security;
  }

  public get SourceControl(): EaCSourceControl {
    return this.Data.Environment.Sources && this.SourceControlLookup
      ? this.Data.Environment.Sources[this.SourceControlLookup] || {}
      : this.DefaultSourceControl;
  }

  @ViewChild(SourceControlFormControlsComponent)
  public SourceControlFormControls: SourceControlFormControlsComponent;

  public get SourceControlLookup(): string {
    return (
      this.SourceControlLookupFormControl?.value ||
      this.EditingApplication.Processor?.LowCodeUnit?.SourceControlLookup
    );
  }

  public get SourceControlLookupFormControl(): AbstractControl {
    return this.ApplicationFormGroup?.controls.sourceControlLookup;
  }

  public get SourceControlLookups(): Array<string> {
    return Object.keys(this.SourceControls || {});
  }

  public get SourceControls(): { [lookup: string]: EaCSourceControl } {
    return this.Data.Environment.Sources || {};
  }

  public get SPARootFormControl(): AbstractControl {
    return this.ApplicationFormGroup?.controls.spaRoot;
  }

  public get TokenLookupFormControl(): AbstractControl {
    return this.ApplicationFormGroup?.controls.tokenLookup;
  }

  public get VersionFormControl(): AbstractControl {
    return this.ApplicationFormGroup?.controls.version;
  }

  public get ZipFileFormControl(): AbstractControl {
    return this.ApplicationFormGroup?.controls.zipFile;
  }

  //  Constructors
  constructor(
    protected formBldr: FormBuilder,
    protected appsFlowSvc: ApplicationsFlowService,
    protected appsFlowEventsSvc: ApplicationsFlowEventsService
  ) {
    this.EditingApplicationLookup = null;

    this.HostingDetails = new ProjectHostingDetails();
  }

  //  Life Cycle
  public ngOnInit(): void {
    if (this.ApplicationLookups?.length <= 0) {
      this.CreateNewApplication();
    }
  }

  //  API Methods
  public BranchesChanged(branches: string[]): void {
    this.loadProjectHostingDetails();
  }

  public CreateNewApplication(): void {
    this.SetEditingApplication(Guid.CreateRaw());
  }

  public DeleteApplication(appLookup: string, appName: string): void {
    if (confirm(`Are you sure you want to delete application '${appName}'?`)) {
      this.appsFlowEventsSvc.DeleteApplication(appLookup);
    }
  }

  public DevOpsActionLookupChanged(event: MatSelectChange): void {
    this.configureDevOpsAction();
  }

  public LCUTypeChanged(event: MatSelectChange): void {
    this.LCUType = event.value;

    this.setupLcuTypeSubForm();
  }

  public ProcessorTypeChanged(event: MatSelectChange): void {
    this.ProcessorType = event.value;

    this.setupProcessorTypeSubForm();
  }

  public SaveApplication(): void {
    const processor: EaCProcessor = {
      Type: this.ProcessorType,
    };

    switch (processor.Type) {
      case 'DFS':
        processor.BaseHref = `${this.RouteFormControl.value}/`.replace(
          '//',
          '/'
        );

        processor.DefaultFile =
          this.DefaultFileFormControl.value || 'index.html';

        processor.LowCodeUnit = {
          Type: this.LCUType,
        };

        switch (processor.LowCodeUnit.Type) {
          case 'GitHub':
            processor.LowCodeUnit.Organization =
              this.SourceControlFormControls.OrganizationFormControl.value;

            processor.LowCodeUnit.Repository =
              this.SourceControlFormControls.RepositoryFormControl.value;

            processor.LowCodeUnit.Build = this.BuildFormControl.value;
            break;

          case 'NPM':
            processor.LowCodeUnit.Package = this.PackageFormControl.value;

            processor.LowCodeUnit.Version = this.VersionFormControl.value;
            break;

          case 'Zip':
            processor.LowCodeUnit.ZipFile = this.ZipFileFormControl.value;
            break;
        }
        break;

      case 'OAuth':
        processor.Scopes = this.ScopesFormControl.value.split(' ');

        processor.TokenLookup = this.TokenLookupFormControl.value;

        processor.LowCodeUnit = {
          Type: this.LCUType,
        };

        switch (processor.LowCodeUnit.Type) {
          case 'GitHubOAuth':
            processor.LowCodeUnit.ClientID = this.ClientIDFormControl.value;

            processor.LowCodeUnit.ClientSecret =
              this.ClientSecretFormControl.value;
            break;
        }
        break;

      case 'Proxy':
        processor.InboundPath = this.InboundPathFormControl.value;

        processor.LowCodeUnit = {
          Type: this.LCUType,
        };

        switch (processor.LowCodeUnit.Type) {
          case 'API':
            processor.LowCodeUnit.APIRoot = this.APIRootFormControl.value;

            processor.LowCodeUnit.Security = this.SecurityFormControl.value;

            break;

          case 'SPA':
            processor.LowCodeUnit.SPARoot = this.SPARootFormControl.value;
            break;
        }
        break;

      case 'Redirect':
        processor.Permanent = !!this.PermanentFormControl.value;

        processor.PreserveMethod = !!this.PreserveMethodFormControl.value;

        processor.Redirect = this.RedirectFormControl.value;
        break;
    }

    const app: EaCApplicationAsCode = {
      Application: {
        Name: this.NameFormControl.value,
        Description: this.DescriptionFormControl.value,
      },
      AccessRightLookups: [],
      DataTokens: {},
      LicenseConfigurationLookups: [],
      LookupConfig: {
        IsPrivate: this.IsPrivateFormControl.value,
        IsTriggerSignIn: this.IsPrivateFormControl.value
          ? this.IsTriggerSignInFormControl.value
          : false,
        PathRegex: `${this.RouteFormControl.value}.*`,
        QueryRegex: '',
        HeaderRegex: '',
        AllowedMethods: this.MethodsFormControl?.value.split(' '),
      },
      Processor: processor,
    };

    if (!app.LookupConfig.PathRegex.startsWith('/')) {
      app.LookupConfig.PathRegex = `/${app.LookupConfig.PathRegex}`;
    }

    const saveAppReq: SaveApplicationAsCodeEventRequest = {
      ProjectLookup: this.ProjectLookup,
      Application: app,
      ApplicationLookup: this.EditingApplicationLookup || Guid.CreateRaw(),
      Environment: {
        ...this.Data.Environment,
        Artifacts: this.Data.Environment.Artifacts || {},
        DevOpsActions: this.Data.Environment.DevOpsActions || {},
        Secrets: this.Data.Environment.Secrets || {},
        Sources: this.Data.Environment.Sources || {},
      },
      EnvironmentLookup: this.Data.EnvironmentLookup,
      EnterpriseDataTokens: {},
    };

    if (this.HasBuildFormControl.value && this.ProcessorType !== 'redirect') {
      if (app.Processor.LowCodeUnit != null) {
        let artifactLookup: string;

        let artifact: EaCArtifact = {
          ...this.Artifact,
          ...this.HostingDetailsFormControls
            .SelectedHostingOptionInputControlValues,
        };

        if (!this.ArtifactLookup) {
          artifactLookup = Guid.CreateRaw();

          artifact = {
            ...artifact,
            Type: this.HostingDetailsFormControls.SelectedHostingOption
              .ArtifactType,
            Name: this.HostingDetailsFormControls.SelectedHostingOption.Name,
            NPMRegistry: 'https://registry.npmjs.org/',
          };
        }

        saveAppReq.Environment.Artifacts[artifactLookup] = artifact;

        let devOpsActionLookup: string;

        if (!this.DevOpsActionLookup) {
          devOpsActionLookup = Guid.CreateRaw();

          const secretLookup = 'npm-access-token';

          const doa: EaCDevOpsAction = {
            ...this.DevOpsAction,
            ArtifactLookups: [artifactLookup],
            Name: this.HostingDetailsFormControls.SelectedHostingOption.Name,
            Path: this.HostingDetailsFormControls.SelectedHostingOption.Path,
            SecretLookups: [secretLookup],
            Templates:
              this.HostingDetailsFormControls.SelectedHostingOption.Templates,
          };

          saveAppReq.Environment.DevOpsActions[devOpsActionLookup] = doa;

          if (this.HostingDetailsFormControls.NPMTokenFormControl?.value) {
            saveAppReq.Environment.Secrets[secretLookup] = {
              Name: 'NPM Access Token',
              DataTokenLookup: secretLookup,
              KnownAs: 'NPM_TOKEN',
            };

            saveAppReq.EnterpriseDataTokens[secretLookup] = {
              Name: saveAppReq.Environment.Secrets[secretLookup].Name,
              Description: saveAppReq.Environment.Secrets[secretLookup].Name,
              Value: this.HostingDetailsFormControls.NPMTokenFormControl.value,
            };
          }
        } else {
          devOpsActionLookup = this.DevOpsActionLookupFormControl.value;
        }

        let source: EaCSourceControl = {
          ...this.SourceControl,
          Branches: this.SourceControlFormControls.SelectedBranches,
          MainBranch:
            this.SourceControlFormControls.MainBranchFormControl.value,
        };

        if (!this.SourceControlLookupFormControl.value) {
          app.Processor.LowCodeUnit.SourceControlLookup = `github://${this.SourceControlFormControls.OrganizationFormControl.value}/${this.SourceControlFormControls.RepositoryFormControl.value}`;

          source = {
            ...source,
            Type: 'GitHub',
            Name: app.Processor.LowCodeUnit.SourceControlLookup,
            DevOpsActionTriggerLookups: [devOpsActionLookup],
            Organization:
              this.SourceControlFormControls.OrganizationFormControl.value,
            Repository:
              this.SourceControlFormControls.RepositoryFormControl.value,
          };
        } else {
          app.Processor.LowCodeUnit.SourceControlLookup =
            this.SourceControlLookupFormControl.value;
        }

        saveAppReq.Environment.Sources[
          app.Processor.LowCodeUnit.SourceControlLookup
        ] = source;
      }
    } else if (app.Processor.LowCodeUnit) {
      app.Processor.LowCodeUnit.SourceControlLookup = null;
    }

    this.appsFlowEventsSvc.SaveApplicationAsCode(saveAppReq);
  }

  public SetEditingApplication(appLookup: string): void {
    this.EditingApplicationLookup = appLookup;

    this.setupApplicationForm();
  }

  public SourceControlLookupChanged(event: MatSelectChange): void {
    this.SourceControlFormControls?.RefreshOrganizations();
  }

  public StartsWith(app: EaCApplicationAsCode, appRouteBase: string): boolean {
    if (appRouteBase === '/') {
      return app?.LookupConfig?.PathRegex === '/.*';
    } else {
      return app?.LookupConfig?.PathRegex.startsWith(appRouteBase);
    }
  }

  public Unpack(appLookup: string, appName: string, version?: string): void {
    this.appsFlowEventsSvc.UnpackLowCodeUnit({
      ApplicationLookup: appLookup,
      ApplicationName: appName,
      Version: version,
    });
  }

  //  Helpers
  protected cleanupLcuTypeSubForm(): void {
    this.ApplicationFormGroup.removeControl('methods');
    this.ApplicationFormGroup.removeControl('apiRoot');
    this.ApplicationFormGroup.removeControl('security');

    this.ApplicationFormGroup.removeControl('applicationId');

    this.ApplicationFormGroup.removeControl('build');

    this.ApplicationFormGroup.removeControl('clientId');
    this.ApplicationFormGroup.removeControl('clientSecret');
  }

  protected cleanupProcessorTypeSubForm(): void {
    this.ApplicationFormGroup.removeControl('defaultFile');
    this.ApplicationFormGroup.removeControl('dfsLcuType');

    this.ApplicationFormGroup.removeControl('oauthLcuType');
    this.ApplicationFormGroup.removeControl('scopes');
    this.ApplicationFormGroup.removeControl('tokenLookup');

    this.ApplicationFormGroup.removeControl('inboundPath');
    this.ApplicationFormGroup.removeControl('proxyLcuType');

    this.ApplicationFormGroup.removeControl('redirect');
    this.ApplicationFormGroup.removeControl('permanent');
    this.ApplicationFormGroup.removeControl('preserveMethod');

    this.cleanupLcuTypeSubForm();
  }

  protected configureDevOpsAction(): void {
    setTimeout(() => {
      this.DevOpsActionLookupFormControl.setValue(this.DevOpsActionLookup);

      setTimeout(() => {
        const hostOption = this.HostingDetails?.HostingOptions?.find(
          (ho) => ho.Path === this.DevOpsAction.Path
        );

        this.HostingDetailsFormControls?.BuildPipelineFormControl.setValue(
          hostOption?.Lookup
        );

        this.HostingDetailsFormControls?.BuildPipelineChanged();
      }, 0);
    }, 0);
  }

  protected loadProjectHostingDetails(): void {
    if (this.SourceControlFormControls?.SelectedBranches?.length > 0) {
      this.HostingDetails.Loading = true;

      this.appsFlowSvc
        .LoadProjectHostingDetails(
          this.SourceControlFormControls?.OrganizationFormControl?.value,
          this.SourceControlFormControls?.RepositoryFormControl?.value,
          this.SourceControlFormControls?.MainBranchFormControl?.value
        )
        .subscribe(
          (response: BaseModeledResponse<ProjectHostingDetails>) => {
            this.HostingDetails = response.Model;

            this.HostingDetails.Loading = false;

            this.configureDevOpsAction();
          },
          (err) => {
            this.HostingDetails.Loading = false;
          }
        );
    }
  }

  protected setupApplicationForm(): void {
    this.ProcessorType = this.EditingApplication?.Processor?.Type || '';

    if (this.EditingApplication != null) {
      this.ApplicationFormGroup = this.formBldr.group({
        name: [this.EditingApplication.Application?.Name, Validators.required],
        description: [
          this.EditingApplication.Application?.Description,
          Validators.required,
        ],
        route: [
          this.EditingApplication.LookupConfig?.PathRegex.replace('.*', '') ||
            '/',
          Validators.required,
        ],
        // priority: [
        //   this.EditingApplication.Application?.Priority || 10000,
        //   Validators.required,
        // ],
        procType: [this.ProcessorType, [Validators.required]],
      });

      this.setupBuildForm();

      this.setupSecurityForm();

      this.setupProcessorTypeSubForm();
    }
  }

  protected setupBuildForm(): void {
    this.ApplicationFormGroup.addControl(
      'hasBuild',
      this.formBldr.control(
        !!this.EditingApplication.Processor?.LowCodeUnit?.SourceControlLookup ||
          false,
        [Validators.required]
      )
    );

    this.ApplicationFormGroup.addControl(
      'devOpsActionLookup',
      this.formBldr.control(this.DevOpsActionLookup || '', [])
    );

    this.ApplicationFormGroup.addControl(
      'sourceControlLookup',
      this.formBldr.control(
        this.EditingApplication.Processor?.LowCodeUnit?.SourceControlLookup ||
          '',
        []
      )
    );
  }

  protected setupDfsForm(): void {
    this.LCUType = this.EditingApplication.Processor?.LowCodeUnit?.Type || '';

    this.ApplicationFormGroup.addControl(
      'defaultFile',
      this.formBldr.control(
        this.EditingApplication.Processor?.DefaultFile || 'index.html',
        [Validators.required]
      )
    );

    this.ApplicationFormGroup.addControl(
      'lcuType',
      this.formBldr.control(this.LCUType, [Validators.required])
    );
  }

  protected setupLCUAPIForm(): void {
    this.ApplicationFormGroup.addControl(
      'methods',
      this.formBldr.control(
        this.EditingApplication.LookupConfig?.AllowedMethods?.join(' ') || '',
        []
      )
    );

    this.ApplicationFormGroup.addControl(
      'apiRoot',
      this.formBldr.control(
        this.EditingApplication.Processor?.LowCodeUnit?.APIRoot || '',
        [Validators.required]
      )
    );

    this.ApplicationFormGroup.addControl(
      'security',
      this.formBldr.control(
        this.EditingApplication.Processor?.LowCodeUnit?.Security || '',
        [Validators.required]
      )
    );
  }

  protected setupLCUApplicationPointerForm(): void {
    this.ApplicationFormGroup.addControl(
      'applicationId',
      this.formBldr.control(
        this.EditingApplication.Processor?.LowCodeUnit?.ApplicationID || '',
        [Validators.required]
      )
    );
  }

  protected setupLCUGitHubForm(): void {
    this.ApplicationFormGroup.addControl(
      'build',
      this.formBldr.control(
        this.EditingApplication.Processor?.LowCodeUnit?.Build || '',
        [Validators.required]
      )
    );
  }

  protected setupLCUGitHubOAuthForm(): void {
    this.ApplicationFormGroup.addControl(
      'clientId',
      this.formBldr.control(
        this.EditingApplication.Processor?.LowCodeUnit?.ClientID || '',
        [Validators.required]
      )
    );

    this.ApplicationFormGroup.addControl(
      'clientSecret',
      this.formBldr.control(
        this.EditingApplication.Processor?.LowCodeUnit?.ClientSecret || '',
        [Validators.required]
      )
    );
  }

  protected setupLCUNPMForm(): void {
    // this.ApplicationFormGroup.addControl(
    //   'package',
    //   this.formBldr.control(
    //     this.EditingApplication.Processor?.LowCodeUnit?.Package || '',
    //     [Validators.required]
    //   )
    // );
    // this.ApplicationFormGroup.addControl(
    //   'version',
    //   this.formBldr.control(
    //     this.EditingApplication.Processor?.LowCodeUnit?.Version || '',
    //     [Validators.required]
    //   )
    // );
  }

  protected setupLCUSPAForm(): void {
    this.ApplicationFormGroup.addControl(
      'spaRoot',
      this.formBldr.control(
        this.EditingApplication.Processor?.LowCodeUnit?.SPARoot || '',
        [Validators.required]
      )
    );
  }

  protected setupLCUZipForm(): void {
    this.ApplicationFormGroup.addControl(
      'zipFile',
      this.formBldr.control(
        this.EditingApplication.Processor?.LowCodeUnit?.ZipFile || '',
        [Validators.required]
      )
    );
  }

  protected setupLcuTypeSubForm(): void {
    this.cleanupLcuTypeSubForm();

    // this.ApplicationFormGroup.removeControl('package');
    // this.ApplicationFormGroup.removeControl('version');

    this.ApplicationFormGroup.removeControl('spaRoot');

    this.ApplicationFormGroup.removeControl('zipFile');

    if (this.LCUType) {
      switch (this.LCUType) {
        case 'API':
          this.setupLCUAPIForm();
          break;

        case 'ApplicationPointer':
          this.setupLCUApplicationPointerForm();
          break;

        case 'GitHub':
          this.setupLCUGitHubForm();
          break;

        case 'GitHubOAuth':
          this.setupLCUGitHubOAuthForm();
          break;

        case 'NPM':
          this.setupLCUNPMForm();
          break;

        case 'SPA':
          this.setupLCUSPAForm();
          break;

        case 'Zip':
          this.setupLCUZipForm();
          break;
      }
    }
  }

  protected setupOAuthForm(): void {
    this.LCUType = this.EditingApplication.Processor?.LowCodeUnit?.Type || '';

    this.ApplicationFormGroup.addControl(
      'scopes',
      this.formBldr.control(
        this.EditingApplication.Processor?.Scopes?.Join(' ') || '',
        [Validators.required]
      )
    );

    this.ApplicationFormGroup.addControl(
      'tokenLookup',
      this.formBldr.control(
        this.EditingApplication.Processor?.TokenLookup || '',
        [Validators.required]
      )
    );

    this.ApplicationFormGroup.addControl(
      'lcuType',
      this.formBldr.control(this.LCUType, [Validators.required])
    );
  }

  protected setupProxyForm(): void {
    this.LCUType = this.EditingApplication.Processor?.LowCodeUnit?.Type || '';

    this.ApplicationFormGroup.addControl(
      'inboundPath',
      this.formBldr.control(
        this.EditingApplication.Processor?.InboundPath || '',
        [Validators.required]
      )
    );

    this.ApplicationFormGroup.addControl(
      'lcuType',
      this.formBldr.control(this.LCUType, [Validators.required])
    );
  }

  protected setupProcessorTypeSubForm(): void {
    this.cleanupProcessorTypeSubForm();

    if (this.ProcessorType) {
      switch (this.ProcessorType) {
        case 'DFS':
          this.setupDfsForm();
          break;

        case 'OAuth':
          this.setupOAuthForm();
          break;

        case 'Proxy':
          this.setupProxyForm();
          break;

        case 'Redirect':
          this.setupRedirectForm();
          break;
      }
    }
  }

  protected setupRedirectForm(): void {
    this.ApplicationFormGroup.addControl(
      'redirect',
      this.formBldr.control(this.EditingApplication.Processor?.Redirect || '', [
        Validators.required,
      ])
    );

    this.ApplicationFormGroup.addControl(
      'permanent',
      this.formBldr.control(
        this.EditingApplication.Processor?.Permanent || '',
        []
      )
    );

    this.ApplicationFormGroup.addControl(
      'preserveMethod',
      this.formBldr.control(
        this.EditingApplication.Processor?.PreserveMethod || '',
        []
      )
    );
  }

  protected setupSecurityForm(): void {
    this.ApplicationFormGroup.addControl(
      'isPrivate',
      this.formBldr.control(
        this.EditingApplication.LookupConfig?.IsPrivate || false,
        [Validators.required]
      )
    );

    this.ApplicationFormGroup.addControl(
      'isTriggerSignIn',
      this.formBldr.control(
        this.EditingApplication.LookupConfig?.IsTriggerSignIn || false,
        [Validators.required]
      )
    );
  }
}
