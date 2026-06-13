import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDate',
  standalone: true
})
export class CustomDatePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    const date = new Date(value);
    return date.toLocaleDateString('he-IL');
  }
}