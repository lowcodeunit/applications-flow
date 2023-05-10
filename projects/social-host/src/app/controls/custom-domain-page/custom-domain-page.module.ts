import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomDomainPageComponent } from './custom-domain-page.component';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [],
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: CustomDomainPageComponent,
            },
        ]),
        CommonModule,
    ],
})
export class CustomDomainPageModule {}
