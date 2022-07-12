import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationsComponent } from './controls/applications/applications.component';
import { EnterpriseComponent } from './controls/enterprise/enterprise.component';
import { ProjectsComponent } from './controls/projects/projects.component';
import { RoutesComponent } from './controls/routes/routes.component';
import { IoTComponent } from './controls/iot/iot.component';
import { DiscoverComponent } from './controls/discover/discover.component';
import { HomeComponent } from './controls/home/home.component';
import { Enterprise4Component } from './controls/enterprise-4/enterprise-4.component';

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
    { path: 'enterprise-0', component: HomeComponent },
    { path: 'enterprise-1', component: EnterpriseComponent },
    { path: 'enterprise-2', component: Enterprise4Component },
    { path: '', component: HomeComponent, pathMatch: 'full' },
    { path: '**', redirectTo: '' },
];
// { path: 'enterprise-1', component: Enterprise1Component },
//     { path: 'enterprise-2', component: Enterprise2Component },
//     { path: 'enterprise-3', component: Enterprise3Component },

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            scrollPositionRestoration: 'enabled',
        }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
