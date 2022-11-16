import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EaCProjectAsCode, EnterpriseAsCode } from '@semanticjs/common';
import { AddTeamMemberDialogComponent } from '../../dialogs/add-team-member-dialog/add-team-member-dialog.component';

@Component({
    selector: 'lcu-team-member-card',
    templateUrl: './team-member-card.component.html',
    styleUrls: ['./team-member-card.component.scss'],
})
export class TeamMemberCardComponent implements OnInit {
    @Input('enterprise')
    public Enterprise: EnterpriseAsCode;

    public TeamMembers: Array<any>;

    @Input('current-user')
    public CurrentUser: string;

    @Input('project-lookups')
    public ProjectLookups: Array<string>;

    @Input('projects')
    public Projects: any;

    public SkeletonEffect: string;

    constructor(protected dialog: MatDialog) {
        this.SkeletonEffect = 'wave';
    }

    public ngOnInit(): void {}
    public ngOnChanges(): void {
        if (this.Projects) {
            this.TeamMembers = this.BuildTeamMembers();
            //     this.Projects[
            //         this.ProjectLookup
            //     ].RelyingParty?.AccessConfigurations?.fathym?.Usernames;
            // console.log("Projects: ", this.Projects);
        }
    }

    public OpenAddMemberModal() {
        const dialogRef = this.dialog.open(AddTeamMemberDialogComponent, {
            width: '600px',
            data: {
                enterprise: this.Enterprise,
                projectLookup: this.ProjectLookups[0],
                projects: this.Projects,
            },
        });
    }

    protected BuildTeamMembers(): Array<string> {
        let memberList: Array<string> = new Array<string>();
        if (this.CurrentUser) {
            memberList.push(this.CurrentUser);
        }
        this.ProjectLookups.forEach((proj: string) => {
            this.Projects[
                proj
            ].RelyingParty?.AccessConfigurations?.fathym?.Usernames?.forEach(
                (username: string) => {
                    if (!memberList.includes(username)) {
                        memberList.push(username);
                        // console.log("Added: ", username)
                    }
                }
            );
        });
        // console.log("MemberList: ", memberList);
        return memberList;
    }
}
