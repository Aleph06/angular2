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
    MatSnackBarModule
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
        MatSnackBarModule
    ]
})
export class MaterialModule { }
