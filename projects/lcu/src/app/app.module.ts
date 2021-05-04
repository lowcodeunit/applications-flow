import { DoBootstrap } from '@angular/core';
import { Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import {
  ApplicationsFlowModule,
  ApplicationsFlowProjectsElementComponent,
} from '@lowcodeunit/applications-flow-common';
import { SELECTOR_APPLICATIONS_FLOW_PROJECTS_ELEMENT } from '@lowcodeunit/applications-flow-common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  FathymSharedModule,
  LCUServiceSettings,
  MaterialModule,
} from '@lcu/common';
import { environment } from '../environments/environment';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppHostModule } from '@lowcodeunit/app-host-common';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FathymSharedModule.forRoot(),
    MaterialModule,
    FlexLayoutModule,
    AppHostModule.forRoot(),
    ApplicationsFlowModule.forRoot(),
  ],
  providers: [
    {
      provide: LCUServiceSettings,
      useValue: FathymSharedModule.DefaultServiceSettings(environment),
    },
  ],
  exports: [],
})
export class AppModule implements DoBootstrap {
  constructor(protected injector: Injector) {}

  public ngDoBootstrap() {
    const projects = createCustomElement(
      ApplicationsFlowProjectsElementComponent,
      { injector: this.injector }
    );

    customElements.define(
      SELECTOR_APPLICATIONS_FLOW_PROJECTS_ELEMENT,
      projects
    );
  }
}
