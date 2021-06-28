
export class DynamicTabsModel {

    /**
     * Component instance to add to the tab
     */
    public Component: any;

    /**
     * Component data
     */
    public Data?: any;

    /**
     * Tab label
     */
    public Label: string;

    constructor(opts: DynamicTabsModel) {
        Object.assign(this, opts); // destructure values
    }
  }
