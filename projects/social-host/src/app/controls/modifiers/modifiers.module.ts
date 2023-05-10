import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModifiersComponent } from './modifiers.component';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [],
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: ModifiersComponent,
            },
        ]),
        CommonModule,
    ],
})
export class ModifiersModule {}
