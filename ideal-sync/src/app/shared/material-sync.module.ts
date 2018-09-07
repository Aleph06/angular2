import { NgModule, ModuleWithProviders } from '@angular/core';
import {
    MatCardModule, MatButtonModule, MatIconModule, MatInputModule, MatSelectModule, MatChipsModule,
    MatDatepickerModule, MatToolbarModule, MatSnackBarModule, MatNativeDateModule, MatProgressSpinnerModule,
    MatTooltipModule, MatTableModule, MatListModule, MatCheckboxModule, MatAutocompleteModule, MatSliderModule,
    MatMenuModule, MatProgressBarModule, MatDialogModule, MatButtonToggleModule, MatExpansionModule,
    MatTabsModule, MatStepperModule, MatSidenavModule, MatBadgeModule, MAT_DATE_FORMATS
} from '@angular/material';
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorIntlEs } from './services';

export const MY_FORMATS = {
    parse: {
        dateInput: { month: '2-digit', year: 'numeric', day: '2-digit' },
    },
    display: {
        dateInput: { month: '2-digit', year: 'numeric', day: '2-digit' },
        monthYearLabel: { year: 'numeric', month: 'long' },
        dateA11yLabel: { year: 'numeric', month: 'long', day: '2-digit' },
        monthYearA11yLabel: { year: 'numeric', month: 'long' },
    }
};

@NgModule({
    imports: [],
    exports: [MatCardModule, MatButtonModule, MatIconModule, MatInputModule, MatSelectModule, MatChipsModule,
        MatDatepickerModule, MatToolbarModule, MatSnackBarModule, MatNativeDateModule, MatProgressSpinnerModule,
        MatTooltipModule, MatTableModule, MatListModule, MatCheckboxModule, MatAutocompleteModule, MatSliderModule,
        MatMenuModule, MatProgressBarModule, MatDialogModule, MatPaginatorModule, MatSortModule, MatButtonToggleModule,
        MatExpansionModule, MatTabsModule, MatStepperModule, MatSidenavModule, MatBadgeModule],
    providers: [
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
        { provide: MatPaginatorIntl, useClass: MatPaginatorIntlEs }
    ]
})
export class MaterialSyncModule { }
