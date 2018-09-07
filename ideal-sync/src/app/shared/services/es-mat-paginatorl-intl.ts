import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material';

@Injectable()
export class MatPaginatorIntlEs extends MatPaginatorIntl {

    lastPageLabel = 'Última página';
    firstPageLabel = 'Primera página';
    itemsPerPageLabel = 'Registros por página';
    nextPageLabel = 'Siguiente página';
    /**
     * A label for the button that decrements the current page.
     */
    previousPageLabel = 'Página anterior';
    /**
     * A label for the range of items within the current page and the length of the whole list.
     */
    getRangeLabel = function (page, pageSize, length) {
        if (length === 0 || pageSize === 0) {
            return '0 de ' + length;
        }
        length = Math.max(length, 0);
        const /** @type {?} */ startIndex = page * pageSize;
        // If the start index exceeds the list length, do not try and fix the end index to the end.
        const /** @type {?} */ endIndex = startIndex < length ?
            Math.min(startIndex + pageSize, length) :
            startIndex + pageSize;
        return startIndex + 1 + ' - ' + endIndex + ' de ' + length;
    };
}
