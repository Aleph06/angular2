import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bitCdcLlave'
})
export class BitCdcLlavePipe implements PipeTransform {

  transform(value: Array<{ [key: string]: string }>, include?: Array<string>): any {
    let llaveStr = new Array<string>();
    value.forEach(llave => {
      console.log('k', llave);
      include.forEach(idx => {
        if (llave[idx] != null && llave[idx] !== undefined) {
          llaveStr.push(llave[idx]);
        }
      });
    });
    return llaveStr.join(',');
  }

}
