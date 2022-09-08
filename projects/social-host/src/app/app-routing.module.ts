import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationsOldComponent } from './controls/applications-old/applications-old.component';
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
import { CustomDomainPageComponent } from './controls/custom-domain-page/custom-domain-page.component';
import { StateConfigPageComponent } from './controls/state-config-page/state-config-page.component';
import { ApplicationComponent } from './controls/application/application.component';

const routes: Routes = [
    {
        path: 'application-old/:appLookup/:appRoute/:projectLookup',
        component: ApplicationsOldComponent,
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
        path: 'routes/:projectLookup',
        component: RoutesPageComponent,
    },
    {
        path: 'application/:appLookup/:appRoute/:projectLookup',
        component: ApplicationComponent,
    },
    { path: 'domains/:projectLookup', component: CustomDomainPageComponent },
    { path: 'devops', component: DevOpsComponent },
    { path: 'discover', component: DiscoverComponent },
    { path: 'iot', component: IoTComponent },
    { path: 'modifiers', component: ModifiersComponent },
    { path: 'modifiers/:projectLookup', component: ModifiersComponent },
    { path: 'projects', component: ProjectPageComponent },
    { path: 'teams', component: TeamMembersComponent },
    {
        path: 'state-config/:projectLookup/:appLookup',
        component: StateConfigPageComponent,
    },
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
