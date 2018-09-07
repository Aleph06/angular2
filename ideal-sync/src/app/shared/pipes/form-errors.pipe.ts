import { FormGroup, ValidationErrors } from '@angular/forms';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formErrors'
})
export class FormErrorsPipe implements PipeTransform {

  transform(value: FormGroup): string {
    let out = '';
    if (value && value.controls) {
      Object.keys(value.controls).forEach(key => {
        const controlErrors: ValidationErrors = value.get(key).errors;
        if (controlErrors != null) {
          Object.keys(controlErrors).forEach(keyError => {
            out = `${out}{Key control: ${key}, keyError: ${keyError}, err value: ${controlErrors[keyError]}}`;
          });
        }
      });
    }

    return out;
  }

}
