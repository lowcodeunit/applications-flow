import { FormsService } from './services/forms.service';
import { ProjectService } from './services/project.service';
import { NgModule, ModuleWithProviders, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FathymSharedModule, MaterialModule } from '@lcu/common';
import { ApplicationsFlowStateContext } from './state/applications-flow-state.context';
import { ApplicationsFlowProjectsElementComponent } from './elements/projects/projects.component';
import { AppHostModule } from '@lowcodeunit/app-host-common';
import { ApplicationsFlowService } from './services/applications-flow.service';
import { HostingDetailsFormGroupComponent } from './elements/projects/controls/hosting-details-form-group/hosting-details-form-group.component';
import { CreateProjectWizardComponent } from './elements/projects/controls/create-project-wizard/create-project-wizard.component';
import { DynamicTabsComponent } from './elements/dynamic-tabs/dynamic-tabs.component';
import { HeaderComponent } from './elements/projects/controls/header/header.component';
import { ProjectTabsComponent } from './elements/projects/controls/project-tabs/project-tabs.component';
import { DomainsComponent } from './elements/projects/controls/tabs/domains/domains.component';
import { ProjectItemsComponent } from './elements/projects/controls/project-items/project-items.component';
import { BuildsComponent } from './elements/projects/controls/builds/builds.component';
import { RecentActivitiesComponent } from './elements/projects/controls/recent-activities/recent-activities.component';
import { FormCardComponent } from './elements/form-card/form-card.component';
import { ProjectNameComponent } from './elements/projects/controls/tabs/general/forms/project-details/project-details.component';
import { RootDirectoryComponent } from './elements/projects/controls/tabs/general/forms/root-directory/root-directory.component';
import { ApplicationsFlowEventsService } from './services/applications-flow-events.service';
import { BaseFormComponent } from './elements/base-form/base-form.component';
import { BaseFormTestComponent } from './elements/projects/controls/tabs/general/forms/base-form-test/base-form-test.component';
import { GitAuthComponent } from './elements/projects/controls/git-auth/git-auth.component';
import { SourceControlFormControlsComponent } from './elements/projects/controls/forms/source-control/source-control.component';
import { AppsFlowComponent } from './elements/projects/controls/tabs/apps-flow/apps-flow.component';
import { NPMService } from './services/npm.service';
import { NpmPackageSelectComponent } from './elements/projects/controls/tabs/apps-flow/npm-package-select/npm-package-select.component';
import { DevOpsComponent } from './elements/projects/controls/tabs/devops/devops.component';
import { DFSModifiersComponent } from './elements/projects/controls/tabs/dfs-modifiers/dfs-modifiers.component';
import { FlowToolComponent } from './elements/flow-tool/flow-tool.component';

@NgModule({
  declarations: [
    ApplicationsFlowProjectsElementComponent,
    HostingDetailsFormGroupComponent,
    CreateProjectWizardComponent,
    DynamicTabsComponent,
    HeaderComponent,
    ProjectTabsComponent,
    DomainsComponent,
    ProjectItemsComponent,
    BuildsComponent,
    RecentActivitiesComponent,
    FormCardComponent,
    ProjectNameComponent,
    RootDirectoryComponent,
    BaseFormComponent,
    BaseFormTestComponent,
    GitAuthComponent,
    SourceControlFormControlsComponent,
    AppsFlowComponent,
    DevOpsComponent,
    DFSModifiersComponent,
    NpmPackageSelectComponent,
    FlowToolComponent
  ],
  imports: [
    FathymSharedModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MaterialModule,
    AppHostModule,
    // LazyElementModule,
  ],
  exports: [
    ApplicationsFlowProjectsElementComponent,
    HostingDetailsFormGroupComponent,
    CreateProjectWizardComponent,
    DynamicTabsComponent,
    HeaderComponent,
    ProjectTabsComponent,
    DomainsComponent,
    ProjectItemsComponent,
    BuildsComponent,
    RecentActivitiesComponent,
    FormCardComponent,
    ProjectNameComponent,
    RootDirectoryComponent,
    BaseFormComponent,
    BaseFormTestComponent,
    GitAuthComponent,
    SourceControlFormControlsComponent,
    AppsFlowComponent,
    DevOpsComponent,
    DFSModifiersComponent,
    NpmPackageSelectComponent,
    FlowToolComponent
  ],
  entryComponents: [
    ApplicationsFlowProjectsElementComponent,
    DynamicTabsComponent,
    HeaderComponent,
    ProjectTabsComponent,
    DomainsComponent,
    ProjectItemsComponent,
    BuildsComponent,
    RecentActivitiesComponent,
    FormCardComponent,
    ProjectNameComponent,
    RootDirectoryComponent,
    BaseFormComponent,
    BaseFormTestComponent,
    GitAuthComponent,
    SourceControlFormControlsComponent,
    AppsFlowComponent,
    DevOpsComponent,
    DFSModifiersComponent,
    NpmPackageSelectComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA // Tells Angular we will have custom tags in our templates
  ]
})
export class ApplicationsFlowModule {
  static forRoot(): ModuleWithProviders<ApplicationsFlowModule> {
    return {
      ngModule: ApplicationsFlowModule,
      providers: [
        ApplicationsFlowStateContext,
        ApplicationsFlowService,
        ProjectService,
        NPMService,
        FormsService,
        ApplicationsFlowEventsService,
      ],
    };
  }
}
