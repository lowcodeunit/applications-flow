import { FormsService } from './services/forms.service';
import { ProjectService } from './services/project.service';
import { NgModule, ModuleWithProviders } from '@angular/core';
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
import { GeneralComponent } from './elements/projects/controls/tabs/general/general.component';
import { DomainsComponent } from './elements/projects/controls/tabs/domains/domains.component';
import { ProjectItemsComponent } from './elements/projects/controls/project-items/project-items.component';
import { BuildsComponent } from './elements/projects/controls/builds/builds.component';
import { RecentActivitiesComponent } from './elements/projects/controls/recent-activities/recent-activities.component';
import { FormCardComponent } from './elements/form-card/form-card.component';
import { ProjectNameComponent } from './elements/projects/controls/tabs/general/forms/project-details/project-details.component';
import { RootDirectoryComponent } from './elements/projects/controls/tabs/general/forms/root-directory/root-directory.component';
import { BaseFormComponent } from './elements/base-form/base-form.component';
import { BaseFormTestComponent } from './elements/projects/controls/tabs/general/forms/base-form-test/base-form-test.component';
import { GitAuthComponent } from './elements/projects/controls/git-auth/git-auth.component';
import { SourceControlFormControlsComponent } from './elements/projects/controls/forms/source-control/source-control.component';
import { AppsFlowComponent } from './elements/projects/controls/tabs/apps-flow/apps-flow.component';
import { NPMService } from './services/npm.service';
import { NpmPackageSelectComponent } from './elements/projects/controls/tabs/apps-flow/npm-package-select/npm-package-select.component';
import { DevOpsComponent } from './elements/projects/controls/tabs/devops/devops.component';
import { DFSModifiersComponent } from './elements/projects/controls/tabs/dfs-modifiers/dfs-modifiers.component';
import { ThreeColumnComponent } from './elements/three-column/three-column.component';
import { ColumnInfoCardComponent } from './elements/column-info-card/column-info-card.component';
import { SlottedCardComponent } from './elements/slotted-card/slotted-card.component';
import { ProjectInfoCardComponent } from './elements/project-info-card/project-info-card.component';
import { AnalyticsCardComponent } from './elements/analytics-card/analytics-card.component';
import { FeedCardSmComponent } from './elements/feed-card-sm/feed-card-sm.component';
import { GhControlComponent } from './elements/gh-control/gh-control.component';
import { MainFeedCardComponent } from './elements/main-feed-card/main-feed-card.component';
import { TwoColumnHeaderComponent } from './elements/two-column-header/two-column-header.component';
import { CardCarouselComponent } from './elements/card-carousel/card-carousel.component';
import { SecurityToggleComponent } from './controls/security-toggle/security-toggle.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EaCService } from './services/eac.service';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { ProcessorDetailsFormComponent } from './controls/processor-details-form/processor-details-form.component';
import { SourceControlFormComponent } from './controls/source-control-form/source-control-form.component';
import { BuildPipelineFormComponent } from './controls/build-pipeline-form/build-pipeline-form.component';
import { DevopsSourceControlFormComponent } from './controls/devops-source-control-form/devops-source-control-form.component';
import { SourceControlDialogComponent } from './dialogs/source-control-dialog/source-control-dialog.component';
import { BuildPipelineDialogComponent } from './dialogs/build-pipeline-dialog/build-pipeline-dialog.component';
import { EditApplicationFormComponent } from './controls/edit-application-form/edit-application-form.component';
import { BreadcrumbComponent } from './elements/breadcrumb/breadcrumb.component';
import { CustomDomainDialogComponent } from './dialogs/custom-domain-dialog/custom-domain-dialog.component';
import { EditApplicationDialogComponent } from './dialogs/edit-application-dialog/edit-application-dialog.component';

@NgModule({
  declarations: [
    ApplicationsFlowProjectsElementComponent,
    HostingDetailsFormGroupComponent,
    CreateProjectWizardComponent,
    DynamicTabsComponent,
    HeaderComponent,
    ProjectTabsComponent,
    GeneralComponent,
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
    ThreeColumnComponent,
    ColumnInfoCardComponent,
    SlottedCardComponent,
    ProjectInfoCardComponent,
    AnalyticsCardComponent,
    FeedCardSmComponent,
    GhControlComponent,
    MainFeedCardComponent,
    TwoColumnHeaderComponent,
    CardCarouselComponent,
    SecurityToggleComponent,
    ProcessorDetailsFormComponent,
    SourceControlFormComponent,
    BuildPipelineFormComponent,
    DevopsSourceControlFormComponent,
    SourceControlDialogComponent,
    BuildPipelineDialogComponent,
    EditApplicationFormComponent,
    BreadcrumbComponent,
    CustomDomainDialogComponent,
    EditApplicationDialogComponent
  ],
  imports: [
    FathymSharedModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MaterialModule,
    AppHostModule,
    MatTooltipModule,
    MatSlideToggleModule
    // LazyElementModule,
  ],
  exports: [
    ApplicationsFlowProjectsElementComponent,
    HostingDetailsFormGroupComponent,
    CreateProjectWizardComponent,
    DynamicTabsComponent,
    HeaderComponent,
    ProjectTabsComponent,
    GeneralComponent,
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
    ThreeColumnComponent,
    ColumnInfoCardComponent,
    SlottedCardComponent,
    ProjectInfoCardComponent,
    AnalyticsCardComponent,
    FeedCardSmComponent,
    GhControlComponent,
    MainFeedCardComponent,
    TwoColumnHeaderComponent,
    CardCarouselComponent,
    SecurityToggleComponent,
    ProcessorDetailsFormComponent,
    SourceControlFormComponent,
    BuildPipelineFormComponent,
    DevopsSourceControlFormComponent,
    SourceControlDialogComponent,
    BuildPipelineDialogComponent,
    EditApplicationFormComponent,
    BreadcrumbComponent,
    CustomDomainDialogComponent,
    EditApplicationDialogComponent
  ],
  entryComponents: [
    ApplicationsFlowProjectsElementComponent,
    DynamicTabsComponent,
    HeaderComponent,
    ProjectTabsComponent,
    GeneralComponent,
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
    ThreeColumnComponent,
    ColumnInfoCardComponent,
    SlottedCardComponent,
    ProjectInfoCardComponent,
    AnalyticsCardComponent,
    FeedCardSmComponent,
    GhControlComponent,
    MainFeedCardComponent,
    TwoColumnHeaderComponent,
    CardCarouselComponent,
    SecurityToggleComponent,
    ProcessorDetailsFormComponent,
    SourceControlFormComponent,
    BuildPipelineFormComponent,
    DevopsSourceControlFormComponent,
    SourceControlDialogComponent,
    BuildPipelineDialogComponent,
    EditApplicationFormComponent,
    BreadcrumbComponent,
    CustomDomainDialogComponent,
    EditApplicationDialogComponent
  ],
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
        EaCService
      ],
    };
  }
}
