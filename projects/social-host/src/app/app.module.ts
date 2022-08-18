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
import { ProjectComponent } from './controls/project/project.component';
import { RoutesComponent } from './controls/routes/routes.component';
import { EnterpriseComponent } from './controls/enterprise-old/enterprise-old.component';
import { ApplicationsOldComponent } from './controls/applications-old/applications-old.component';
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
import { Enterprise4Component } from './controls/enterprise/enterprise.component';
import { DevOpsComponent } from './controls/dev-ops/dev-ops.component';
import { ModifiersComponent } from './controls/modifiers/modifiers.component';
import { TeamMembersComponent } from './controls/team-members/team-members.component';
import { ProjectPageComponent } from './controls/project-page/project-page.component';
import { RoutesPageComponent } from './controls/routes-page/routes-page.component';
import { CustomDomainPageComponent } from './controls/custom-domain-page/custom-domain-page.component';
import { StateConfigPageComponent } from './controls/state-config-page/state-config-page.component';
import { ApplicationComponent } from './controls/application/application.component';

@NgModule({
    declarations: [
        AppComponent,
        ProjectComponent,
        RoutesComponent,
        DiscoverComponent,
        EnterpriseComponent,
        Enterprise4Component,
        IoTComponent,
        ApplicationsOldComponent,
        HomeComponent,
        DevOpsComponent,
        ModifiersComponent,
        TeamMembersComponent,
        ProjectPageComponent,
        RoutesPageComponent,
        CustomDomainPageComponent,
        StateConfigPageComponent,
        ApplicationComponent,
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
    exports: [
        TeamMembersComponent,
        ProjectPageComponent,
        RoutesPageComponent,
        CustomDomainPageComponent,
        StateConfigPageComponent,
        ApplicationComponent,
    ],
    entryComponents: [
        ProjectComponent,
        RoutesComponent,
        RoutesPageComponent,
        DiscoverComponent,
        EnterpriseComponent,
        Enterprise4Component,
        ApplicationsOldComponent,
        DevOpsComponent,
        ModifiersComponent,
        IoTComponent,
        HomeComponent,
        CustomDomainPageComponent,
        StateConfigPageComponent,
    ],
})
export class AppModule {}
