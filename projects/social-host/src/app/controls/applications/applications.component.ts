import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Guid } from '@lcu/common';
import {
  ApplicationsFlowState,
  EaCService,
  SaveApplicationAsCodeEventRequest,
} from '@lowcodeunit/applications-flow-common';
import {
  EaCApplicationAsCode,
  EaCEnvironmentAsCode,
  EaCSourceControl,
} from '@semanticjs/common';
import { EditApplicationFormComponent } from 'projects/common/src/lib/controls/edit-application-form/edit-application-form.component';
import { ProcessorDetailsFormComponent } from 'projects/common/src/lib/controls/processor-details-form/processor-details-form.component';
import { SecurityToggleComponent } from 'projects/common/src/lib/controls/security-toggle/security-toggle.component';
import { SourceControlFormComponent } from 'projects/common/src/lib/controls/source-control-form/source-control-form.component';

@Component({
  selector: 'lcu-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss'],
})
export class ApplicationsComponent implements OnInit {
  @ViewChild(EditApplicationFormComponent)
  public ApplicationFormControls: EditApplicationFormComponent;

  @ViewChild(SecurityToggleComponent)
  public SecurityToggleFormControls: SecurityToggleComponent;

  @ViewChild(SourceControlFormComponent)
  public SourceControlFormControls: SourceControlFormComponent;

  @ViewChild(ProcessorDetailsFormComponent)
  public ProcessorDetailsFormControls: ProcessorDetailsFormComponent;

  public get Application(): EaCApplicationAsCode {
    return this.State?.EaC?.Applications[this.ApplicationLookup] || {};
  }

  public get Applications(): any {
    return this.State?.EaC?.Applications;
  }

  public get Environment(): EaCEnvironmentAsCode {
    return this.State?.EaC?.Environments[
      this.State?.EaC?.Enterprise?.PrimaryEnvironment
    ];
  }

  public get DefaultSourceControl(): EaCSourceControl {
    return {
      Organization: this.Application?.LowCodeUnit?.Organization,
      Repository: this.Application?.LowCodeUnit?.Repository,
    };
  }

  public get State(): ApplicationsFlowState {
    return this.eacSvc.State;
  }

  public ApplicationLookup: string;

  public Stats: any;

  public ProjectLookup: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    protected eacSvc: EaCService
  ) {
    this.Stats = [
      { Name: 'Retention Rate', Stat: '85%' },
      { Name: 'Bounce Rate', Stat: '38%' },
      { Name: 'Someother Rate', Stat: '5%' },
    ];

    this.activatedRoute.params.subscribe((params) => {
      this.ApplicationLookup = params['appLookup'];
      this.ProjectLookup = params['projectLookup'];
    });
  }

  public ngOnInit(): void {
    this.handleStateChange().then((eac) => {});
  }

  //  API Methods

  public HandleLeftClickEvent(event: any) {}

  public HandleRightClickEvent(event: any) {}

  public HandleSaveFormEvent(formValue: any) {
    console.log('Recieved Save Event: ', formValue);
    this.SaveApplication();
  }

  public UpgradeClicked() {}

  public SettingsClicked() {}

  public SaveApplication(): void {
    const app: EaCApplicationAsCode = this.Application;
    app.Application = {
      Name: this.ApplicationFormControls.NameFormControl.value,
      Description: this.ApplicationFormControls.DescriptionFormControl.value,
      PriorityShift: this.Application?.Application?.PriorityShift || 0,
    };

    app.LookupConfig.PathRegex = `${this.ApplicationFormControls.RouteFormControl.value}.*`;

    switch (app.Processor.Type) {
      case 'DFS':
        //will need to replace with this.RouteFormControl.value if other form added
        app.Processor.BaseHref =
          `${this.ApplicationFormControls.RouteFormControl.value}/`.replace(
            '//',
            '/'
          );

        break;
    }

    if (!app.LookupConfig.PathRegex.startsWith('/')) {
      app.LookupConfig.PathRegex = `/${app.LookupConfig.PathRegex}`;
    }

    const saveAppReq: SaveApplicationAsCodeEventRequest = {
      ProjectLookup: this.ProjectLookup,
      Application: app,
      ApplicationLookup: this.ApplicationLookup || Guid.CreateRaw(),
    };

    this.eacSvc.SaveApplicationAsCode(saveAppReq);
  }

  public SaveProcessorDetails(formValue: any): void {
    console.log('Recieved Save Event: ', formValue);

    const app: EaCApplicationAsCode = this.Application;
    app.LookupConfig.AllowedMethods =
      this.ProcessorDetailsFormControls.MethodsFormControl?.value
        ?.split(' ')
        .filter((v: string) => !!v);
    app.Processor.Type = this.ProcessorDetailsFormControls.ProcessorType;

    switch (app.Processor.Type) {
      case 'DFS':
        app.Processor.DefaultFile =
          this.ProcessorDetailsFormControls.DefaultFileFormControl.value ||
          'index.html';

        app.LowCodeUnit = {
          Type: this.ProcessorDetailsFormControls.LCUType,
        };

        switch (app.LowCodeUnit.Type) {
          case 'GitHub':
            app.LowCodeUnit.Organization =
              this.ProcessorDetailsFormControls.SourceControlFormControls.OrganizationFormControl.value;

            app.LowCodeUnit.Repository =
              this.ProcessorDetailsFormControls.SourceControlFormControls.RepositoryFormControl.value;

            app.LowCodeUnit.Build =
              this.ProcessorDetailsFormControls.BuildFormControl.value;

            app.LowCodeUnit.Path =
              this.ProcessorDetailsFormControls.SourceControlFormControls.BuildPathFormControl.value;
            break;

          case 'NPM':
            app.LowCodeUnit.Package =
              this.ProcessorDetailsFormControls.PackageFormControl.value;

            app.LowCodeUnit.Version =
              this.ProcessorDetailsFormControls.VersionFormControl.value;
            break;

          case 'WordPress':
            app.LowCodeUnit.APIRoot =
              this.ProcessorDetailsFormControls.APIRootFormControl.value;
            break;

          case 'Zip':
            app.LowCodeUnit.ZipFile =
              this.ProcessorDetailsFormControls.ZipFileFormControl.value;
            break;
        }
        break;

      case 'OAuth':
        app.Processor.Scopes =
          this.ProcessorDetailsFormControls.ScopesFormControl.value.split(' ');

        app.Processor.TokenLookup =
          this.ProcessorDetailsFormControls.TokenLookupFormControl.value;

        app.LowCodeUnit = {
          Type: this.ProcessorDetailsFormControls.LCUType,
        };

        switch (app.LowCodeUnit.Type) {
          case 'GitHubOAuth':
            app.LowCodeUnit.ClientID =
              this.ProcessorDetailsFormControls.ClientIDFormControl.value;

            app.LowCodeUnit.ClientSecret =
              this.ProcessorDetailsFormControls.ClientSecretFormControl.value;
            break;
        }
        break;

      case 'Proxy':
        app.Processor.InboundPath =
          this.ProcessorDetailsFormControls.InboundPathFormControl.value;

        app.LowCodeUnit = {
          Type: this.ProcessorDetailsFormControls.LCUType,
        };

        switch (app.LowCodeUnit.Type) {
          case 'API':
            app.LowCodeUnit.APIRoot =
              this.ProcessorDetailsFormControls.APIRootFormControl.value;

            app.LowCodeUnit.Security =
              this.ProcessorDetailsFormControls.SecurityFormControl.value;

            break;

          case 'SPA':
            app.LowCodeUnit.SPARoot =
              this.ProcessorDetailsFormControls.SPARootFormControl.value;
            break;
        }
        break;

      case 'Redirect':
        app.Processor.IncludeRequest =
          !!this.ProcessorDetailsFormControls.IncludeRequestFormControl.value;

        app.Processor.Permanent =
          !!this.ProcessorDetailsFormControls.PermanentFormControl.value;

        app.Processor.PreserveMethod =
          !!this.ProcessorDetailsFormControls.PreserveMethodFormControl.value;

        app.Processor.Redirect =
          this.ProcessorDetailsFormControls.RedirectFormControl.value;
        break;
    }

    if (!app.LookupConfig.PathRegex.startsWith('/')) {
      app.LookupConfig.PathRegex = `/${app.LookupConfig.PathRegex}`;
    }

    const saveAppReq: SaveApplicationAsCodeEventRequest = {
      ProjectLookup: this.ProjectLookup,
      Application: app,
      ApplicationLookup: this.ApplicationLookup || Guid.CreateRaw(),
    };

    this.eacSvc.SaveApplicationAsCode(saveAppReq);
  }

  public SaveSecuritySettings(formValue: any): void {
    console.log('Recieved Save Event: ', formValue);

    const app: EaCApplicationAsCode = this.Application;

    app.LookupConfig.IsPrivate =
      this.SecurityToggleFormControls.IsPrivateFormControl.value;
    app.LookupConfig.IsTriggerSignIn = this.SecurityToggleFormControls
      .IsPrivateFormControl.value
      ? this.SecurityToggleFormControls.IsTriggerSignInFormControl.value
      : false;

    if (!app.LookupConfig.PathRegex.startsWith('/')) {
      app.LookupConfig.PathRegex = `/${app.LookupConfig.PathRegex}`;
    }

    const saveAppReq: SaveApplicationAsCodeEventRequest = {
      ProjectLookup: this.ProjectLookup,
      Application: app,
      ApplicationLookup: this.ApplicationLookup || Guid.CreateRaw(),
    };

    this.eacSvc.SaveApplicationAsCode(saveAppReq);
  }

  // public SaveSourceControl(formValue: any): void {

  //   console.log('Recieved Save Event: ', formValue);

  //   const app: EaCApplicationAsCode = this.Application;

  //   const saveAppReq: SaveApplicationAsCodeEventRequest = {
  //     ProjectLookup: this.ProjectLookup,
  //     Application: app,
  //     ApplicationLookup: this.ApplicationLookup || Guid.CreateRaw(),
  //   };

  //   if (this.SourceControlFormControls.HasBuildFormControl.value && this.Application.Processor.Type !== 'redirect') {
  //     if (app) {
  //       app.SourceControlLookup = this.SourceControlFormControls.SourceControlLookupFormControl.value;
  //     }
  //   } else if (app) {
  //     app.SourceControlLookup = null;
  //   }

  //   this.eacSvc.SaveApplicationAsCode(saveAppReq);
  // }

  // public SaveApplication(event: string): void {
  //   const app: EaCApplicationAsCode = {
  //       Application: {
  //         Name: this.ApplicationFormControls.NameFormControl.value,
  //         Description: this.ApplicationFormControls.DescriptionFormControl.value,
  //         PriorityShift: this.Application?.Application?.PriorityShift || 0,
  //       },
  //       AccessRightLookups: [],
  //       DataTokens: {},
  //       LicenseConfigurationLookups: [],
  //       LookupConfig: {
  //         IsPrivate: this.SecurityToggleFormControls.IsPrivateFormControl.value,
  //         IsTriggerSignIn: this.SecurityToggleFormControls.IsPrivateFormControl.value
  //           ? this.SecurityToggleFormControls.IsTriggerSignInFormControl.value
  //           : false,
  //         PathRegex: `${this.ApplicationFormControls.RouteFormControl.value}.*`,
  //         QueryRegex: this.Application?.LookupConfig?.QueryRegex || '',
  //         HeaderRegex: this.Application?.LookupConfig?.HeaderRegex || '',
  //         AllowedMethods: this.ProcessorDetailsFormControls.MethodsFormControl?.value
  //           ?.split(' ')
  //           .filter((v: string) => !!v),
  //       },
  //       Processor: {
  //         Type: this.ProcessorDetailsFormControls.ProcessorType,
  //       },
  //     };

  //   switch (app.Processor.Type) {
  //     case 'DFS':
  //       //will need to replace with this.RouteFormControl.value if other form added
  //       app.Processor.BaseHref = `${this.ApplicationFormControls.RouteFormControl.value}/`.replace(
  //         '//',
  //         '/'
  //       );

  //       app.Processor.DefaultFile =
  //         this.ProcessorDetailsFormControls.DefaultFileFormControl.value || 'index.html';

  //       app.LowCodeUnit = {
  //         Type: this.ProcessorDetailsFormControls.LCUType,
  //       };

  //       switch (app.LowCodeUnit.Type) {
  //         case 'GitHub':
  //           app.LowCodeUnit.Organization =
  //             this.ProcessorDetailsFormControls.SourceControlFormControls.OrganizationFormControl.value;

  //           app.LowCodeUnit.Repository =
  //             this.ProcessorDetailsFormControls.SourceControlFormControls.RepositoryFormControl.value;

  //           app.LowCodeUnit.Build = this.ProcessorDetailsFormControls.BuildFormControl.value;

  //           app.LowCodeUnit.Path =
  //             this.ProcessorDetailsFormControls.SourceControlFormControls.BuildPathFormControl.value;
  //           break;

  //         case 'NPM':
  //           app.LowCodeUnit.Package = this.ProcessorDetailsFormControls.PackageFormControl.value;

  //           app.LowCodeUnit.Version = this.ProcessorDetailsFormControls.VersionFormControl.value;
  //           break;

  //         case 'Zip':
  //           app.LowCodeUnit.ZipFile = this.ProcessorDetailsFormControls.ZipFileFormControl.value;
  //           break;
  //       }
  //       break;

  //     case 'OAuth':
  //       app.Processor.Scopes = this.ProcessorDetailsFormControls.ScopesFormControl.value.split(' ');

  //       app.Processor.TokenLookup = this.ProcessorDetailsFormControls.TokenLookupFormControl.value;

  //       app.LowCodeUnit = {
  //         Type: this.ProcessorDetailsFormControls.LCUType,
  //       };

  //       switch (app.LowCodeUnit.Type) {
  //         case 'GitHubOAuth':
  //           app.LowCodeUnit.ClientID = this.ProcessorDetailsFormControls.ClientIDFormControl.value;

  //           app.LowCodeUnit.ClientSecret = this.ProcessorDetailsFormControls.ClientSecretFormControl.value;
  //           break;
  //       }
  //       break;

  //     case 'Proxy':
  //       app.Processor.InboundPath = this.ProcessorDetailsFormControls.InboundPathFormControl.value;

  //       app.LowCodeUnit = {
  //         Type: this.ProcessorDetailsFormControls.LCUType,
  //       };

  //       switch (app.LowCodeUnit.Type) {
  //         case 'API':
  //           app.LowCodeUnit.APIRoot = this.ProcessorDetailsFormControls.APIRootFormControl.value;

  //           app.LowCodeUnit.Security = this.ProcessorDetailsFormControls.SecurityFormControl.value;

  //           break;

  //         case 'SPA':
  //           app.LowCodeUnit.SPARoot = this.ProcessorDetailsFormControls.SPARootFormControl.value;
  //           break;
  //       }
  //       break;

  //     case 'Redirect':
  //       app.Processor.Permanent = !!this.ProcessorDetailsFormControls.PermanentFormControl.value;

  //       app.Processor.PreserveMethod = !!this.ProcessorDetailsFormControls.PreserveMethodFormControl.value;

  //       app.Processor.Redirect = this.ProcessorDetailsFormControls.RedirectFormControl.value;
  //       break;
  //   }

  //   if (!app.LookupConfig.PathRegex.startsWith('/')) {
  //     app.LookupConfig.PathRegex = `/${app.LookupConfig.PathRegex}`;
  //   }

  //   const saveAppReq: SaveApplicationAsCodeEventRequest = {
  //     ProjectLookup: this.ProjectLookup,
  //     Application: app,
  //     ApplicationLookup: this.ApplicationLookup || Guid.CreateRaw(),
  //   };

  //   if (this.SourceControlFormControls.HasBuildFormControl.value && this.ProcessorDetailsFormControls.ProcessorType !== 'redirect') {
  //     if (app) {
  //       app.SourceControlLookup = this.SourceControlFormControls.SourceControlLookupFormControl.value;
  //     }
  //   } else if (app) {
  //     app.SourceControlLookup = null;
  //   }

  //   this.eacSvc.SaveApplicationAsCode(saveAppReq);
  // }

  //HELPERS

  protected async handleStateChange(): Promise<void> {
    this.State.Loading = true;

    await this.eacSvc.EnsureUserEnterprise();
  }
}
