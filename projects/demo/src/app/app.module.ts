import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
    FathymSharedModule,
    LCUServiceSettings,
    MaterialModule,
} from '@lcu/common';
import { ApplicationsFlowModule } from '@lowcodeunit/applications-flow-common';
import { AppHostModule } from '@lowcodeunit/app-host-common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './controls/home/home.component';
import { ProjectsComponent } from './controls/projects/projects.component';
import { environment } from '../environments/environment';

@NgModule({
    declarations: [AppComponent, HomeComponent, ProjectsComponent],
    imports: [
        AppRoutingModule,
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
    bootstrap: [AppComponent],
    exports: [],
})
export class AppModule {}
