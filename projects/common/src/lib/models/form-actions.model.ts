import { ActionsModel } from './actions.model';

export class FormActionsModel {

    /**
     * Button actions
     */
    public Actions: Array<ActionsModel>;

    /**
     * Simple text on the same line as the buttons
     */
    public Message?: string;
}
