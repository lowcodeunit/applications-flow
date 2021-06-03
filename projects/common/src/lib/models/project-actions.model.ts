export class ProjectActionsModel {
    /**
     * Click Action
     */
    public Action?: any;
    /**
     * Mat Icon
     */

    public Icon: string;

    /**
     * Tooltip
     */
    public Tooltip?: string;

    constructor(opts: ProjectActionsModel) {
        Object.assign(this, opts); // destructure values
    }
}