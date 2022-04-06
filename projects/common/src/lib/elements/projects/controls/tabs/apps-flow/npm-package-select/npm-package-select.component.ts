import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { debounceTime, map, switchMap } from 'rxjs/operators';
import { NPMService } from '../../../../../../services/npm.service';

@Component({
    selector: 'lcu-npm-package-select',
    templateUrl: './npm-package-select.component.html',
    styleUrls: ['./npm-package-select.component.scss'],
})
export class NpmPackageSelectComponent implements OnInit {
    //  Fields

    //  Properties
    @Input('npm-package')
    public NPMPackage: string;

    @Input('npm-package-version')
    public NPMPackageVersion: string;

    @Input('form-group')
    public FormGroup: FormGroup;

    public NPMPackages: { Name: string; NPMLink: string; Version: string }[];

    public NPMPackageVersions: string[];

    //  Constructors
    constructor(protected npm: NPMService) {}

    //  Life Cycle
    public ngOnDestroy(): void {
        this.FormGroup.removeControl('package');

        this.FormGroup.removeControl('version');
    }

    public ngOnInit(): void {
        this.FormGroup.addControl(
            'package',
            new FormControl(this.NPMPackage || '', [Validators.required])
        );

        this.FormGroup.addControl(
            'version',
            new FormControl(this.NPMPackageVersion || 'latest', [
                Validators.required,
            ])
        );

        this.FormGroup.controls.package.valueChanges
            .pipe(
                debounceTime(500),
                switchMap((value) =>
                    this.npm.Search(value ? value.toString() : '')
                ),
                map((val) => {
                    return val.Model
                        ? val.Model.Items.map((i) => {
                              return {
                                  Name: i.package.name,
                                  Version: i.package.version,
                                  NPMLink: i.package.links.npm,
                              };
                          })
                        : [];
                })
            )
            .subscribe((packages) => {
                this.NPMPackages = packages;
            });
    }

    //  API Methods
    public PackageSelected(event: MatAutocompleteSelectedEvent) {
        const pkg = this.NPMPackages.find((p) => p.Name === event.option.value);

        if (!this.FormGroup.controls.version.value) {
            this.FormGroup.controls.version.setValue(pkg.Version);

            this.npm.Versions(pkg.Name).subscribe((pkgDetails: any) => {
                const tags = Object.keys(pkgDetails['dist-tags']);

                const versions = Object.keys(pkgDetails['versions']);

                this.NPMPackageVersions = [...tags, ...versions];
            });
        }
    }

    //  Helpers
}
