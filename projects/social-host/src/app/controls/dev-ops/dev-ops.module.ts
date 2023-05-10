import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevOpsComponent } from './dev-ops.component';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [],
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: DevOpsComponent,
            },
        ]),
        CommonModule,
    ],
})
export class DevOpsModule {}
