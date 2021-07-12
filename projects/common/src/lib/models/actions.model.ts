type ButtonType = 'GENERIC' | 'RESET' | 'SAVE';
export class ActionsModel {

  /**
   * Callback function on button click
   */
  public ClickEvent: any;

  /**
   * Angular Material theme color (primary, accent, warn)
   */
  public Color?: string;

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
