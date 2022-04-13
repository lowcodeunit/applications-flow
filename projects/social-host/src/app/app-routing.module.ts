import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationsComponent } from './controls/applications/applications.component';
import { EnterpriseComponent } from './controls/enterprise/enterprise.component';
import { ProjectsComponent } from './controls/projects/projects.component';
import { RoutesComponent } from './controls/routes/routes.component';
import { IoTComponent } from './controls/iot/iot.component';

const routes: Routes = [
    {
        path: 'application/:appLookup/:appRoute/:projectLookup',
        component: ApplicationsComponent,
    },
    { path: '', component: EnterpriseComponent },
    { path: 'project/:projectLookup', component: ProjectsComponent },
    { path: 'route/:appRoute/:projectLookup', component: RoutesComponent },
    { path: 'iiot', component: IoTComponent },
    { path: '', redirectTo: 'enterprises', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
