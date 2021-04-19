import { DoBootstrap } from '@angular/core';
import { Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { ApplicationsFlowProjectsElementComponent } from '@lowcodeunit/applications-flow-common';
import { SELECTOR_APPLICATIONS_FLOW_PROJECTS_ELEMENT } from '@lowcodeunit/applications-flow-common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FathymSharedModule, LCUServiceSettings } from '@lcu/common';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [],
  imports: [BrowserModule, BrowserAnimationsModule, FathymSharedModule],
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
