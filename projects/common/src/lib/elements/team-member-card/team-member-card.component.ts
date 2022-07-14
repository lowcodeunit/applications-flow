import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'lcu-team-member-card',
    templateUrl: './team-member-card.component.html',
    styleUrls: ['./team-member-card.component.scss'],
})
export class TeamMemberCardComponent implements OnInit {
    @Input('team-members')
    public TeamMembers: Array<any>;

    @Input('current-user')
    public CurrentUser: string;

    constructor() {}

    ngOnInit(): void {}
}
