import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EnterpriseAsCode } from '@semanticjs/common';
import { AddTeamMemberDialogComponent } from '../../dialogs/add-team-member-dialog/add-team-member-dialog.component';

@Component({
    selector: 'lcu-team-member-card',
    templateUrl: './team-member-card.component.html',
    styleUrls: ['./team-member-card.component.scss'],
})
export class TeamMemberCardComponent implements OnInit {
    @Input('enterprise')
    public Enterprise: EnterpriseAsCode;

    @Input('team-members')
    public TeamMembers: Array<any>;

    @Input('current-user')
    public CurrentUser: string;

    @Input('project-lookup')
    public ProjectLookup: string;

    @Input('projects')
    public Projects: any;

    public SkeletonEffect: string;

    constructor(protected dialog: MatDialog) {
        this.SkeletonEffect = 'wave';
    }

    public ngOnInit(): void {}

    public OpenAddMemberModal() {
        const dialogRef = this.dialog.open(AddTeamMemberDialogComponent, {
            width: '600px',
            data: {
                enterprise: this.Enterprise,
                projectLookup: this.ProjectLookup,
                projects: this.Projects,
            },
        });
    }
}
