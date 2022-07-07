import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
    FathymSharedModule,
    LCUServiceSettings,
    MaterialModule,
} from '@lcu/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularEditorModule } from '@kolkov/angular-editor';
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
import { SkeletonElementsModule } from 'skeleton-elements/angular';
import { LazyElementModule } from '@lowcodeunit/lazy-element';
import { IoTComponent } from './controls/iot/iot.component';
import { DiscoverComponent } from './controls/discover/discover.component';
import { HomeComponent } from './controls/home/home.component';
import { Enterprise1Component } from './controls/enterprise-1/enterprise-1.component';
import { Enterprise2Component } from './controls/enterprise-2/enterprise-2.component';
import { Enterprise3Component } from './controls/enterprise-3/enterprise-3.component';

@NgModule({
    declarations: [
        AppComponent,
        ProjectsComponent,
        RoutesComponent,
        DiscoverComponent,
        EnterpriseComponent,
        Enterprise1Component,
        Enterprise2Component,
        Enterprise3Component,
        IoTComponent,
        ApplicationsComponent,
        HomeComponent,
    ],
    imports: [
        AngularEditorModule,
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
        SkeletonElementsModule,
    ],
    providers: [
        {
            provide: LCUServiceSettings,
            useValue: FathymSharedModule.DefaultServiceSettings(environment),
        },
    ],
    bootstrap: [AppComponent],
    exports: [HomeComponent],
    entryComponents: [
        ProjectsComponent,
        RoutesComponent,
        DiscoverComponent,
        EnterpriseComponent,
        Enterprise1Component,
        Enterprise2Component,
        Enterprise3Component,
        ApplicationsComponent,
        IoTComponent,
        HomeComponent,
    ],
})
export class AppModule {}
