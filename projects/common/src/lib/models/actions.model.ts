type ButtonType = 'GENERIC' | 'RESET' | 'SAVE';
export class ActionsModel {
    /**
     * The link or model to open
     */
    public Action?: string;

    /**
     * The type of action Link, model
     */
    public ActionType?: string;

    /**
     * Callback function on button click
     */
    public ClickEvent: any;

    /**
     * Angular Material theme color (primary, accent, warn)
     */
    public Color?: string;

    /**
     * The Icon to display
     */
    public Icon?: string;

    /**
     * Button text value
     */
    public Label: string;

    /**
     * Style from parent component
     */
    public Style?: string;

    /**
     * Type of button functionality (reset, save, generic)
     */
    public Type: ButtonType;
}
