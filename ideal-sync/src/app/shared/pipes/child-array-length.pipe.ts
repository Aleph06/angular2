import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'childArrayLength'
})
export class ChildArrayLengthPipe implements PipeTransform {

  transform(value: any[], child?: string): any {
    return value.map(m => (<any[]>m[child]).length).reduce((a, b) => a + b);
  }

}
