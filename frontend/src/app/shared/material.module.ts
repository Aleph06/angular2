import { NgModule } from '@angular/core';
import {
    MatCardModule, MatIconModule, MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatDividerModule,
    MatSnackBarModule, MatRippleModule,
    MatSortModule
} from '@angular/material';

@NgModule({
    exports: [
        MatCardModule, MatIconModule, MatToolbarModule,
        MatFormFieldModule,
        MatInputModule,
        MatOptionModule,
        MatSelectModule,
        MatButtonModule,
        MatTableModule,
        MatDividerModule,
        MatSnackBarModule, MatRippleModule,
        MatSortModule
    ]
})
export class MaterialModule { }
