import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IoTComponent } from './iot.component';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [],
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: IoTComponent,
            },
        ]),
        CommonModule,
    ],
})
export class IotModule {}
