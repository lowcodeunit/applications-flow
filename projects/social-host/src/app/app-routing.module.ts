import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationsComponent } from './controls/applications/applications.component';
import { RoutesComponent } from './controls/routes/routes.component';
import { IoTComponent } from './controls/iot/iot.component';
import { DiscoverComponent } from './controls/discover/discover.component';
import { HomeComponent } from './controls/home/home.component';
import { Enterprise4Component } from './controls/enterprise/enterprise.component';
import { ModifiersComponent } from './controls/modifiers/modifiers.component';
import { DevOpsComponent } from './controls/dev-ops/dev-ops.component';
import { TeamMembersComponent } from './controls/team-members/team-members.component';
import { ProjectPageComponent } from './controls/project-page/project-page.component';
import { ProjectComponent } from './controls/project/project.component';
import { RoutesPageComponent } from './controls/routes-page/routes-page.component';

const routes: Routes = [
    {
        path: 'application/:appLookup/:appRoute/:projectLookup',
        component: ApplicationsComponent,
    },
    {
        path: 'project/:projectLookup',
        component: ProjectComponent,
    },
    {
        path: 'route/:appRoute/:projectLookup',
        component: RoutesComponent,
    },
    {
        path: 'applications/:projectLookup',
        component: RoutesPageComponent,
    },
    { path: 'devops', component: DevOpsComponent },
    { path: 'discover', component: DiscoverComponent },
    { path: 'iot', component: IoTComponent },
    { path: 'modifiers', component: ModifiersComponent },
    { path: 'modifiers/:projectLookup', component: ModifiersComponent },
    { path: 'projects', component: ProjectPageComponent },
    { path: 'teams', component: TeamMembersComponent },
    { path: 'activity', component: HomeComponent },
    { path: '', component: Enterprise4Component, pathMatch: 'full' },
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
