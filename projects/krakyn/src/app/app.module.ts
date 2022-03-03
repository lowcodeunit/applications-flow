import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FathymSharedModule, LCUServiceSettings } from '@lcu/common';
import {
  ApplicationsFlowModule
} from '@lowcodeunit/applications-flow-common';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ApplicationsFlowModule.forRoot(),
  ],
  providers: [
    {
      provide: LCUServiceSettings,
      // useValue: FathymSharedModule.DefaultServiceSettings(environment),
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
