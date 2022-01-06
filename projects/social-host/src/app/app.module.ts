import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  FathymSharedModule,
  LCUServiceSettings,
  MaterialModule,
} from '@lcu/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './controls/home/home.component';
import { ProjectsComponent } from './controls/projects/projects.component';
import { RoutesComponent } from './controls/routes/routes.component';
import { EnterpriseComponent } from './controls/enterprise/enterprise.component';
import { SettingsComponent } from './controls/settings/settings.component';
import { ApplicationsComponent } from './controls/applications/applications.component';
import { ThemeBuilderModule } from '@lowcodeunit/lcu-theme-builder-common';
import { ApplicationsFlowModule } from 'projects/common/src/lib/applications-flow.module';
import {MatButtonModule} from '@angular/material/button';
import { environment } from '../environments/environment';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProjectsComponent,
    RoutesComponent,
    EnterpriseComponent,
    SettingsComponent,
    ApplicationsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FlexLayoutModule,
    MaterialModule,
    FathymSharedModule.forRoot(),
    ThemeBuilderModule,
    ApplicationsFlowModule.forRoot(),  
    MatButtonModule
  ],
  providers: [{
    provide: LCUServiceSettings,
    useValue: FathymSharedModule.DefaultServiceSettings(environment),
  }
],
  bootstrap: [AppComponent],
  exports: [],
  entryComponents: [
    HomeComponent,
    ProjectsComponent,
    RoutesComponent,
    EnterpriseComponent,
    SettingsComponent,
    ApplicationsComponent
  ]
})
export class AppModule { }
