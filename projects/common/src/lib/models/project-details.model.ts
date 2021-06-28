
export class ProjectDetailModel {

    /**
     * Project title
     */
    public Title: string;

    /**
     * Project source
     */
    public Source?: string;

    /**
     * Project URL
     */
    public URL?: string;

    constructor(opts: ProjectDetailModel) {
        Object.assign(this, opts); // destructure values
    }
  }
