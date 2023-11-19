import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'roundUp'
})
export class RoundUpPipe implements PipeTransform {
  transform(value: number): number {
    if (typeof value !== 'number') {
      return value;
    }
   
    // Truncate to 2 decimal places
    const truncatedValue = Math.floor(value * 100) / 100;
    // Round up to the nearest 1 decimal place
    return Math.ceil(truncatedValue * 10) / 10;
  }
}