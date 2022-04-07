import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FathymSharedModule, LCUServiceSettings } from '@lcu/common';
import { ApplicationsFlowModule } from '@lowcodeunit/applications-flow-common';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { KrakynToolComponent } from './elements/krakyn-tool/krakyn-tool.component';

@NgModule({
    declarations: [AppComponent, KrakynToolComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ApplicationsFlowModule.forRoot(),
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
