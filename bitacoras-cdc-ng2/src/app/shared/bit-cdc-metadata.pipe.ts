import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bitCdcMetadata'
})
export class BitCdcMetadataPipe implements PipeTransform {

  transform(value: any, skip?: any): any {
    return `${value['conjuntoCambios']} - ${value['tabla']}`;
  }

}
