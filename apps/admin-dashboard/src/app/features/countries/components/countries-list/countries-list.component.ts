import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageEvent } from '@angular/material/paginator';
import { animate, state, style, transition, trigger } from '@angular/animations';
import {
    Country,
    CountryAirport,
    CountriesService
} from '../../services/countries.service';

@Component({
    selector: 'app-countries-list',
    standalone: false,
    templateUrl: './countries-list.component.html',
    styleUrls: ['./countries-list.component.scss'],
    animations: [
        trigger('detailExpand', [
            state('collapsed,void', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition(
                'expanded <=> collapsed',
                animate('220ms cubic-bezier(0.4, 0.0, 0.2, 1)')
            )
        ])
    ]
})
export class CountriesListComponent implements OnInit {
    countries: Country[] = [];
    totalRecords = 0;
    loading = false;
    page = 1;
    limit = 25;
    searchTerm = '';

    displayedColumns: string[] = [
        'expand',
        'flag',
        'countryCode',
        'countryName',
        'airportCount',
        'cityCount'
    ];

    expandedCountry: Country | null = null;
    airportsCache: Record<string, CountryAirport[]> = {};
    loadingAirports: Record<string, boolean> = {};

    constructor(
        private countriesService: CountriesService,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.loadCountries();
    }

    loadCountries(): void {
        this.loading = true;
        this.countriesService.getCountries(this.page, this.limit, this.searchTerm)
            .subscribe({
                next: (res) => {
                    this.countries = res.data;
                    this.totalRecords = res.total;
                    this.loading = false;
                },
                error: () => {
                    this.snackBar.open('Ülkeler yüklenemedi', 'Kapat', {
                        duration: 3000,
                        horizontalPosition: 'end',
                        verticalPosition: 'top'
                    });
                    this.loading = false;
                }
            });
    }

    onPageChange(event: PageEvent): void {
        this.page = event.pageIndex + 1;
        this.limit = event.pageSize;
        this.loadCountries();
    }

    onSearch(): void {
        this.page = 1;
        this.expandedCountry = null;
        this.loadCountries();
    }

    clearSearch(): void {
        this.searchTerm = '';
        this.onSearch();
    }

    toggleExpand(country: Country): void {
        if (this.expandedCountry?.countryCode === country.countryCode) {
            this.expandedCountry = null;
            return;
        }
        this.expandedCountry = country;
        this.fetchAirports(country.countryCode);
    }

    isExpanded(country: Country): boolean {
        return this.expandedCountry?.countryCode === country.countryCode;
    }

    private fetchAirports(countryCode: string): void {
        if (this.airportsCache[countryCode] || this.loadingAirports[countryCode]) {
            return;
        }
        this.loadingAirports[countryCode] = true;
        this.countriesService.getCountryAirports(countryCode).subscribe({
            next: (list) => {
                this.airportsCache[countryCode] = list;
                this.loadingAirports[countryCode] = false;
            },
            error: () => {
                this.loadingAirports[countryCode] = false;
                this.snackBar.open(
                    `${countryCode} havalimanları yüklenemedi`,
                    'Kapat',
                    { duration: 3000, horizontalPosition: 'end', verticalPosition: 'top' }
                );
            }
        });
    }

    /** ISO 2-letter country code → flag emoji */
    flagFor(code: string): string {
        if (!code || code.length !== 2) return '🌐';
        const A = 0x1f1e6;
        const cc = code.toUpperCase();
        const cp1 = A + (cc.charCodeAt(0) - 'A'.charCodeAt(0));
        const cp2 = A + (cc.charCodeAt(1) - 'A'.charCodeAt(0));
        return String.fromCodePoint(cp1, cp2);
    }
}
