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
import { ProjectSettingsComponent } from './elements/projects/controls/project-settings/project-settings.component';
import { DynamicTabsComponent } from './elements/dynamic-tabs/dynamic-tabs.component';
import { HeaderComponent } from './elements/projects/controls/header/header.component';
import { ProjectTabsComponent } from './elements/projects/controls/project-tabs/project-tabs.component';
import { GeneralComponent } from './elements/projects/controls/tabs/general/general.component';
import { DomainsComponent } from './elements/projects/controls/tabs/domains/domains.component';
import { ProjectItemComponent } from './elements/projects/controls/project-item/project-item.component';

@NgModule({
  declarations: [
    ApplicationsFlowProjectsElementComponent,
    HostingDetailsFormGroupComponent,
    CreateProjectWizardComponent,
    ProjectSettingsComponent,
    DynamicTabsComponent,
    HeaderComponent,
    ProjectTabsComponent,
    GeneralComponent,
    DomainsComponent,
    ProjectItemComponent,
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
    ProjectSettingsComponent,
    DynamicTabsComponent,
    HeaderComponent,
    ProjectTabsComponent,
    GeneralComponent,
    DomainsComponent,
    ProjectItemComponent,
  ],
  entryComponents: [ApplicationsFlowProjectsElementComponent, DynamicTabsComponent, HeaderComponent, ProjectTabsComponent, GeneralComponent, DomainsComponent, ProjectItemComponent],
})
export class ApplicationsFlowModule {
  static forRoot(): ModuleWithProviders<ApplicationsFlowModule> {
    return {
      ngModule: ApplicationsFlowModule,
      providers: [ApplicationsFlowStateContext, ApplicationsFlowService],
    };
  }
}
