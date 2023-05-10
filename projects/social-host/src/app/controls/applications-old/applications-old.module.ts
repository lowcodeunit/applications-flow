import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationsOldComponent } from './applications-old.component';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [],
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: ApplicationsOldComponent,
            },
        ]),
        CommonModule,
    ],
})
export class ApplicationsOldModule {}
