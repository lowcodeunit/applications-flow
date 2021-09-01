import { FormsService } from './../../../../../services/forms.service';
import { CardFormConfigModel } from './../../../../../models/card-form-config.model';
import { DomainModel } from './../../../../../models/domain.model';
import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ApplicationsFlowEventsService } from '../../../../../services/applications-flow-events.service';
import {
  EaCApplicationAsCode,
  EaCProcessor,
  EaCProjectAsCode,
} from '../../../../../models/eac.models';
import { Guid } from '@lcu/common';
import { MatSelectChange } from '@angular/material/select';

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

  public get RoutedApplications(): {
    [route: string]: Array<EaCApplicationAsCode>;
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

    routeBases = routeBases.sort((a, b) => b.localeCompare(a));

    let workingApps = [...(apps || [])];

    const routeSet =
      routeBases.reduce((prev, current) => {
        const routeMap = {
          ...prev,
        };

        routeMap[current] = workingApps.filter((wa) => {
          return wa.LookupConfig?.PathRegex.startsWith(current);
        });

        workingApps = workingApps.filter((wa) => {
          return routeMap[current].indexOf(wa) < 0;
        });

        return routeMap;
      }, {}) || {};

    return routeSet;
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

  @Input('data')
  public Data: {
    Applications: { [lookup: string]: EaCApplicationAsCode };
    Project: EaCProjectAsCode;
    ProjectLookup: string;
  };

  public get DefaultFileFormControl(): AbstractControl {
    return this.ApplicationFormGroup?.controls.defaultFile;
  }

  public get DescriptionFormControl(): AbstractControl {
    return this.ApplicationFormGroup?.controls.description;
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

  public get OrganizationFormControl(): AbstractControl {
    return this.ApplicationFormGroup?.controls.organization;
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

  public get RepositoryFormControl(): AbstractControl {
    return this.ApplicationFormGroup?.controls.repository;
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
    protected appsFlowEventsSvc: ApplicationsFlowEventsService
  ) {
    this.EditingApplicationLookup = null;
  }

  //  Life Cycle
  public ngOnInit(): void {
    if (this.ApplicationLookups?.length <= 0) {
      this.CreateNewApplication();
    }
  }

  //  API Methods
  public CreateNewApplication(): void {
    this.SetEditingApplication(Guid.CreateRaw());
  }

  public DeleteApplication(appLookup: string, appName: string): void {
    if (confirm(`Are you sure you want to delete application '${appName}'?`)) {
      this.appsFlowEventsSvc.DeleteApplication(appLookup);
    }
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
              this.OrganizationFormControl.value;

            processor.LowCodeUnit.Repository = this.RepositoryFormControl.value;

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
        processor.Permanent = this.PermanentFormControl.value;

        processor.PreserveMethod = this.PreserveMethodFormControl.value;

        processor.Redirect = this.RedirectFormControl.value;
        break;
    }

    const app: EaCApplicationAsCode = {
      Application: {
        Name: this.NameFormControl.value,
        Description: this.DescriptionFormControl.value,
        // Priority: this.PriorityFormControl.value,
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

    this.appsFlowEventsSvc.SaveApplicationAsCode({
      ProjectLookup: this.ProjectLookup,
      Application: app,
      ApplicationLookup: this.EditingApplicationLookup || Guid.CreateRaw(),
    });
  }

  public SetEditingApplication(appLookup: string): void {
    debugger;
    this.EditingApplicationLookup = appLookup;

    this.setupApplicationForm();
  }

  public StartsWith(app: EaCApplicationAsCode, appRouteBase: string): boolean {
    if (appRouteBase === '/') {
      return app?.LookupConfig?.PathRegex === '/.*';
    } else {
      return app?.LookupConfig?.PathRegex.startsWith(appRouteBase);
    }
  }

  public Unpack(appLookup: string, version?: string): void {
    this.appsFlowEventsSvc.UnpackLowCodeUnit({
      ApplicationLookup: appLookup,
      Version: version || 'latest',
    });
  }

  //  Helpers
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

      this.setupProcessorTypeSubForm();
    }
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
      'organization',
      this.formBldr.control(
        this.EditingApplication.Processor?.LowCodeUnit?.Organization || '',
        [Validators.required]
      )
    );

    this.ApplicationFormGroup.addControl(
      'repository',
      this.formBldr.control(
        this.EditingApplication.Processor?.LowCodeUnit?.Repository || '',
        [Validators.required]
      )
    );

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
    this.ApplicationFormGroup.removeControl('methods');
    this.ApplicationFormGroup.removeControl('apiRoot');
    this.ApplicationFormGroup.removeControl('security');

    this.ApplicationFormGroup.removeControl('applicationId');

    this.ApplicationFormGroup.removeControl('build');
    this.ApplicationFormGroup.removeControl('organization');
    this.ApplicationFormGroup.removeControl('repository');

    this.ApplicationFormGroup.removeControl('clientId');
    this.ApplicationFormGroup.removeControl('clientSecret');

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
    this.ApplicationFormGroup.removeControl('defaultFile');
    this.ApplicationFormGroup.removeControl('dfsLcuType');

    this.ApplicationFormGroup.removeControl('oauthLcuType');
    this.ApplicationFormGroup.removeControl('scopes');
    this.ApplicationFormGroup.removeControl('tokenLookup');

    this.ApplicationFormGroup.removeControl('inboundPath');
    this.ApplicationFormGroup.removeControl('proxyLcuType');

    this.ApplicationFormGroup.removeControl('redirect');

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

    this.setupSecurityForm();
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
        [Validators.required]
      )
    );

    this.ApplicationFormGroup.addControl(
      'preserveMethod',
      this.formBldr.control(
        this.EditingApplication.Processor?.PreserveMethod || '',
        [Validators.required]
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
