import { FormsService } from './services/forms.service';
import { ProjectService } from './services/project.service';
import {
    NgModule,
    ModuleWithProviders,
    CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FathymSharedModule, MaterialModule } from '@lcu/common';
import { ApplicationsFlowStateContext } from './state/applications-flow-state.context';
import { ApplicationsFlowProjectsElementComponent } from './elements/projects/projects.component';
import { AppHostModule } from '@lowcodeunit/app-host-common';
import { ApplicationsFlowService } from './services/applications-flow.service';
import { HostingDetailsFormGroupComponent } from './elements/projects/controls/hosting-details-form-group/hosting-details-form-group.component';
import { CreateProjectWizardComponent } from './elements/projects/controls/create-project-wizard/create-project-wizard.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
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
import { SlottedCardComponent } from './elements/slotted-card/slotted-card.component';
import { ProjectInfoCardComponent } from './elements/project-info-card/project-info-card.component';
import { AnalyticsCardComponent } from './elements/analytics-card/analytics-card.component';
import { FeedCardSmComponent } from './elements/feed-card-sm/feed-card-sm.component';
import { MainFeedCardComponent } from './elements/main-feed-card/main-feed-card.component';
import { TwoColumnHeaderComponent } from './elements/two-column-header/two-column-header.component';
import { CardCarouselComponent } from './elements/card-carousel/card-carousel.component';
import { SecurityToggleComponent } from './controls/security-toggle/security-toggle.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EaCService } from './services/eac.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
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
import { NewApplicationDialogComponent } from './dialogs/new-application-dialog/new-application-dialog.component';
import { ProcessorDetailsDialogComponent } from './dialogs/processor-details-dialog/processor-details-dialog.component';
import { SkeletonElementsModule } from 'skeleton-elements/angular';
import { SkeletonFeedCardComponent } from './elements/skeleton-feed-card/skeleton-feed-card.component';
import { UpgradeDialogComponent } from './dialogs/upgrade-dialog/upgrade-dialog.component';
import { EmulatedDevicesToggleComponent } from './controls/emulated-devices-toggle/emulated-devices-toggle.component';
import { IoTEnsembleService } from './services/iot-ensemble.service';
import { FeedHeaderComponent } from './elements/feed-header/feed-header.component';
import { FeedHeaderDialogComponent } from './dialogs/feed-header-dialog/feed-header-dialog.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { DFSModifiersDialogComponent } from './dialogs/dfs-modifiers-dialog/dfs-modifiers-dialog.component';
import { DFSModifiersFormComponent } from './controls/dfs-modifiers-form/dfs-modifiers-form.component';
import { StateConfigDialogComponent } from './dialogs/state-config-dialog/state-config-dialog.component';
import { StateConfigFormComponent } from './controls/state-config-form/state-config-form.component';
import { EditProjectDialogComponent } from './dialogs/edit-project-dialog/edit-project-dialog.component';
import { EditProjectFormComponent } from './controls/edit-project-form/edit-project-form.component';
import { FeedCommentFormComponent } from './controls/feed-comment-form/feed-comment-form.component';
import { PageHeaderComponent } from './elements/page-header/page-header.component';
import { ConnectedSourceComponent } from './controls/connected-source/connected-source.component';
import { UserAccountDialogComponent } from './dialogs/user-account-dialog/user-account-dialog.component';
import { ProductDiscoveryCardComponent } from './elements/product-discovery-card/product-discovery-card.component';
import { AdvertisementCardComponent } from './elements/advertisement-card/advertisement-card.component';
import { FeedFilterComponent } from './elements/feed-filter/feed-filter.component';
import { QuestionCardComponent } from './elements/question-card/question-card.component';
import { TwoColumnComponent } from './elements/two-column/two-column.component';
import { TeamMemberCardComponent } from './elements/team-member-card/team-member-card.component';
import { ActivityCardComponent } from './elements/activity-card/activity-card.component';
import { ProjectWizardCardComponent } from './elements/project-wizard-card/project-wizard-card.component';
import { UsageStatsComponent } from './elements/usage-stats/usage-stats.component';
import { SlottedCardLgComponent } from './elements/slotted-card-lg/slotted-card-lg.component';
import { SocialUIService } from './services/social-ui.service';
import { DashboardToolbarComponent } from './elements/dashboard-toolbar/dashboard-toolbar.component';
import { ProjectCardComponent } from './elements/project-card/project-card.component';
import { RouteCardComponent } from './elements/route-card/route-card.component';
import { AddTeamMemberDialogComponent } from './dialogs/add-team-member-dialog/add-team-member-dialog.component';
import { ApplicationsCardComponent } from './elements/applications-card/applications-card.component';

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
        DFSModifiersFormComponent,
        ThreeColumnComponent,
        SlottedCardComponent,
        SlottedCardLgComponent,
        ProjectInfoCardComponent,
        AnalyticsCardComponent,
        FeedCardSmComponent,
        FeedHeaderComponent,
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
        DFSModifiersDialogComponent,
        CustomDomainDialogComponent,
        EditApplicationDialogComponent,
        NewApplicationDialogComponent,
        ProcessorDetailsDialogComponent,
        SkeletonFeedCardComponent,
        UpgradeDialogComponent,
        EmulatedDevicesToggleComponent,
        FeedHeaderDialogComponent,
        StateConfigDialogComponent,
        StateConfigFormComponent,
        EditProjectDialogComponent,
        EditProjectFormComponent,
        FeedCommentFormComponent,
        PageHeaderComponent,
        ConnectedSourceComponent,
        UserAccountDialogComponent,
        ProductDiscoveryCardComponent,
        AdvertisementCardComponent,
        FeedFilterComponent,
        QuestionCardComponent,
        TwoColumnComponent,
        TeamMemberCardComponent,
        ActivityCardComponent,
        ProjectWizardCardComponent,
        UsageStatsComponent,
        DashboardToolbarComponent,
        ProjectCardComponent,
        RouteCardComponent,
        AddTeamMemberDialogComponent,
        ApplicationsCardComponent,
    ],
    imports: [
        AngularEditorModule,
        ClipboardModule,
        FathymSharedModule,
        FormsModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        MaterialModule,
        AppHostModule,
        MatTooltipModule,
        MatSlideToggleModule,
        SkeletonElementsModule,

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
        ThreeColumnComponent,
        SlottedCardComponent,
        SlottedCardLgComponent,
        ProjectInfoCardComponent,
        AnalyticsCardComponent,
        FeedCardSmComponent,
        FeedHeaderComponent,
        FeedHeaderDialogComponent,
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
        EditApplicationDialogComponent,
        NewApplicationDialogComponent,
        ProcessorDetailsDialogComponent,
        SkeletonFeedCardComponent,
        UpgradeDialogComponent,
        EmulatedDevicesToggleComponent,
        FeedHeaderDialogComponent,
        DFSModifiersDialogComponent,
        DFSModifiersFormComponent,
        StateConfigDialogComponent,
        StateConfigFormComponent,
        EditProjectDialogComponent,
        EditProjectFormComponent,
        FeedCommentFormComponent,
        PageHeaderComponent,
        ConnectedSourceComponent,
        UserAccountDialogComponent,
        ProductDiscoveryCardComponent,
        AdvertisementCardComponent,
        FeedFilterComponent,
        QuestionCardComponent,
        TwoColumnComponent,
        TeamMemberCardComponent,
        ActivityCardComponent,
        ProjectWizardCardComponent,
        UsageStatsComponent,
        DashboardToolbarComponent,
        ProjectCardComponent,
        RouteCardComponent,
        AddTeamMemberDialogComponent,
        ApplicationsCardComponent,
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
        NpmPackageSelectComponent,
        ThreeColumnComponent,
        SlottedCardComponent,
        SlottedCardLgComponent,
        ProjectInfoCardComponent,
        AnalyticsCardComponent,
        FeedCardSmComponent,
        FeedHeaderComponent,
        MainFeedCardComponent,
        TwoColumnHeaderComponent,
        CardCarouselComponent,
        SecurityToggleComponent,
        ProcessorDetailsFormComponent,
        DFSModifiersFormComponent,
        SourceControlFormComponent,
        BuildPipelineFormComponent,
        DevopsSourceControlFormComponent,
        DFSModifiersDialogComponent,
        SourceControlDialogComponent,
        BuildPipelineDialogComponent,
        EditApplicationFormComponent,
        BreadcrumbComponent,
        CustomDomainDialogComponent,
        EditApplicationDialogComponent,
        EmulatedDevicesToggleComponent,
        ConnectedSourceComponent,
        AddTeamMemberDialogComponent,
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA, // Tells Angular we will have custom tags in our templates
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
                EaCService,
                IoTEnsembleService,
                SocialUIService,
            ],
        };
    }
}
