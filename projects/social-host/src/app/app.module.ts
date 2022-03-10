import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  FathymSharedModule,
  LCUServiceSettings,
  MaterialModule,
} from '@lcu/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProjectsComponent } from './controls/projects/projects.component';
import { RoutesComponent } from './controls/routes/routes.component';
import { EnterpriseComponent } from './controls/enterprise/enterprise.component';
import { ApplicationsComponent } from './controls/applications/applications.component';
import { ApplicationsFlowModule } from '@lowcodeunit/applications-flow-common';
import { environment } from '../environments/environment';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AppHostModule } from '@lowcodeunit/app-host-common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SkeletonElementsModule } from "skeleton-elements/angular";
import { LazyElementModule, LazyElementsComponent } from '@lowcodeunit/lazy-element';




@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    AppComponent,
    ProjectsComponent,
    RoutesComponent,
    EnterpriseComponent,
    ApplicationsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FlexLayoutModule,
    LazyElementModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatCardModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FathymSharedModule.forRoot(),
    AppHostModule,
    ApplicationsFlowModule.forRoot(), 
    SkeletonElementsModule
  ],
  providers: [{
    provide: LCUServiceSettings,
    useValue: FathymSharedModule.DefaultServiceSettings(environment),
  }
],
  bootstrap: [AppComponent],
  exports: [],
  entryComponents: [
    ProjectsComponent,
    RoutesComponent,
    EnterpriseComponent,
    ApplicationsComponent
  ]
})
export class AppModule { }
