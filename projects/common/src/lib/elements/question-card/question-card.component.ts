import { Component, Input, OnInit } from '@angular/core';
import { ActionsModel } from '../../models/actions.model';
import { Question } from '../../models/user-feed.model';

@Component({
    selector: 'lcu-question-card',
    templateUrl: './question-card.component.html',
    styleUrls: ['./question-card.component.scss'],
})
export class QuestionCardComponent implements OnInit {
    @Input('questions')
    public Questions: Array<Question>;

    public CurrentQuestion: Question;

    public QuestionIndex: number;

    constructor() {}

    ngOnInit(): void {}

    ngOnChanges() {
        // console.log('Questions: ', this.Questions);
        if (this.Questions?.length > 0 && !this.QuestionIndex) {
            this.QuestionIndex = 0;
            this.CurrentQuestion = this.Questions[this.QuestionIndex];
        }
    }

    public HandleAnswerBtn(action: ActionsModel) {
        let type = action.ActionType;
        if (type.toLowerCase() === 'next') {
            this.NextQuestion();
        }
        if (type.toLowerCase() === 'link') {
            this.handleLink(action.Action);
        }
    }

    public NextQuestion() {
        if (this.QuestionIndex + 1 >= this.Questions.length) {
            this.CurrentQuestion = this.Questions[0];
            this.QuestionIndex = 0;
        } else {
            this.CurrentQuestion = this.Questions[this.QuestionIndex + 1];
            this.QuestionIndex += 1;
        }
    }

    protected handleLink(link: string) {
        window.location.href = link;
    }
}
