import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { EaCService } from '../../services/eac.service';

@Component({
    selector: 'lcu-feed-filter',
    templateUrl: './feed-filter.component.html',
    styleUrls: ['./feed-filter.component.scss'],
})
export class FeedFilterComponent implements OnInit {
    @Input('feed-check')
    public FeedCheck: any;

    @Input('filter-types')
    public FilterTypes: Array<string>;

    public FilterFormGroup: FormGroup;

    public Filters: Array<any>;

    public MenuOpen: boolean;

    protected filterString: string;

    get filtersFormArray() {
        return this.FilterFormGroup.controls.filters as FormArray;
    }

    constructor(
        protected eacSvc: EaCService,
        protected formBuilder: FormBuilder
    ) {
        this.FilterFormGroup = this.formBuilder.group({
            filters: new FormArray([]),
        });

        this.Filters = new Array<any>();
    }

    public ngOnInit(): void {
        if (this.FilterTypes?.length > 0) {
            this.filterString = this.setFilterString(this.FilterTypes);
        }

        if (this.filterString?.length > 0) {
            this.Filters = this.buildFilterObject(this.filterString);
        }

        if (this.Filters?.length > 0) {
            this.addCheckboxes();
        }
    }

    public ngOnChanges() {
        if (this.FilterTypes?.length > this.Filters?.length) {
            this.filterString = this.setFilterString(this.FilterTypes);
            this.Filters = this.buildFilterObject(this.filterString);
            this.addCheckboxes();
        }

        // if (this.filterString?.length > 0) {

        // }

        // if (this.Filters?.length > 0) {

        // }
    }

    protected addCheckboxes() {
        this.filtersFormArray.clear();
        this.Filters.forEach((filter) =>
            this.filtersFormArray.push(new FormControl(filter.Value))
        );
    }

    protected buildFilterObject(fstring: string): Array<any> {
        let filterList = fstring.split(';');

        let filterObjList = new Array<any>();

        filterList.forEach((itm) => {
            if (itm.length > 0) {
                filterObjList.push(JSON.parse(itm));
            }
        });

        return filterObjList;
    }

    protected setFilterString(fTypes: Array<string>): string {
        let fString = '';
        let filters = fTypes;
        if (localStorage.getItem('activeFilter')) {
            let activeF = localStorage.getItem('activeFilter').split(',');
            activeF.forEach((f) => {
                if (f.includes('-')) {
                    let i = activeF.indexOf(f);
                    f = f.replace('-', ' ');
                    activeF[i] = f;
                }
            });

            filters.forEach((filter) => {
                if (activeF.includes(filter.toLowerCase())) {
                    fString += '{ "Name":"' + filter + '","Value":true };';
                } else if (
                    activeF.includes(filter.toLowerCase()) &&
                    filters.indexOf(filter) === filters.length - 1
                ) {
                    fString += '{ "Name":"' + filter + '","Value":true }';
                } else if (filters.indexOf(filter) === filters.length - 1) {
                    fString += '{ "Name":"' + filter + '","Value":false }';
                } else {
                    fString += '{ "Name":"' + filter + '","Value":false };';
                }
            });
        } else {
            filters.forEach((filter) => {
                if (filter.toLowerCase() === 'all') {
                    fString += '{ "Name":"' + filter + '","Value":true };';
                } else if (filters.indexOf(filter) === filters.length - 1) {
                    fString += '{ "Name":"' + filter + '","Value":true }';
                } else {
                    fString += '{ "Name":"' + filter + '","Value":true };';
                }
            });
        }
        return fString;
    }

    public ReloadFeed(): void {
        this.eacSvc.ReloadFeed();
    }

    public ToggleFilter(name: string) {
        let filt = this.Filters.find((filter) => filter.Name === name);
        let allFilt = this.Filters.find(
            (filter) => filter.Name.toLowerCase() === 'all'
        );

        if (name.toLowerCase() === 'all') {
            allFilt.Value = !allFilt.Value;
            this.Filters.forEach((filter) => {
                if (filter.Name.toLowerCase() !== 'all') {
                    filter.Value = allFilt.Value;
                }
            });
        } else if (filt.Name === name) {
            filt.Value = !filt.Value;
            if (allFilt.Value === true) {
                allFilt.Value = false;
            }
        }

        this.addCheckboxes();
    }

    public Apply() {
        let types = '';
        this.Filters.forEach((fil) => {
            if (fil.Value === true) {
                let temp = fil.Name;
                if (temp.includes(' ')) {
                    temp = temp.replace(' ', '-');
                }
                types += temp.toLowerCase() + ',';
            }
        });
        if (types.charAt(types.length - 1) === ',') {
            types = types.substring(0, types.length - 1);
        }
        this.StoreActiveFilter(types);

        this.eacSvc.LoadUserFeed(1, 25, false, types);
    }

    public StoreActiveFilter(types: string) {
        localStorage.setItem('activeFilter', types);
    }
}
