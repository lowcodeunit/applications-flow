import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
    FathymSharedModule,
    LCUServiceSettings,
    MaterialModule,
} from '@lcu/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ApplicationsFlowModule } from '@lowcodeunit/applications-flow-common';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { KrakynToolComponent } from './elements/krakyn-tool/krakyn-tool.component';

@NgModule({
    declarations: [AppComponent, KrakynToolComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        ApplicationsFlowModule.forRoot(),
        MaterialModule,
    ],
    providers: [
        {
            provide: LCUServiceSettings,
            useValue: FathymSharedModule.DefaultServiceSettings(environment),
        },
    ],
    bootstrap: [AppComponent],
    exports: [KrakynToolComponent],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA, // Tells Angular we will have custom tags in our templates
    ],
})
export class AppModule {}
