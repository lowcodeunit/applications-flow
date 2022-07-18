import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationsComponent } from './controls/applications/applications.component';
import { ProjectsComponent } from './controls/projects/projects.component';
import { RoutesComponent } from './controls/routes/routes.component';
import { IoTComponent } from './controls/iot/iot.component';
import { DiscoverComponent } from './controls/discover/discover.component';
import { HomeComponent } from './controls/home/home.component';
import { Enterprise4Component } from './controls/enterprise-4/enterprise-4.component';
import { ModifiersComponent } from './controls/modifiers/modifiers.component';
import { DevOpsComponent } from './controls/dev-ops/dev-ops.component';

const routes: Routes = [
    {
        path: 'application/:appLookup/:appRoute/:projectLookup',
        component: ApplicationsComponent,
    },
    {
        path: 'project/:projectLookup',
        component: ProjectsComponent,
    },
    {
        path: 'route/:appRoute/:projectLookup',
        component: RoutesComponent,
    },
    { path: 'devops', component: DevOpsComponent },
    { path: 'discover', component: DiscoverComponent },
    { path: 'enterprise', component: Enterprise4Component },
    { path: 'home', component: HomeComponent },
    { path: 'iot', component: IoTComponent },
    { path: 'modifiers', component: ModifiersComponent },
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
