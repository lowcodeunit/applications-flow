/**
 * Model for form values
 *
 */
export class FormValuesModel {
    /**
     * Form ID
     */
    public Id: string;

    /**
     * Form values
     */
    public Values: object;

    constructor(id: string, values: object) {
        this.Id = id;
        this.Values = values;
    }
}
