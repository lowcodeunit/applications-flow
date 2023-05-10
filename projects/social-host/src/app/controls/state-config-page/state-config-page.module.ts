import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateConfigPageComponent } from './state-config-page.component';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [],
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: StateConfigPageComponent,
            },
        ]),
        CommonModule,
    ],
})
export class StateConfigPageModule {}
