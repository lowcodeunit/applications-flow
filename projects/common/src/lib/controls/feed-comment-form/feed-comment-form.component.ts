import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
    selector: 'lcu-feed-comment-form',
    templateUrl: './feed-comment-form.component.html',
    styleUrls: ['./feed-comment-form.component.scss'],
})
export class FeedCommentFormComponent implements OnInit {
    public get CommentControl(): AbstractControl {
        return this.FeedCommentsFormGroup?.controls.comment;
    }
    public EditorConfig: AngularEditorConfig;

    public FeedCommentsFormGroup: FormGroup;

    constructor(protected formBuilder: FormBuilder) {
        this.setupEditorConfig();
    }

    public ngOnInit(): void {
        this.buildCommentForm();
    }

    public SubmitComment() {
        console.log(this.CommentControl.value);
    }

    protected buildCommentForm() {
        this.FeedCommentsFormGroup = this.formBuilder.group({
            comment: '',
        });
    }

    protected setupEditorConfig() {
        this.EditorConfig = {
            editable: true,
            spellcheck: true,
            height: '100px',
            minHeight: '0',
            maxHeight: 'auto',
            width: '100%',
            minWidth: '0',
            translate: 'yes',
            enableToolbar: true,
            showToolbar: true,
            placeholder: 'Leave a comment',
            defaultParagraphSeparator: '',
            defaultFontName: '',
            defaultFontSize: '',
            fonts: [
                { class: 'arial', name: 'Arial' },
                { class: 'times-new-roman', name: 'Times New Roman' },
                { class: 'calibri', name: 'Calibri' },
                { class: 'comic-sans-ms', name: 'Comic Sans MS' },
            ],
            customClasses: [
                {
                    name: 'quote',
                    class: 'quote',
                },
                {
                    name: 'redText',
                    class: 'redText',
                },
                {
                    name: 'titleText',
                    class: 'titleText',
                    tag: 'h1',
                },
            ],
            sanitize: true,
            toolbarPosition: 'top',
            toolbarHiddenButtons: [
                [
                    'undo',
                    'redo',
                    'subscript',
                    'superscript',
                    'justifyLeft',
                    'justifyCenter',
                    'justifyRight',
                    'justifyFull',
                    'indent',
                    'outdent',
                    'fontName',
                ],
                [
                    'textColor',
                    'fontSize',
                    'backgroundColor',
                    'customClasses',
                    'link',
                    'unlink',
                    'removeFormat',
                    'insertHorizontalRule',
                ],
            ],
        };
    }
}
