import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'null'
})
export class NullPipe implements PipeTransform {

  transform(value: any, display: any = '') {
    return ((value && String(value).trim().length > 0) ? (value === 'NULL' ? display : value) : display);
  }

}
