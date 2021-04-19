import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FathymSharedModule, MaterialModule } from '@lcu/common';
import { ApplicationsFlowStateContext } from './state/applications-flow-state.context';
import { ApplicationsFlowProjectsElementComponent } from './elements/projects/projects.component';
import { AppHostModule } from '@lowcodeunit/app-host-common';

@NgModule({
  declarations: [ApplicationsFlowProjectsElementComponent],
  imports: [
    FathymSharedModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MaterialModule,
    AppHostModule
    // LazyElementModule,
  ],
  exports: [ApplicationsFlowProjectsElementComponent],
  entryComponents: [ApplicationsFlowProjectsElementComponent]
})
export class ApplicationsFlowModule {
  static forRoot(): ModuleWithProviders<ApplicationsFlowModule> {
    return {
      ngModule: ApplicationsFlowModule,
      providers: [ApplicationsFlowStateContext]
    };
  }
}
