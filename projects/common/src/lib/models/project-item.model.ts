import { ProjectActionsModel } from './project-actions.model';
import { ProjectDetailModel } from './project-details.model';

export class ProjectItemModel {

    /**
     * Project action icons
     */
    public Actions: Array<ProjectActionsModel>;

    /**
     * Project image
     */
    public Image: string;

     /**
      * Project details
      */
     public Details: ProjectDetailModel;

    constructor(opts: ProjectItemModel) {
        Object.assign(this, opts); // destructure values
    }
  }
