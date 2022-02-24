import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Guid } from '@lcu/common';
import { EaCApplicationAsCode, EaCEnvironmentAsCode, EaCSourceControl } from '@semanticjs/common';
import { ProcessorDetailsFormComponent } from '../../controls/processor-details-form/processor-details-form.component';
import { EaCService, SaveApplicationAsCodeEventRequest } from '../../services/eac.service';
import { ApplicationsFlowState } from '../../state/applications-flow.state';


export interface ProcessorDetailsDialogData {
  applicationLookup: string;
  environmentLookup: string;
  projectLookup: string;
}

@Component({
  selector: 'lcu-processor-details-dialog',
  templateUrl: './processor-details-dialog.component.html',
  styleUrls: ['./processor-details-dialog.component.scss']
})

export class ProcessorDetailsDialogComponent implements OnInit {

  @ViewChild(ProcessorDetailsFormComponent)
  public ProcessorDetailsFormControls: ProcessorDetailsFormComponent;

  public get Application(): EaCApplicationAsCode {
    return this.State?.EaC?.Applications[this.data.applicationLookup] || {};
  }

  public get Environment(): EaCEnvironmentAsCode {
    return this.State?.EaC?.Environments[this.data.environmentLookup];
  }

  public get SourceControls(): { [lookup: string]: EaCSourceControl } {
    return this.Environment?.Sources || {};
  }

  public get SourceControlLookups(): Array<string> {
    return Object.keys(this.Environment?.Sources || {});
  }

  public get State(): ApplicationsFlowState {
    return this.eacSvc.State;
  }

  constructor(protected eacSvc: EaCService, 
    public dialogRef: MatDialogRef<ProcessorDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProcessorDetailsDialogData) { }

  public ngOnInit(): void {
  }

  public CloseDialog(){
    this.dialogRef.close();
  }

  public SaveProcessorDetails(event: any): void {

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
              this.SourceControls[
                this.ProcessorDetailsFormControls.SourceControlFormControl.value
              ].Organization;

            app.LowCodeUnit.Repository =
              this.SourceControls[
                this.ProcessorDetailsFormControls.SourceControlFormControl.value
              ].Repository;

            app.LowCodeUnit.Build =
              this.ProcessorDetailsFormControls.BuildFormControl.value;

            app.LowCodeUnit.Path =
              this.Environment.DevOpsActions[
                this.SourceControls[
                  this.ProcessorDetailsFormControls.SourceControlFormControl.value
                ].DevOpsActionTriggerLookups[0]
              ].Path;
            // console.log("sourceControl lookup: ", this.ProcessorDetailsFormControls.SourceControlFormControl.value);

            app.LowCodeUnit.SourceControlLookup =
              this.ProcessorDetailsFormControls.SourceControlFormControl.value;
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
      ProjectLookup: this.data.projectLookup,
      Application: app,
      ApplicationLookup: this.data.applicationLookup || Guid.CreateRaw(),
    };

    this.eacSvc.SaveApplicationAsCode(saveAppReq);
  }

}
