import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoutesPageComponent } from './routes-page.component';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [],
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: RoutesPageComponent,
            },
        ]),
        CommonModule,
    ],
})
export class RoutesPageModule {}
