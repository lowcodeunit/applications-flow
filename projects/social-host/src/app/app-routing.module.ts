import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationsComponent } from './controls/applications/applications.component';
import { EnterpriseComponent } from './controls/enterprise/enterprise.component';
import { ProjectsComponent } from './controls/projects/projects.component';
import { RoutesComponent } from './controls/routes/routes.component';
import { IoTComponent } from './controls/iot/iot.component';
import { DiscoverComponent } from './controls/discover/discover.component';
import { HomeComponent } from './controls/home/home.component';
import { Enterprise1Component } from './controls/enterprise-1/enterprise-1.component';
import { Enterprise2Component } from './controls/enterprise-2/enterprise-2.component';
import { Enterprise3Component } from './controls/enterprise-3/enterprise-3.component';

const routes: Routes = [
    {
        path: 'application/:enterprise/:appLookup/:appRoute/:projectLookup',
        component: ApplicationsComponent,
    },
    {
        path: 'project/:enterprise/:projectLookup',
        component: ProjectsComponent,
    },
    {
        path: 'route/:enterprise/:appRoute/:projectLookup',
        component: RoutesComponent,
    },
    { path: 'discover', component: DiscoverComponent },
    { path: 'iot', component: IoTComponent },
    { path: 'enterprise', component: EnterpriseComponent },
    { path: 'enterprise-1', component: Enterprise1Component },
    { path: 'enterprise-2', component: Enterprise2Component },
    { path: 'enterprise-3', component: Enterprise3Component },

    { path: '', component: HomeComponent, pathMatch: 'full' },
    { path: '**', redirectTo: '' },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            scrollPositionRestoration: 'enabled',
        }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
