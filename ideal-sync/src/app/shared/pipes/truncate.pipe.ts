import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {

  transform(value: string, limit: number = 10, trail: string = '...'): string {
    // console.log('TruncatePipe::limit', limit);
    // console.log('TruncatePipe::trail', trail);
    return (value && value.length > limit) ? value.substring(0, limit) + trail : value;
  }

}
