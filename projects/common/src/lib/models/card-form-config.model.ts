import { FormActionsModel } from './form-actions.model';

export class CardFormConfigModel {
    /**
     *  Form button actions
     */
    public FormActions?: FormActionsModel;

    /**
     * Card title icon
     */
    public Icon: string;

    /**
     * Card title
     */
    public Title: string;

    /**
     * Card subtitle
     */
    public Subtitle: string;

    constructor(opts: CardFormConfigModel) {
        Object.assign(this, opts); // destructure values
    }
}
